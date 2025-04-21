import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/utils/supabase';
// Assuming you have generated Supabase types (optional but recommended)
// import type { Database } from '@/types_db'; 

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Analysis ID is required' }, { status: 400 });
  }

  const cookieStore = cookies();
  // Use createServerClient from @supabase/ssr
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
      if (sessionError) console.error('Session Error:', sessionError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // Fetch the analysis result using admin client to bypass RLS initially
    const { data: analysis, error: analysisError } = await supabaseAdmin
      .from('analysis_results') // Correct table name
      // Specify the columns explicitly if using generated types, otherwise '*'
      .select('*') 
      .eq('id', id)
      .single(); // Use single() to ensure it exists, throws error if not found

    if (analysisError) {
      if (analysisError.code === 'PGRST116') { // PostgREST code for "Resource Not Found"
          return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
      }
      console.error('Error fetching analysis:', analysisError);
      return NextResponse.json({ error: 'Failed to fetch analysis result' }, { status: 500 });
    }

    // Verify ownership - safeguard, RLS on select should already handle this for non-admin queries
    if (analysis.user_id !== userId) {
      console.warn(`User ${userId} attempted to access analysis ${id} owned by ${analysis.user_id}`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check for a completed purchase linked to this analysis for this user
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('purchases') // Correct table name
      .select('id') // We only need to know if it exists
      .eq('analysis_result_id', id) // Match the analysis result ID
      .eq('user_id', userId)       // Match the user ID
      .eq('status', 'completed')   // Ensure purchase is complete
      .maybeSingle(); // Use maybeSingle as purchase might not exist

    if (purchaseError) {
      console.error('Error checking purchase status:', purchaseError);
      // Fail closed for security
      return NextResponse.json({ error: 'Failed to verify purchase status' }, { status: 500 });
    }

    let resultToSend;
    if (purchase) {
      // User has paid, send the full analysis
      resultToSend = analysis;
    } else {
      // User has not paid, send partial analysis by removing/nullifying full_analysis
      const { full_analysis, ...partialAnalysis } = analysis;
      resultToSend = { ...partialAnalysis, full_analysis: null }; // Explicitly set to null
    }

    return NextResponse.json(resultToSend);

  } catch (err: any) {
      // Catch potential errors from .single() if analysis not found (already handled above)
      // Or other unexpected errors
      console.error('Error in GET /api/analysis/[id]:', err);
       if (err.code === 'PGRST116') { 
           return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
       }
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

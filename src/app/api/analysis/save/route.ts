import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { AnalysisResult } from '@/types';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Save analysis error: User not authenticated.', authError);
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const analysisResult: AnalysisResult = await request.json();

    if (!analysisResult || !analysisResult.painPoints || !analysisResult.freeRecommendation || !analysisResult.fullAnalysis) {
      console.error('Save analysis error: Invalid analysisResult data received.');
      return NextResponse.json({ error: 'Invalid analysis data received.' }, { status: 400 });
    }

    const { data, error: dbError } = await supabase
      .from('analysis_results')
      .insert({
        user_id: user.id,
        pain_points: analysisResult.painPoints,
        free_recommendation: analysisResult.freeRecommendation,
        full_analysis: analysisResult.fullAnalysis,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Supabase DB error saving analysis result:', dbError);
      throw new Error(dbError.message || 'Failed to save analysis result to database.');
    }
    
    if (!data || !data.id) {
      console.error('Supabase DB error: No ID returned after insert.');
      throw new Error('Failed to retrieve ID after saving analysis result.');
    }

    return NextResponse.json({ success: true, id: data.id });

  } catch (err: any) {
    console.error('Error in /api/analysis/save:', err);
    return NextResponse.json({ error: err.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

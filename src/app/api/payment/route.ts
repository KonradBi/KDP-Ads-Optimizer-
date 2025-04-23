import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/utils/stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/utils/supabase'; // Use admin for insertion

export async function POST(request: NextRequest) {
  console.log('--- Payment API route started ---'); // Added for context
  console.log('Reading STRIPE_PRICE_ID:', process.env.STRIPE_PRICE_ID); // Debug log for Price ID
  console.log('Backend: Received request headers:', JSON.stringify(Object.fromEntries(request.headers.entries()))); // Log headers for debugging auth

  // Clone the request to read the body, as it can only be read once
  const requestClone = request.clone();
  try {
    const rawBody = await requestClone.text(); // Read as text first
    console.log('Backend: Received raw request body:', rawBody);
  } catch (e) {
    console.error('Backend: Error reading raw request body:', e);
  }

  try {
    // Get the site URL from environment variables
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    // Use non-public environment variable for Price ID
    const priceId = process.env.STRIPE_PRICE_ID; 

    if (!priceId) {
      console.error('Error: STRIPE_PRICE_ID environment variable is not set or accessible.'); // More specific error log
      return NextResponse.json({ error: 'Price ID is not configured.' }, { status: 500 });
    }

    // --- Get analysisResultId from request body ---
    const { analysisResultId }: { analysisResultId?: string } = await request.json();
    console.log('Backend: Parsed analysisResultId from body:', analysisResultId); // Log parsed ID

    if (!analysisResultId) {
      return NextResponse.json({ error: 'Analysis Result ID is required.' }, { status: 400 });
    }

    // --- Get User ID --- 
    const cookieStore = cookies();
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
    let { data: { session: userSession }, error: sessionError } = await supabase.auth.getSession();

    // Fallback: if no cookie session, try Authorization header (Bearer <token>)
    if (!userSession?.user) {
      const authHeader = request.headers.get('authorization');
      const bearerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : undefined;

      if (bearerToken) {
        const { data: userData, error: tokenError } = await supabase.auth.getUser(bearerToken);
        if (tokenError) {
          console.error('Token auth error:', tokenError);
        }
        if (userData?.user) {
          // Create a pseudo-session object with the user
          userSession = { user: userData.user } as any;
        }
      }
    }

    if (!userSession?.user) {
      if (sessionError) console.error('Auth Error:', sessionError);
      return NextResponse.json(
        { error: 'Unauthorized. User must be logged in to proceed with payment.' },
        { status: 401 }
      );
    }

    const userId = userSession.user.id;

    // Construct success and cancel URLs
    // Redirect to the specific analysis page upon success
    const successUrl = `${siteUrl}/results?analysis_id=${analysisResultId}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/upload`; // Back to upload page on cancel

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Add customer_email for prefill if user is logged in
      customer_email: userSession.user.email,
      metadata: {
        analysis_result_id: analysisResultId,
        user_id: userId, // Include user ID in metadata
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create Stripe session.' }, { status: 500 });
    }

    // --- Store the initial purchase record in Supabase --- 
    if (session.id && session.amount_total != null) {
      const { data: purchaseData, error: insertError } = await supabaseAdmin
        .from('purchases')
        .insert([
          {
            user_id: userId,
            stripe_session_id: session.id,
            price_id: priceId,
            status: 'pending',
            amount: session.amount_total,
            currency: session.currency || 'usd',
            analysis_result_id: analysisResultId,
          },
        ])
        .select();
      if (insertError) {
        console.error('Error inserting purchase record:', insertError);
        return NextResponse.json(
          { error: 'Failed to store purchase details.', supabaseError: insertError.message },
          { status: 500 }
        );
      }
      console.log('Initial purchase record created for session:', session.id);
      // Link analysis result to user immediately on purchase
      await supabaseAdmin
        .from('analysis_results')
        .update({ user_id: userId })
        .eq('id', analysisResultId);
    }

    // Return the session ID and URL
    return NextResponse.json({
      id: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}

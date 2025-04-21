import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/utils/stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/utils/supabase'; // Use admin for insertion

export async function POST(request: NextRequest) {
  try {
    // Get the site URL from environment variables
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const priceId = process.env.NEXT_PUBLIC_PRICE_ID;

    // --- Get analysisResultId from request body ---
    const { analysisResultId }: { analysisResultId?: string } = await request.json();

    if (!analysisResultId) {
      return NextResponse.json({ error: 'Analysis Result ID is required.' }, { status: 400 });
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is not configured.' },
        { status: 500 }
      );
    }

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
      success_url: `${siteUrl}/results?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}`,
      metadata: {
        analysis_result_id: analysisResultId,
      },
    });

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
    const { data: { session: userSession }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !userSession?.user) {
      if (sessionError) console.error('Auth Error:', sessionError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = userSession.user.id;

    // --- Store the initial purchase record in Supabase --- 
    if (session.id && session.amount_total != null) {
      const { error: insertError } = await supabaseAdmin.from('purchases').insert({
        user_id: userId,
        stripe_session_id: session.id,
        price_id: priceId,
        status: 'pending', // Initial status
        amount: session.amount_total, // Amount in cents
        currency: session.currency || 'usd', // Get currency from session
        analysis_result_id: analysisResultId, // Store the analysis ID immediately
      });
      if (insertError) {
        console.error('Error inserting purchase record:', insertError);
        // Optionally: try to cancel the Stripe session? Difficult.
        // For now, just log and potentially alert.
        // Return an error to the client
        return NextResponse.json(
          { error: 'Failed to store purchase details. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Return the session ID and URL
    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating payment session:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the payment session.' },
      { status: 500 }
    );
  }
}

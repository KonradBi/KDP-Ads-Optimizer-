import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/utils/stripe';
import { supabase } from '@/lib/utils/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get the site URL from environment variables
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const priceId = process.env.NEXT_PUBLIC_PRICE_ID;
    
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
    });
    
    // Store the session in Supabase (optional, for tracking)
    if (session.id) {
      await supabase.from('payment_sessions').insert({
        session_id: session.id,
        created_at: new Date().toISOString(),
        status: 'created',
      });
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

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/utils/stripe';
import { supabaseAdmin } from '@/lib/utils/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get the session ID from the URL
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required.' },
        { status: 400 }
      );
    }
    
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Verify the payment status
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment has not been completed.' },
        { status: 400 }
      );
    }
    
    // Update the purchase status in Supabase
    await supabaseAdmin
      .from('purchases')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('stripe_session_id', sessionId);
    
    // Return success
    return NextResponse.json({
      success: true,
      paid: true,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'An error occurred while verifying the payment.' },
      { status: 500 }
    );
  }
}

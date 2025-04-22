import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/utils/stripe';
import { supabaseAdmin } from '@/lib/utils/supabase';

// This is your Stripe CLI webhook secret for testing your endpoint locally.
// In production, set this in your Vercel environment variables.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Ensure the secret is configured
if (!endpointSecret) {
  console.error('FATAL ERROR: STRIPE_WEBHOOK_SECRET is not set.');
  // Optionally, throw an error during build or startup in a real app
}

export async function POST(request: NextRequest) {
  if (!endpointSecret) {
    // Added runtime check as well, though the startup check is better
    console.error('Stripe Webhook Secret not configured.');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }

  const sig = headers().get('stripe-signature');
  let event: Stripe.Event;

  try {
    const rawBody = await request.text(); // Use text() to get raw body for verification
    if (!sig) {
      console.error('Stripe signature header missing.');
      return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    console.log('Webhook event constructed successfully:', event.id, event.type);

  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Processing checkout.session.completed for session: ${session.id}`);
      
      // Extract metadata
      const analysisResultId = session.metadata?.analysis_result_id;
      const userId = session.metadata?.user_id;

      if (!analysisResultId || !userId) {
          console.error(`Missing metadata in checkout session ${session.id}: analysisResultId=${analysisResultId}, userId=${userId}`);
          // Return 500 because the previous step should have included this
          return NextResponse.json({ error: 'Internal Server Error: Missing required metadata.' }, { status: 500 });
      }

      // Check if payment was successful
      if (session.payment_status === 'paid') {
        console.log(`Payment successful for session: ${session.id}. Attempting to update purchase record.`);
        
        try {
          // Update the purchase status in Supabase
          // Check if it's already completed to handle potential duplicate webhooks
          const { data: existingPurchase, error: fetchError } = await supabaseAdmin
            .from('purchases')
            .select('status')
            .eq('stripe_session_id', session.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: row not found (shouldn't happen if created before checkout)
            console.error(`Error fetching purchase record for session ${session.id}:`, fetchError);
            return NextResponse.json({ error: 'Failed to fetch purchase record.' }, { status: 500 });
          }

          if (existingPurchase?.status === 'completed') {
            console.log(`Purchase record for session ${session.id} is already completed. Skipping update.`);
          } else {
            const { error: updateError } = await supabaseAdmin
              .from('purchases')
              .update({ status: 'completed', updated_at: new Date().toISOString() })
              .eq('stripe_session_id', session.id)
              .eq('status', 'pending'); // Only update if status is 'pending'

            if (updateError) {
              console.error(`Error updating purchase record for session ${session.id}:`, updateError);
              // Respond with 500, Stripe will retry
              return NextResponse.json({ error: 'Failed to update purchase status.' }, { status: 500 });
            }
            console.log(`Successfully updated purchase record for session ${session.id} to completed.`);
          }

          // Optional: Trigger post-purchase actions here (e.g., grant access, send email)
          // Be mindful of execution time, long tasks should be deferred (e.g., using a queue or Supabase Edge Function)

        } catch (dbError: any) {
            console.error(`Database operation failed for session ${session.id}:`, dbError);
            return NextResponse.json({ error: 'Database error processing webhook.' }, { status: 500 });
        }

      } else {
        console.warn(`Checkout session ${session.id} completed but payment status is ${session.payment_status}. No action taken.`);
      }
      break;
    
    // Example: Handle other event types if needed in the future
    // case 'payment_intent.succeeded':
    //   const paymentIntent = event.data.object as Stripe.PaymentIntent;
    //   console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
    //   // Then define and call a function to handle the successful payment intent.
    //   // handlePaymentIntentSucceeded(paymentIntent);
    //   break;
    // case 'payment_method.attached':
    //   const paymentMethod = event.data.object as Stripe.PaymentMethod;
    //   // Then define and call a function to handle the successful attachment of a PaymentMethod.
    //   // handlePaymentMethodAttached(paymentMethod);
    //   break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}

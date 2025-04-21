import { NextResponse } from 'next/server';
import { stripe } from '@/lib/utils/stripe';
import { supabaseAdmin } from '@/lib/utils/supabase';

// Webhook signing secret from Supabase ENV
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  const buf = await request.arrayBuffer();
  const payload = Buffer.from(buf);
  const sig = request.headers.get('stripe-signature') || '';
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    // Cast to any since Stripe types are not recognized at build time
    const session = event.data.object as any;
    const userId = session.metadata?.user_id;
    await supabaseAdmin
      .from('purchases')
      .insert({
        stripe_session_id: session.id,
        price_id: session.metadata?.price_id,
        user_id: userId,
        status: session.payment_status,
        amount: session.amount_total,
        currency: session.currency,
      });
  }

  return NextResponse.json({ received: true });
}

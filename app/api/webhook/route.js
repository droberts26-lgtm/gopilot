import Stripe from 'stripe';
import { getSupabase } from '@/lib/supabase';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return Response.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const sig = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch {
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const cs = event.data.object;
    if (cs.payment_status === 'paid') {
      const supabase = getSupabase();
      if (!supabase) {
        // Return 503 so Stripe retries until Supabase is available
        return Response.json({ error: 'Database not configured' }, { status: 503 });
      }

      const userId = cs.client_reference_id || null;
      const email  = cs.customer_email?.toLowerCase() || null;

      if (!userId && !email) {
        return Response.json({ error: 'No user identifier in session' }, { status: 400 });
      }

      // Upsert by user_id if present, otherwise by email
      const { error } = await supabase
        .from('pro_users')
        .upsert(
          { user_id: userId, email, source: 'stripe', granted_at: new Date().toISOString() },
          { onConflict: userId ? 'user_id' : 'email' }
        );

      if (error) {
        console.error('Supabase upsert error:', error);
        return Response.json({ error: 'Failed to record Pro access' }, { status: 500 });
      }
    }
  }

  return Response.json({ received: true });
}

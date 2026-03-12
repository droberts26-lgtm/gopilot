import Stripe from 'stripe';
import { Redis } from '@upstash/redis';
import { proKey, proEmailKey } from '@/lib/pro';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
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
      const redis = getRedis();
      // Return 503 so Stripe retries if Redis is unavailable
      if (!redis) {
        return Response.json({ error: 'Redis not configured' }, { status: 503 });
      }

      // Store Pro by user ID (primary) and email (fallback)
      // Both are checked on sign-in so either one grants access
      const writes = [];
      if (cs.client_reference_id) {
        writes.push(redis.set(proKey(cs.client_reference_id), true));
      }
      if (cs.customer_email) {
        writes.push(redis.set(proEmailKey(cs.customer_email), true));
      }

      if (writes.length === 0) {
        // No identifiers — return 400 so Stripe retries with fresh data
        return Response.json({ error: 'No user identifier in session' }, { status: 400 });
      }

      await Promise.all(writes);
    }
  }

  return Response.json({ received: true });
}

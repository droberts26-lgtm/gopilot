import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const stripe = getStripe();
  if (!stripe) return Response.json({ error: 'Payment not configured' }, { status: 503 });

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) return Response.json({ error: 'Payment not configured' }, { status: 503 });

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: session.user.id,
    customer_email: session.user.email,
    success_url: `${baseUrl}/pro/success`,
    cancel_url: `${baseUrl}/`,
  });

  return Response.json({ url: checkoutSession.url });
}

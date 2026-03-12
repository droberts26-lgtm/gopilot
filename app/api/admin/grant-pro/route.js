import { Redis } from '@upstash/redis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isPro, proEmailKey } from '@/lib/pro';

function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// POST /api/admin/grant-pro  { email: "user@example.com" }
// Only accessible to accounts in the Pro email bypass list (owner accounts).
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !isPro(session)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email } = await request.json();
  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'email is required' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return Response.json({ error: 'Redis not configured' }, { status: 503 });
  }

  await redis.set(proEmailKey(email.toLowerCase().trim()), true);
  return Response.json({ ok: true, granted: email.toLowerCase().trim() });
}

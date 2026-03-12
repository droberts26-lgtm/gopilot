import { Redis } from '@upstash/redis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isPro, proKey, proEmailKey } from '@/lib/pro';

function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ pro: false });

  // Fast path: hardcoded email bypass (owner accounts)
  if (isPro(session)) return Response.json({ pro: true });

  const redis = getRedis();
  if (!redis) return Response.json({ pro: false });

  // Check by user ID (set by webhook using client_reference_id)
  const byId = await redis.get(proKey(session.user.id));
  if (byId) return Response.json({ pro: true });

  // Fallback: check by email (set by webhook using customer_email)
  if (session.user.email) {
    const byEmail = await redis.get(proEmailKey(session.user.email));
    if (byEmail) return Response.json({ pro: true });
  }

  return Response.json({ pro: false });
}

import { Redis } from '@upstash/redis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isPro, proKey } from '@/lib/pro';

function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ pro: false });

  // Fast path: hardcoded email bypass
  if (isPro(session)) return Response.json({ pro: true });

  // Redis path: check if user has paid
  const redis = getRedis();
  if (!redis) return Response.json({ pro: false });

  const val = await redis.get(proKey(session.user.id));
  return Response.json({ pro: val === true });
}

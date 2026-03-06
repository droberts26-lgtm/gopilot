import { Redis } from '@upstash/redis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const userKey = (id) => `user:${id}:progress`;

function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const redis = getRedis();
  if (!redis) return Response.json({ learnSession: null, matchingTimes: {} });

  const data = await redis.get(userKey(session.user.id));
  return Response.json(data ?? { learnSession: null, matchingTimes: {} });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const redis = getRedis();
  if (!redis) return Response.json({ ok: true });

  const body = await request.json();
  await redis.set(userKey(session.user.id), body);
  return Response.json({ ok: true });
}

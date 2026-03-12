import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) return Response.json({ learnSession: null, matchingTimes: {} });

  const { data } = await supabase
    .from('user_progress')
    .select('data')
    .eq('user_id', session.user.id)
    .maybeSingle();

  return Response.json(data?.data ?? { learnSession: null, matchingTimes: {} });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) return Response.json({ ok: true });

  const body = await request.json();

  await supabase
    .from('user_progress')
    .upsert(
      { user_id: session.user.id, data: body, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  return Response.json({ ok: true });
}

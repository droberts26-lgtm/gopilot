import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isPro } from '@/lib/pro';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ pro: false });

  // Fast path: hardcoded email bypass (owner accounts)
  if (isPro(session)) return Response.json({ pro: true });

  const supabase = getSupabase();
  if (!supabase) return Response.json({ pro: false });

  // Check by user ID or email — whichever was stored at payment time
  const { data } = await supabase
    .from('pro_users')
    .select('id')
    .or(`user_id.eq.${session.user.id},email.eq.${session.user.email?.toLowerCase()}`)
    .maybeSingle();

  return Response.json({ pro: !!data });
}

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isPro } from '@/lib/pro';
import { getSupabase } from '@/lib/supabase';

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

  const supabase = getSupabase();
  if (!supabase) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }

  const normalised = email.toLowerCase().trim();

  const { error } = await supabase
    .from('pro_users')
    .upsert(
      { email: normalised, source: 'admin', granted_at: new Date().toISOString() },
      { onConflict: 'email' }
    );

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, granted: normalised });
}

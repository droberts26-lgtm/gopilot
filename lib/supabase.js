import { createClient } from '@supabase/supabase-js';

/**
 * Returns a Supabase client using the service role key (server-side only).
 * Returns null if env vars are missing so callers can degrade gracefully.
 */
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

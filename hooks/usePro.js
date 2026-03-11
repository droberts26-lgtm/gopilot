'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Returns the current user's Pro status by fetching /api/pro.
 * @returns {{ pro: boolean, loading: boolean }}
 */
export function usePro() {
  const { data: session, status } = useSession();
  const [pro, setPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { setPro(false); setLoading(false); return; }
    fetch('/api/pro')
      .then(r => r.json())
      .then(d => { setPro(d.pro === true); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session, status]);

  return { pro, loading };
}

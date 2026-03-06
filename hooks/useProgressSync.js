'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const LEARN_KEY        = 'gopilot_learn_session';
const TIMES_KEY        = 'gopilot_matching_times';
const SAVE_INTERVAL_MS = 30_000;

/**
 * Syncs localStorage progress to Upstash Redis (via /api/progress) when the
 * user is signed in.
 *
 * - On sign-in: loads saved progress from the server and restores it to
 *   localStorage only if localStorage is currently empty (avoids overwriting
 *   in-progress work on the current device).
 * - While signed in: uploads localStorage contents every 30 s and on page close.
 */
export function useProgressSync() {
  const { data: session } = useSession();
  const userId   = session?.user?.id;
  const timerRef = useRef(null);

  // Restore saved progress to localStorage on sign-in
  useEffect(() => {
    if (!userId) return;

    fetch('/api/progress')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data) return;
        if (data.learnSession && !localStorage.getItem(LEARN_KEY)) {
          localStorage.setItem(LEARN_KEY, JSON.stringify(data.learnSession));
        }
        if (
          data.matchingTimes &&
          Object.keys(data.matchingTimes).length > 0 &&
          !localStorage.getItem(TIMES_KEY)
        ) {
          localStorage.setItem(TIMES_KEY, JSON.stringify(data.matchingTimes));
        }
      })
      .catch(() => {}); // KV not configured — silently skip
  }, [userId]);

  // Upload progress to server every 30 s and on page close
  useEffect(() => {
    if (!userId) return;

    function save() {
      try {
        const learnSession  = JSON.parse(localStorage.getItem(LEARN_KEY) ?? 'null');
        const matchingTimes = JSON.parse(localStorage.getItem(TIMES_KEY) ?? '{}');
        fetch('/api/progress', {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ learnSession, matchingTimes }),
        }).catch(() => {});
      } catch {}
    }

    timerRef.current = setInterval(save, SAVE_INTERVAL_MS);
    window.addEventListener('beforeunload', save);
    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener('beforeunload', save);
    };
  }, [userId]);
}

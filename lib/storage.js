/**
 * @fileoverview localStorage helpers for persisting GoPilot session state.
 *
 * Falls back gracefully when localStorage is unavailable (SSR, private
 * browsing, storage quota exceeded).
 */

const LEARN_SESSION_KEY = 'gopilot_learn_session';

/**
 * Persists a learn session to localStorage.
 *
 * @param {{ queue: number[], masteryMap: Object }} session
 * @param {{ totalAnswered: number, totalCorrect: number, startTime: number, flaggedIds: number[] }} meta
 */
export function saveLearnSession(session, meta) {
  try {
    localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify({ session, meta }));
  } catch {
    // localStorage unavailable — silently skip
  }
}

/**
 * Loads a saved learn session from localStorage.
 * Returns null if nothing is saved, the data is malformed, or the saved
 * question count no longer matches the current bank size.
 *
 * @param {number} expectedTotal  Current total question count (validates saved session)
 * @returns {{ session: Object, meta: Object } | null}
 */
export function loadLearnSession(expectedTotal) {
  try {
    const raw = localStorage.getItem(LEARN_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.session || !data.meta) return null;
    const savedTotal = Object.keys(data.session.masteryMap ?? {}).length;
    if (savedTotal !== expectedTotal) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Removes the saved learn session from localStorage.
 */
export function clearLearnSession() {
  try {
    localStorage.removeItem(LEARN_SESSION_KEY);
  } catch {
    // silently skip
  }
}

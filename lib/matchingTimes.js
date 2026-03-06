/**
 * Persist and retrieve best (fastest) times for matching sets.
 * Stored in localStorage as a plain object: { [setId]: milliseconds }
 *
 * @module matchingTimes
 */

const MATCHING_TIMES_KEY = 'gopilot_matching_times';

/**
 * Load all saved best times from localStorage.
 * @returns {{ [setId: string]: number }} Map of setId → best time in ms, or {} on error.
 */
export function loadBestTimes() {
  try {
    const raw = localStorage.getItem(MATCHING_TIMES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

/**
 * Save a completion time for a set if it is the new best (fastest).
 *
 * @param {string} setId
 * @param {number} ms - elapsed time in milliseconds
 * @returns {{ isNewBest: boolean, bestTime: number|null, previousBest: number|null }}
 */
export function saveBestTime(setId, ms) {
  try {
    const times = loadBestTimes();
    const previousBest = times[setId] ?? null;
    const isNewBest = previousBest === null || ms < previousBest;
    if (isNewBest) {
      times[setId] = ms;
      localStorage.setItem(MATCHING_TIMES_KEY, JSON.stringify(times));
    }
    return { isNewBest, bestTime: isNewBest ? ms : previousBest, previousBest };
  } catch {
    return { isNewBest: false, bestTime: null, previousBest: null };
  }
}

/**
 * Get the best time for a single set.
 * @param {string} setId
 * @returns {number|null} Best time in ms, or null if never completed.
 */
export function getBestTime(setId) {
  const times = loadBestTimes();
  return times[setId] ?? null;
}

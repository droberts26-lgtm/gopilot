/**
 * @fileoverview Cumulative ACS area performance tracking.
 *
 * Stores a running tally of correct/total answers per ACS area across all
 * quiz sessions. Used by the adaptive quiz (weak areas drill) and the
 * progress dashboard.
 *
 * Data is stored in localStorage under ACS_PERF_KEY as:
 * {
 *   'PA.I':  { correct: 10, total: 15 },
 *   'PA.II': { correct: 3,  total: 5  },
 *   ...
 * }
 *
 * All functions are silent — they never throw.
 */

const ACS_PERF_KEY = 'gopilot_acs_performance';

/**
 * Loads the cumulative ACS performance map from localStorage.
 *
 * @returns {Object.<string, {correct: number, total: number}>}
 */
export function loadAcsPerformance() {
  try {
    return JSON.parse(localStorage.getItem(ACS_PERF_KEY) ?? '{}');
  } catch (_) { return {}; }
}

/**
 * Persists the performance map to localStorage.
 *
 * @param {Object.<string, {correct: number, total: number}>} perf
 */
function saveAcsPerformance(perf) {
  try {
    localStorage.setItem(ACS_PERF_KEY, JSON.stringify(perf));
  } catch (_) {}
}

/**
 * Records the results of a completed quiz session into the cumulative map.
 *
 * @param {Array<{acsCode: string, correct: boolean}>} results  Per-question outcomes.
 * @param {function(string): string} getArea  Function to extract two-segment area from full ACS code.
 */
export function updateAcsPerformance(results, getArea) {
  const perf = loadAcsPerformance();
  for (const r of results) {
    const area = getArea(r.acsCode);
    if (!perf[area]) perf[area] = { correct: 0, total: 0 };
    perf[area].total++;
    if (r.correct) perf[area].correct++;
  }
  saveAcsPerformance(perf);
}

/**
 * Returns per-area mastery percentages sorted weakest first.
 *
 * @param {Object.<string, {correct: number, total: number}>} perf
 * @param {Object.<string, string>} areaNames  Map of area prefix → human name.
 * @returns {Array<{area: string, name: string, correct: number, total: number, pct: number}>}
 */
export function getAcsMasteryList(perf, areaNames) {
  return Object.entries(perf)
    .map(([area, { correct, total }]) => ({
      area,
      name: areaNames[area] ?? area,
      correct,
      total,
      pct: Math.round((correct / total) * 100),
    }))
    .sort((a, b) => a.pct - b.pct);
}

/**
 * Returns the ACS area prefixes where mastery is below the given threshold.
 *
 * @param {Object.<string, {correct: number, total: number}>} perf
 * @param {number} [threshold=70]  Percentage below which an area is considered weak.
 * @returns {string[]}  Array of weak area prefix strings (e.g. ['PA.I', 'PA.VI']).
 */
export function getWeakAreas(perf, threshold = 70) {
  return Object.entries(perf)
    .filter(([, { correct, total }]) => total > 0 && Math.round((correct / total) * 100) < threshold)
    .map(([area]) => area);
}

/**
 * Clears all stored ACS performance data.
 * Use sparingly — this resets adaptive quiz targeting.
 */
export function clearAcsPerformance() {
  try { localStorage.removeItem(ACS_PERF_KEY); } catch (_) {}
}

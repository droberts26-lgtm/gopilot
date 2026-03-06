/**
 * @fileoverview ACS (Airman Certification Standards) area-of-operation
 * names and grouping utilities for the FAA Private Pilot knowledge test.
 *
 * ACS codes follow the pattern:  PA.<RomanNumeral>.<Task>.<KnowledgeElement>
 * e.g. "PA.I.B.K1b"  →  Area I = Preflight Preparation
 */

/** Map from two-segment ACS prefix → human-readable area name. */
export const ACS_AREA_NAMES = {
  'PA.I':    'Preflight Preparation',
  'PA.II':   'Preflight Procedures',
  'PA.III':  'Airport Operations',
  'PA.IV':   'Takeoffs, Landings & Go-Arounds',
  'PA.V':    'Performance Maneuvers',
  'PA.VI':   'Navigation',
  'PA.VII':  'Slow Flight & Stalls',
  'PA.VIII': 'Basic Instruments',
  'PA.IX':   'Emergency Operations',
  'PA.XI':   'Night Operations',
  'PA.XII':  'Postflight Procedures',
};

/**
 * Extracts the two-segment ACS area prefix from a full ACS code.
 *
 * @param {string} acsCode  e.g. "PA.I.B.K1b"
 * @returns {string}        e.g. "PA.I"
 */
export function getAcsArea(acsCode) {
  const parts = acsCode.split('.');
  return parts.slice(0, 2).join('.');
}

/**
 * Groups an array of question results by ACS area of operation and returns
 * per-area statistics sorted from weakest to strongest (ascending pct).
 *
 * @param {Array<{ acsCode: string, correct: boolean }>} results
 * @returns {Array<{ area: string, name: string, correct: number, total: number, pct: number }>}
 */
export function groupByAcsArea(results) {
  const map = {};
  for (const r of results) {
    const area = getAcsArea(r.acsCode);
    if (!map[area]) map[area] = { correct: 0, total: 0 };
    map[area].total++;
    if (r.correct) map[area].correct++;
  }

  return Object.entries(map)
    .map(([area, { correct, total }]) => ({
      area,
      name: ACS_AREA_NAMES[area] ?? area,
      correct,
      total,
      pct: Math.round((correct / total) * 100),
    }))
    .sort((a, b) => a.pct - b.pct); // worst first
}

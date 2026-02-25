/**
 * @fileoverview Pure quiz-engine utilities.
 *
 * Keeping all quiz logic here (outside React components) means it can be
 * unit-tested without a DOM, and it's trivial to swap the UI layer later
 * (e.g. a React Native app) while reusing the same business logic.
 */

/**
 * Returns a new array with elements in a random order.
 * Does NOT mutate the original array.
 *
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Samples `count` random items from `array` without replacement.
 * If count >= array.length, returns all items shuffled.
 *
 * @template T
 * @param {T[]} array
 * @param {number} count
 * @returns {T[]}
 */
export function sampleWithoutReplacement(array, count) {
  return shuffle(array).slice(0, count);
}

/**
 * Builds a quiz session from a question bank.
 * Questions are randomly sampled; options retain their original A/B/C/D order.
 *
 * @template T extends { options: unknown[] }
 * @param {T[]} questionBank
 * @param {number} sessionSize  Number of questions per session
 * @returns {T[]}
 */
export function buildSession(questionBank, sessionSize) {
  return sampleWithoutReplacement(questionBank, sessionSize).map(q => ({
    ...q,
    options: [...q.options],
  }));
}

/**
 * Calculates the score percentage from correct answers.
 *
 * @param {number} correct  Number of correct answers
 * @param {number} total    Total questions attempted
 * @returns {number}  Integer 0–100
 */
export function calculatePct(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Determines whether a score meets the FAA minimum passing threshold.
 *
 * @param {number} pct  Score percentage (0–100)
 * @returns {boolean}
 */
export function isPassing(pct) {
  return pct >= 70;
}

/**
 * Returns the performance badge for a given score percentage.
 *
 * @param {number} pct
 * @returns {{ icon: string, label: string, color: string }}
 */
export function getPerformanceBadge(pct) {
  if (pct >= 90) return { icon: '🏅', label: 'DISTINGUISHED AVIATOR', color: '#fbbf24' };
  if (pct >= 75) return { icon: '✈',  label: 'SOLO CERTIFIED',        color: '#34d399' };
  if (pct >= 60) return { icon: '📖', label: 'STUDENT PILOT',         color: '#60a5fa' };
  return              { icon: '🔁', label: 'KEEP STUDYING',           color: '#f87171' };
}

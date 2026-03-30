/**
 * @fileoverview Spaced repetition queue for wrong-answer review.
 *
 * When a user answers a question incorrectly, the question is scheduled for
 * review using increasing intervals: 1 day → 3 days → 7 days → 14 days.
 * Answering correctly during a review session advances the interval; the card
 * is removed once it passes the final (14-day) interval.
 *
 * Storage key: 'gopilot_sr_queue'
 * Data shape:
 * {
 *   'par_42':  { questionId: 42, bank: 'par',    interval: 1,  nextReview: <timestamp> },
 *   'part107_7': { questionId: 7, bank: 'part107', interval: 3, nextReview: <timestamp> },
 *   ...
 * }
 *
 * All functions are silent — they never throw.
 */

const SR_KEY = 'gopilot_sr_queue';

/** Interval schedule in days */
const INTERVALS = [1, 3, 7, 14];

const DAY_MS = 86_400_000;

/** @returns {Object.<string, {questionId:number, bank:string, interval:number, nextReview:number}>} */
function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(SR_KEY) ?? '{}');
  } catch (_) { return {}; }
}

/** @param {Object} queue */
function saveQueue(queue) {
  try {
    localStorage.setItem(SR_KEY, JSON.stringify(queue));
  } catch (_) {}
}

/** @param {number} questionId @param {string} bank @returns {string} */
function makeKey(questionId, bank) {
  return `${bank}_${questionId}`;
}

/**
 * Schedules a question for spaced-repetition review after a wrong answer.
 * If the card already exists, resets it to the first interval (the mistake
 * "resets" the learning progress for this card).
 *
 * @param {number} questionId
 * @param {string} bank  e.g. 'par' or 'part107'
 */
export function addWrongAnswer(questionId, bank) {
  const queue = loadQueue();
  const key   = makeKey(questionId, bank);
  queue[key]  = {
    questionId,
    bank,
    interval:   INTERVALS[0],
    nextReview: Date.now() + INTERVALS[0] * DAY_MS,
  };
  saveQueue(queue);
}

/**
 * Returns all cards that are due for review right now (nextReview <= Date.now()).
 *
 * @returns {Array<{questionId:number, bank:string, interval:number, nextReview:number}>}
 */
export function getDueCards() {
  const queue = loadQueue();
  const now   = Date.now();
  return Object.values(queue).filter(card => card.nextReview <= now);
}

/**
 * Total number of cards currently in the queue (due + upcoming).
 * @returns {number}
 */
export function getTotalCardCount() {
  return Object.keys(loadQueue()).length;
}

/**
 * Advances a card to the next interval after a correct review answer.
 * If the card is already at the final interval, it is removed from the queue
 * (considered mastered).
 *
 * @param {number} questionId
 * @param {string} bank
 */
export function advanceInterval(questionId, bank) {
  const queue = loadQueue();
  const key   = makeKey(questionId, bank);
  const card  = queue[key];
  if (!card) return;

  const currentIdx = INTERVALS.indexOf(card.interval);
  const nextIdx    = currentIdx + 1;

  if (nextIdx >= INTERVALS.length) {
    // Mastered — graduate out of the queue
    delete queue[key];
  } else {
    queue[key] = {
      ...card,
      interval:   INTERVALS[nextIdx],
      nextReview: Date.now() + INTERVALS[nextIdx] * DAY_MS,
    };
  }
  saveQueue(queue);
}

/**
 * Removes a specific card from the queue unconditionally (e.g. on manual dismiss).
 *
 * @param {number} questionId
 * @param {string} bank
 */
export function removeFromQueue(questionId, bank) {
  const queue = loadQueue();
  delete queue[makeKey(questionId, bank)];
  saveQueue(queue);
}

/**
 * Returns all cards in the queue, both due and upcoming.
 *
 * @returns {Array<{questionId:number, bank:string, interval:number, nextReview:number}>}
 */
export function getAllCards() {
  return Object.values(loadQueue());
}

/**
 * Clears the entire spaced repetition queue.
 */
export function clearSrQueue() {
  try { localStorage.removeItem(SR_KEY); } catch (_) {}
}

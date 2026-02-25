/**
 * @fileoverview Pure mastery-based learning algorithm (Quizlet Learn style).
 *
 * No React, no Next.js — fully unit-testable without a DOM.
 *
 * A "session" is an immutable value object:
 *   {
 *     queue: number[],            // ordered list of question IDs yet to be mastered
 *     masteryMap: {               // keyed by question ID (as number)
 *       [id]: {
 *         correctStreak: number,  // consecutive correct answers
 *         attempts: number,       // total answers given
 *         mastered: boolean,      // true once correctStreak reaches MASTERY_THRESHOLD
 *       }
 *     }
 *   }
 *
 * Every mutating function returns a NEW session object — the original is unchanged.
 */

import { shuffle } from '@/lib/quiz';

/** Number of consecutive correct answers required to master a question. */
export const MASTERY_THRESHOLD = 3;

/**
 * Creates a fresh learn session for a set of questions.
 *
 * @param {{ id: number }[]} questions  Array of question objects (only `.id` is used here)
 * @returns {{ queue: number[], masteryMap: Object }}
 */
export function initLearnSession(questions) {
  const ids = questions.map(q => q.id);
  const queue = shuffle(ids);

  const masteryMap = {};
  for (const id of ids) {
    masteryMap[id] = { correctStreak: 0, attempts: 0, mastered: false };
  }

  return { queue, masteryMap };
}

/**
 * Processes an answer for the current (front-of-queue) question and returns
 * a new session reflecting the updated state.
 *
 * Reinsertion rules:
 *  - Correct, not yet mastered → reinsert at ~70% through the remaining queue
 *  - Correct, now mastered     → remove permanently
 *  - Wrong                     → reset streak, reinsert at ~20% through the remaining queue
 *
 * @param {{ queue: number[], masteryMap: Object }} session
 * @param {number} questionId
 * @param {boolean} isCorrect
 * @returns {{ queue: number[], masteryMap: Object }}
 */
export function processAnswer(session, questionId, isCorrect) {
  const remainingQueue = session.queue.slice(1); // queue without the current question

  const prevEntry = session.masteryMap[questionId];
  const newStreak = isCorrect ? prevEntry.correctStreak + 1 : 0;
  const nowMastered = newStreak >= MASTERY_THRESHOLD;

  const newEntry = {
    correctStreak: nowMastered ? prevEntry.correctStreak + 1 : newStreak,
    attempts: prevEntry.attempts + 1,
    mastered: nowMastered,
  };

  let newQueue;
  if (nowMastered) {
    // Do not reinsert — question is done
    newQueue = remainingQueue;
  } else if (isCorrect) {
    // Reinsert toward the back (~70%)
    const insertAt = Math.round(remainingQueue.length * 0.7);
    newQueue = [
      ...remainingQueue.slice(0, insertAt),
      questionId,
      ...remainingQueue.slice(insertAt),
    ];
  } else {
    // Wrong — reinsert near the front (~20%)
    const insertAt = Math.round(remainingQueue.length * 0.2);
    newQueue = [
      ...remainingQueue.slice(0, insertAt),
      questionId,
      ...remainingQueue.slice(insertAt),
    ];
  }

  return {
    queue: newQueue,
    masteryMap: {
      ...session.masteryMap,
      [questionId]: newEntry,
    },
  };
}

/**
 * Returns the ID of the current (front-of-queue) question, or null if done.
 *
 * @param {{ queue: number[] }} session
 * @returns {number | null}
 */
export function getCurrentQuestionId(session) {
  return session.queue[0] ?? null;
}

/**
 * Returns true when every question has been mastered (queue is empty).
 *
 * @param {{ queue: number[] }} session
 * @returns {boolean}
 */
export function isLearnSessionComplete(session) {
  return session.queue.length === 0;
}

/**
 * Returns summary statistics for the current session.
 *
 * @param {{ queue: number[], masteryMap: Object }} session
 * @returns {{ total: number, mastered: number, learning: number, notSeen: number }}
 */
export function getLearnStats(session) {
  const entries = Object.values(session.masteryMap);
  const total = entries.length;
  const mastered = entries.filter(e => e.mastered).length;
  const notSeen = entries.filter(e => e.attempts === 0).length;
  const learning = total - mastered - notSeen;

  return { total, mastered, learning, notSeen };
}

import { describe, it, expect } from 'vitest';
import {
  MASTERY_THRESHOLD,
  initLearnSession,
  processAnswer,
  getCurrentQuestionId,
  isLearnSessionComplete,
  getLearnStats,
} from '@/lib/learn';

// ─── helpers ──────────────────────────────────────────────────────────────────

const makeQuestions = (ids) => ids.map(id => ({ id }));

/**
 * Drive a single-question session to mastery by answering correctly
 * MASTERY_THRESHOLD times.  Because there is only one question, it always
 * returns to the front of the queue after each correct-but-not-yet-mastered
 * answer.
 */
const masterSingleQuestion = (session, id) => {
  let s = session;
  for (let i = 0; i < MASTERY_THRESHOLD; i++) {
    s = processAnswer(s, id, true);
  }
  return s;
};

// ─── MASTERY_THRESHOLD ────────────────────────────────────────────────────────

describe('MASTERY_THRESHOLD', () => {
  it('is the number 3', () => {
    expect(MASTERY_THRESHOLD).toBe(3);
  });
});

// ─── initLearnSession ─────────────────────────────────────────────────────────

describe('initLearnSession', () => {
  it('queue contains all question IDs', () => {
    const qs = makeQuestions([1, 2, 3, 4, 5]);
    const session = initLearnSession(qs);
    expect(session.queue.sort()).toEqual([1, 2, 3, 4, 5].sort());
  });

  it('queue length equals number of questions', () => {
    const session = initLearnSession(makeQuestions([10, 20, 30]));
    expect(session.queue).toHaveLength(3);
  });

  it('masteryMap has an entry for every question ID', () => {
    const qs = makeQuestions([1, 2, 3]);
    const session = initLearnSession(qs);
    expect(Object.keys(session.masteryMap).map(Number).sort()).toEqual([1, 2, 3].sort());
  });

  it('all mastery entries start with correctStreak 0', () => {
    const session = initLearnSession(makeQuestions([1, 2, 3]));
    Object.values(session.masteryMap).forEach(e => {
      expect(e.correctStreak).toBe(0);
    });
  });

  it('all mastery entries start with attempts 0', () => {
    const session = initLearnSession(makeQuestions([1, 2]));
    Object.values(session.masteryMap).forEach(e => {
      expect(e.attempts).toBe(0);
    });
  });

  it('all mastery entries start as not mastered', () => {
    const session = initLearnSession(makeQuestions([1, 2, 3]));
    Object.values(session.masteryMap).forEach(e => {
      expect(e.mastered).toBe(false);
    });
  });

  it('handles an empty question array', () => {
    const session = initLearnSession([]);
    expect(session.queue).toEqual([]);
    expect(session.masteryMap).toEqual({});
  });

  it('produces varied queue orders across many runs (statistical)', () => {
    const qs = makeQuestions([1, 2, 3, 4, 5]);
    const orders = new Set(
      Array.from({ length: 20 }, () => JSON.stringify(initLearnSession(qs).queue))
    );
    expect(orders.size).toBeGreaterThan(1);
  });
});

// ─── processAnswer ────────────────────────────────────────────────────────────

describe('processAnswer', () => {
  describe('immutability', () => {
    it('does not mutate the original session queue', () => {
      const session = initLearnSession(makeQuestions([1, 2, 3]));
      const originalQueue = [...session.queue];
      processAnswer(session, session.queue[0], true);
      expect(session.queue).toEqual(originalQueue);
    });

    it('does not mutate the original masteryMap', () => {
      const session = initLearnSession(makeQuestions([1]));
      const id = session.queue[0];
      const originalEntry = { ...session.masteryMap[id] };
      processAnswer(session, id, true);
      expect(session.masteryMap[id]).toEqual(originalEntry);
    });
  });

  describe('correct answer (not yet mastered)', () => {
    it('increments correctStreak by 1', () => {
      const session = initLearnSession(makeQuestions([1]));
      const next = processAnswer(session, 1, true);
      expect(next.masteryMap[1].correctStreak).toBe(1);
    });

    it('increments attempts by 1', () => {
      const session = initLearnSession(makeQuestions([1]));
      const next = processAnswer(session, 1, true);
      expect(next.masteryMap[1].attempts).toBe(1);
    });

    it('keeps mastered as false when streak is below threshold', () => {
      const session = initLearnSession(makeQuestions([1, 2]));
      const next = processAnswer(session, session.queue[0], true);
      expect(next.masteryMap[session.queue[0]].mastered).toBe(false);
    });

    it('reinserts the question into the queue', () => {
      const session = initLearnSession(makeQuestions([1, 2, 3]));
      const id = session.queue[0];
      const next = processAnswer(session, id, true);
      expect(next.queue).toContain(id);
    });
  });

  describe('wrong answer', () => {
    it('resets correctStreak to 0', () => {
      // First answer correctly, then wrong
      let session = initLearnSession(makeQuestions([1]));
      session = processAnswer(session, 1, true); // streak → 1
      session = processAnswer(session, 1, false); // streak → 0
      expect(session.masteryMap[1].correctStreak).toBe(0);
    });

    it('increments attempts', () => {
      const session = initLearnSession(makeQuestions([1]));
      const next = processAnswer(session, 1, false);
      expect(next.masteryMap[1].attempts).toBe(1);
    });

    it('reinserts the question near the front (within first 30% of remaining)', () => {
      // Use a larger bank so position is meaningful
      const qs = makeQuestions([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const session = initLearnSession(qs);
      const id = session.queue[0];
      const next = processAnswer(session, id, false);
      const pos = next.queue.indexOf(id);
      // After removing one from a 10-item queue, remaining = 9.
      // Insert at round(9 * 0.2) = 2 → position should be ≤ 3
      expect(pos).toBeLessThanOrEqual(3);
    });
  });

  describe('mastery threshold', () => {
    it('marks question as mastered after MASTERY_THRESHOLD correct answers', () => {
      let session = initLearnSession(makeQuestions([1]));
      session = masterSingleQuestion(session, 1);
      expect(session.masteryMap[1].mastered).toBe(true);
    });

    it('removes mastered question from the queue', () => {
      let session = initLearnSession(makeQuestions([1]));
      session = masterSingleQuestion(session, 1);
      expect(session.queue).not.toContain(1);
    });

    it('does not mark as mastered before MASTERY_THRESHOLD correct answers', () => {
      let session = initLearnSession(makeQuestions([1]));
      for (let i = 0; i < MASTERY_THRESHOLD - 1; i++) {
        session = processAnswer(session, 1, true);
      }
      expect(session.masteryMap[1].mastered).toBe(false);
    });
  });

  describe('reinsertion position (correct, not mastered)', () => {
    it('reinserts question toward the back of a multi-item queue', () => {
      const qs = makeQuestions([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const session = initLearnSession(qs);
      const id = session.queue[0];
      const next = processAnswer(session, id, true);
      const pos = next.queue.indexOf(id);
      // remaining = 9 items; insert at round(9 * 0.7) = 6
      // position should be >= 4 (i.e. not at the very front)
      expect(pos).toBeGreaterThanOrEqual(4);
    });
  });
});

// ─── getCurrentQuestionId ─────────────────────────────────────────────────────

describe('getCurrentQuestionId', () => {
  it('returns the first item in the queue', () => {
    const session = initLearnSession(makeQuestions([42, 7, 3]));
    expect(getCurrentQuestionId(session)).toBe(session.queue[0]);
  });

  it('returns null when the queue is empty', () => {
    const emptySession = { queue: [], masteryMap: {} };
    expect(getCurrentQuestionId(emptySession)).toBeNull();
  });

  it('returns a number (not a string)', () => {
    const session = initLearnSession(makeQuestions([5]));
    expect(typeof getCurrentQuestionId(session)).toBe('number');
  });
});

// ─── isLearnSessionComplete ───────────────────────────────────────────────────

describe('isLearnSessionComplete', () => {
  it('returns false when queue is non-empty', () => {
    const session = initLearnSession(makeQuestions([1, 2]));
    expect(isLearnSessionComplete(session)).toBe(false);
  });

  it('returns true when queue is empty', () => {
    const emptySession = { queue: [], masteryMap: {} };
    expect(isLearnSessionComplete(emptySession)).toBe(true);
  });

  it('returns true after all questions in a single-question session are mastered', () => {
    let session = initLearnSession(makeQuestions([1]));
    session = masterSingleQuestion(session, 1);
    expect(isLearnSessionComplete(session)).toBe(true);
  });

  it('returns false after mastering only some questions in a multi-question session', () => {
    let session = initLearnSession(makeQuestions([1, 2]));
    // Master only question 1 (it floats to front of a 1-item remaining queue each time)
    session = masterSingleQuestion(session, session.queue[0]);
    expect(isLearnSessionComplete(session)).toBe(false);
  });
});

// ─── getLearnStats ────────────────────────────────────────────────────────────

describe('getLearnStats', () => {
  it('total equals the number of questions', () => {
    const session = initLearnSession(makeQuestions([1, 2, 3, 4, 5]));
    expect(getLearnStats(session).total).toBe(5);
  });

  it('all questions are notSeen at start', () => {
    const session = initLearnSession(makeQuestions([1, 2, 3]));
    const stats = getLearnStats(session);
    expect(stats.notSeen).toBe(3);
    expect(stats.mastered).toBe(0);
    expect(stats.learning).toBe(0);
  });

  it('mastered count increases after mastering a question', () => {
    let session = initLearnSession(makeQuestions([1]));
    session = masterSingleQuestion(session, 1);
    expect(getLearnStats(session).mastered).toBe(1);
  });

  it('learning count reflects answered-but-not-mastered questions', () => {
    let session = initLearnSession(makeQuestions([1, 2]));
    const firstId = session.queue[0];
    session = processAnswer(session, firstId, true); // answered once, not mastered
    const stats = getLearnStats(session);
    expect(stats.learning).toBe(1);
    expect(stats.notSeen).toBe(1);
    expect(stats.mastered).toBe(0);
  });

  it('total = mastered + learning + notSeen', () => {
    let session = initLearnSession(makeQuestions([1, 2, 3]));
    session = processAnswer(session, session.queue[0], true);
    const { total, mastered, learning, notSeen } = getLearnStats(session);
    expect(mastered + learning + notSeen).toBe(total);
  });

  it('returns zeros for an empty session', () => {
    const session = { queue: [], masteryMap: {} };
    const stats = getLearnStats(session);
    expect(stats).toEqual({ total: 0, mastered: 0, learning: 0, notSeen: 0 });
  });
});

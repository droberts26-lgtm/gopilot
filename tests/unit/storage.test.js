import { describe, it, expect, beforeEach } from 'vitest';
import { saveLearnSession, loadLearnSession, clearLearnSession } from '@/lib/storage';

// jsdom provides localStorage — clear it before each test to prevent cross-test pollution
beforeEach(() => {
  localStorage.clear();
});

const makeSession = (numQuestions = 3) => {
  const ids = Array.from({ length: numQuestions }, (_, i) => i + 1);
  const masteryMap = {};
  for (const id of ids) masteryMap[id] = { correctStreak: 0, attempts: 0, mastered: false };
  return { queue: ids, masteryMap };
};

const makeMeta = () => ({
  totalAnswered: 5,
  totalCorrect: 3,
  startTime: 1700000000000,
  flaggedIds: [1, 2],
});

// ─── saveLearnSession ────────────────────────────────────────────────────────

describe('saveLearnSession', () => {
  it('stores data in localStorage', () => {
    saveLearnSession(makeSession(), makeMeta());
    expect(localStorage.getItem('gopilot_learn_session')).not.toBeNull();
  });

  it('stored data is valid JSON', () => {
    saveLearnSession(makeSession(), makeMeta());
    expect(() => JSON.parse(localStorage.getItem('gopilot_learn_session'))).not.toThrow();
  });

  it('does not throw when localStorage throws (quota exceeded)', () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('QuotaExceeded'); };
    expect(() => saveLearnSession(makeSession(), makeMeta())).not.toThrow();
    Storage.prototype.setItem = original;
  });
});

// ─── loadLearnSession ────────────────────────────────────────────────────────

describe('loadLearnSession', () => {
  it('returns null when localStorage is empty', () => {
    expect(loadLearnSession(3)).toBeNull();
  });

  it('returns null when saved question count does not match expectedTotal', () => {
    saveLearnSession(makeSession(3), makeMeta());
    expect(loadLearnSession(5)).toBeNull();
  });

  it('returns null when stored JSON is malformed', () => {
    localStorage.setItem('gopilot_learn_session', 'not-json{{{');
    expect(loadLearnSession(3)).toBeNull();
  });

  it('returns null when stored object is missing session key', () => {
    localStorage.setItem('gopilot_learn_session', JSON.stringify({ meta: makeMeta() }));
    expect(loadLearnSession(3)).toBeNull();
  });

  it('returns null when stored object is missing meta key', () => {
    localStorage.setItem('gopilot_learn_session', JSON.stringify({ session: makeSession(3) }));
    expect(loadLearnSession(3)).toBeNull();
  });

  it('returns saved data when everything is valid', () => {
    const session = makeSession(3);
    const meta = makeMeta();
    saveLearnSession(session, meta);
    const result = loadLearnSession(3);
    expect(result).not.toBeNull();
    expect(result.session).toBeDefined();
    expect(result.meta).toBeDefined();
  });

  it('round-trips session queue correctly', () => {
    const session = makeSession(4);
    saveLearnSession(session, makeMeta());
    const { session: loaded } = loadLearnSession(4);
    expect(loaded.queue).toEqual(session.queue);
  });

  it('round-trips meta.totalAnswered correctly', () => {
    const meta = { totalAnswered: 42, totalCorrect: 30, startTime: 12345, flaggedIds: [] };
    saveLearnSession(makeSession(2), meta);
    const { meta: loaded } = loadLearnSession(2);
    expect(loaded.totalAnswered).toBe(42);
  });

  it('round-trips meta.flaggedIds correctly', () => {
    const meta = { totalAnswered: 1, totalCorrect: 1, startTime: 0, flaggedIds: [3, 7] };
    saveLearnSession(makeSession(3), meta);
    const { meta: loaded } = loadLearnSession(3);
    expect(loaded.flaggedIds).toEqual([3, 7]);
  });

  it('does not throw when localStorage.getItem throws', () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => { throw new Error('SecurityError'); };
    expect(loadLearnSession(3)).toBeNull();
    Storage.prototype.getItem = original;
  });
});

// ─── clearLearnSession ───────────────────────────────────────────────────────

describe('clearLearnSession', () => {
  it('removes the saved session from localStorage', () => {
    saveLearnSession(makeSession(), makeMeta());
    clearLearnSession();
    expect(localStorage.getItem('gopilot_learn_session')).toBeNull();
  });

  it('is a no-op when nothing is saved', () => {
    expect(() => clearLearnSession()).not.toThrow();
  });

  it('causes loadLearnSession to return null after clearing', () => {
    saveLearnSession(makeSession(2), makeMeta());
    clearLearnSession();
    expect(loadLearnSession(2)).toBeNull();
  });

  it('does not throw when localStorage.removeItem throws', () => {
    const original = Storage.prototype.removeItem;
    Storage.prototype.removeItem = () => { throw new Error('SecurityError'); };
    expect(() => clearLearnSession()).not.toThrow();
    Storage.prototype.removeItem = original;
  });
});

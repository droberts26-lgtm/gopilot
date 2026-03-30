import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  addWrongAnswer,
  getDueCards,
  advanceInterval,
  removeFromQueue,
  getAllCards,
  getTotalCardCount,
  clearSrQueue,
} from '@/lib/spacedRepetition';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

const DAY_MS = 86_400_000;

beforeEach(() => {
  localStorageMock.clear();
  vi.useRealTimers();
});

// ─── addWrongAnswer ───────────────────────────────────────────────────────────

describe('addWrongAnswer', () => {
  it('adds a card with 1-day interval', () => {
    addWrongAnswer(42, 'par');
    const cards = getAllCards();
    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({ questionId: 42, bank: 'par', interval: 1 });
  });

  it('resets interval to 1 if card already exists', () => {
    addWrongAnswer(42, 'par');
    // Simulate advancing the interval first
    advanceInterval(42, 'par');
    let cards = getAllCards();
    expect(cards[0].interval).toBe(3);

    // Getting it wrong again resets to 1
    addWrongAnswer(42, 'par');
    cards = getAllCards();
    expect(cards[0].interval).toBe(1);
  });

  it('sets nextReview approximately 1 day from now', () => {
    const before = Date.now();
    addWrongAnswer(1, 'par');
    const after = Date.now();
    const card = getAllCards()[0];
    expect(card.nextReview).toBeGreaterThanOrEqual(before + DAY_MS);
    expect(card.nextReview).toBeLessThanOrEqual(after + DAY_MS + 100);
  });

  it('supports multiple banks without collision', () => {
    addWrongAnswer(1, 'par');
    addWrongAnswer(1, 'part107');
    expect(getTotalCardCount()).toBe(2);
  });
});

// ─── getDueCards ──────────────────────────────────────────────────────────────

describe('getDueCards', () => {
  it('returns cards whose nextReview is in the past', () => {
    // Manually inject a card that is due
    const queue = { par_5: { questionId: 5, bank: 'par', interval: 1, nextReview: Date.now() - 1000 } };
    localStorage.setItem('gopilot_sr_queue', JSON.stringify(queue));

    const due = getDueCards();
    expect(due).toHaveLength(1);
    expect(due[0].questionId).toBe(5);
  });

  it('does not return cards due in the future', () => {
    addWrongAnswer(10, 'par'); // nextReview = now + 1 day
    expect(getDueCards()).toHaveLength(0);
  });

  it('returns empty array when queue is empty', () => {
    expect(getDueCards()).toHaveLength(0);
  });
});

// ─── advanceInterval ─────────────────────────────────────────────────────────

describe('advanceInterval', () => {
  it('advances from 1-day to 3-day interval', () => {
    addWrongAnswer(1, 'par');
    advanceInterval(1, 'par');
    const card = getAllCards()[0];
    expect(card.interval).toBe(3);
  });

  it('advances from 3-day to 7-day interval', () => {
    addWrongAnswer(1, 'par');
    advanceInterval(1, 'par'); // → 3
    advanceInterval(1, 'par'); // → 7
    expect(getAllCards()[0].interval).toBe(7);
  });

  it('removes card after final interval (14 days) is passed', () => {
    addWrongAnswer(1, 'par');
    advanceInterval(1, 'par'); // → 3
    advanceInterval(1, 'par'); // → 7
    advanceInterval(1, 'par'); // → 14
    advanceInterval(1, 'par'); // graduated
    expect(getTotalCardCount()).toBe(0);
  });

  it('does nothing if card does not exist', () => {
    advanceInterval(999, 'par');
    expect(getTotalCardCount()).toBe(0);
  });
});

// ─── removeFromQueue ──────────────────────────────────────────────────────────

describe('removeFromQueue', () => {
  it('removes a specific card', () => {
    addWrongAnswer(1, 'par');
    addWrongAnswer(2, 'par');
    removeFromQueue(1, 'par');
    expect(getTotalCardCount()).toBe(1);
    expect(getAllCards()[0].questionId).toBe(2);
  });

  it('does nothing when card is not present', () => {
    addWrongAnswer(1, 'par');
    removeFromQueue(99, 'par');
    expect(getTotalCardCount()).toBe(1);
  });
});

// ─── getTotalCardCount ────────────────────────────────────────────────────────

describe('getTotalCardCount', () => {
  it('returns 0 for empty queue', () => {
    expect(getTotalCardCount()).toBe(0);
  });

  it('counts all cards regardless of due status', () => {
    addWrongAnswer(1, 'par');
    addWrongAnswer(2, 'par');
    expect(getTotalCardCount()).toBe(2);
  });
});

// ─── clearSrQueue ─────────────────────────────────────────────────────────────

describe('clearSrQueue', () => {
  it('removes all cards', () => {
    addWrongAnswer(1, 'par');
    addWrongAnswer(2, 'part107');
    clearSrQueue();
    expect(getTotalCardCount()).toBe(0);
  });
});

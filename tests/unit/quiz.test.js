import { describe, it, expect } from 'vitest';
import {
  shuffle,
  sampleWithoutReplacement,
  buildSession,
  calculatePct,
  isPassing,
  getPerformanceBadge,
} from '@/lib/quiz';

// ─── shuffle ──────────────────────────────────────────────────────────────────

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    expect(shuffle([1, 2, 3, 4, 5])).toHaveLength(5);
  });

  it('contains all original elements', () => {
    const original = [1, 2, 3, 4, 5, 6];
    const result = shuffle(original);
    expect(result.sort()).toEqual([...original].sort());
  });

  it('does not mutate the original array', () => {
    const original = [1, 2, 3];
    const copy = [...original];
    shuffle(original);
    expect(original).toEqual(copy);
  });

  it('handles an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('handles a single-element array', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('produces different orderings over many runs (statistical)', () => {
    // Run shuffle 20 times on [1,2,3] — it's astronomically unlikely
    // that all 20 runs produce the same order.
    const arr = [1, 2, 3];
    const results = new Set(Array.from({ length: 20 }, () => JSON.stringify(shuffle(arr))));
    expect(results.size).toBeGreaterThan(1);
  });
});

// ─── sampleWithoutReplacement ─────────────────────────────────────────────────

describe('sampleWithoutReplacement', () => {
  it('returns exactly `count` items', () => {
    expect(sampleWithoutReplacement([1, 2, 3, 4, 5], 3)).toHaveLength(3);
  });

  it('returns all items when count >= array length', () => {
    const arr = [1, 2, 3];
    expect(sampleWithoutReplacement(arr, 10)).toHaveLength(3);
  });

  it('returns only items from the original array', () => {
    const original = new Set([1, 2, 3, 4, 5]);
    const result = sampleWithoutReplacement([...original], 3);
    result.forEach(item => expect(original.has(item)).toBe(true));
  });

  it('returns no duplicates', () => {
    const result = sampleWithoutReplacement([1, 2, 3, 4, 5], 5);
    expect(new Set(result).size).toBe(5);
  });

  it('handles empty array', () => {
    expect(sampleWithoutReplacement([], 5)).toHaveLength(0);
  });
});

// ─── buildSession ─────────────────────────────────────────────────────────────

describe('buildSession', () => {
  const makeQuestion = (id) => ({
    id,
    question: `Question ${id}`,
    options: [
      { letter: 'A', text: 'Option A', correct: false },
      { letter: 'B', text: 'Option B', correct: true },
      { letter: 'C', text: 'Option C', correct: false },
    ],
  });

  const bank = Array.from({ length: 10 }, (_, i) => makeQuestion(i + 1));

  it('returns the requested number of questions', () => {
    expect(buildSession(bank, 5)).toHaveLength(5);
  });

  it('each question preserves all fields', () => {
    const session = buildSession(bank, 3);
    session.forEach(q => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
    });
  });

  it('each question has shuffled options that still contain all original texts', () => {
    const session = buildSession(bank, 3);
    session.forEach(q => {
      const texts = q.options.map(o => o.text).sort();
      expect(texts).toEqual(['Option A', 'Option B', 'Option C'].sort());
    });
  });

  it('preserves exactly one correct option after shuffling', () => {
    const session = buildSession(bank, 10);
    session.forEach(q => {
      const correctCount = q.options.filter(o => o.correct).length;
      expect(correctCount).toBe(1);
    });
  });

  it('does not mutate the original question bank', () => {
    const originalOptionsOrder = bank.map(q => q.options.map(o => o.letter));
    buildSession(bank, 10);
    const afterOptionsOrder = bank.map(q => q.options.map(o => o.letter));
    expect(afterOptionsOrder).toEqual(originalOptionsOrder);
  });

  it('returns a session when count >= bank size', () => {
    expect(buildSession(bank, 100)).toHaveLength(10);
  });
});

// ─── calculatePct ─────────────────────────────────────────────────────────────

describe('calculatePct', () => {
  it('returns 100 for perfect score', () => {
    expect(calculatePct(10, 10)).toBe(100);
  });

  it('returns 0 for no correct answers', () => {
    expect(calculatePct(0, 10)).toBe(0);
  });

  it('returns 0 when total is 0 (avoids division by zero)', () => {
    expect(calculatePct(0, 0)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    // 7/10 = 70 exactly
    expect(calculatePct(7, 10)).toBe(70);
    // 1/3 ≈ 33.33...
    expect(calculatePct(1, 3)).toBe(33);
    // 2/3 ≈ 66.66...
    expect(calculatePct(2, 3)).toBe(67);
  });

  it('handles fractional-looking inputs', () => {
    expect(calculatePct(45, 61)).toBeGreaterThanOrEqual(73);
    expect(calculatePct(45, 61)).toBeLessThanOrEqual(74);
  });
});

// ─── isPassing ───────────────────────────────────────────────────────────────

describe('isPassing', () => {
  it('returns true at exactly 70% (FAA minimum)', () => {
    expect(isPassing(70)).toBe(true);
  });

  it('returns true above 70%', () => {
    expect(isPassing(71)).toBe(true);
    expect(isPassing(100)).toBe(true);
  });

  it('returns false below 70%', () => {
    expect(isPassing(69)).toBe(false);
    expect(isPassing(0)).toBe(false);
  });
});

// ─── getPerformanceBadge ──────────────────────────────────────────────────────

describe('getPerformanceBadge', () => {
  it('returns "DISTINGUISHED AVIATOR" for 90+', () => {
    expect(getPerformanceBadge(90).label).toBe('DISTINGUISHED AVIATOR');
    expect(getPerformanceBadge(100).label).toBe('DISTINGUISHED AVIATOR');
  });

  it('returns "SOLO CERTIFIED" for 75–89', () => {
    expect(getPerformanceBadge(75).label).toBe('SOLO CERTIFIED');
    expect(getPerformanceBadge(89).label).toBe('SOLO CERTIFIED');
  });

  it('returns "STUDENT PILOT" for 60–74', () => {
    expect(getPerformanceBadge(60).label).toBe('STUDENT PILOT');
    expect(getPerformanceBadge(74).label).toBe('STUDENT PILOT');
  });

  it('returns "KEEP STUDYING" for below 60', () => {
    expect(getPerformanceBadge(59).label).toBe('KEEP STUDYING');
    expect(getPerformanceBadge(0).label).toBe('KEEP STUDYING');
  });

  it('returns a non-empty color string for every tier', () => {
    [100, 80, 65, 40].forEach(pct => {
      expect(getPerformanceBadge(pct).color).toBeTruthy();
    });
  });

  it('returns a non-empty icon for every tier', () => {
    [100, 80, 65, 40].forEach(pct => {
      expect(getPerformanceBadge(pct).icon).toBeTruthy();
    });
  });
});

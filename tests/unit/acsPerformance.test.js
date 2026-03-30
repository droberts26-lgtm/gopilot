import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadAcsPerformance,
  updateAcsPerformance,
  getAcsMasteryList,
  getWeakAreas,
  clearAcsPerformance,
} from '@/lib/acsPerformance';

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

beforeEach(() => {
  localStorageMock.clear();
});

const AREA_NAMES = {
  'PA.I':  'Preflight Preparation',
  'PA.VI': 'Navigation',
};

// Dummy getArea function
const getArea = (code) => code.split('.').slice(0, 2).join('.');

// ─── loadAcsPerformance ───────────────────────────────────────────────────────

describe('loadAcsPerformance', () => {
  it('returns empty object when no data stored', () => {
    expect(loadAcsPerformance()).toEqual({});
  });

  it('returns parsed data when present', () => {
    localStorage.setItem('gopilot_acs_performance', JSON.stringify({ 'PA.I': { correct: 3, total: 5 } }));
    expect(loadAcsPerformance()).toEqual({ 'PA.I': { correct: 3, total: 5 } });
  });
});

// ─── updateAcsPerformance ─────────────────────────────────────────────────────

describe('updateAcsPerformance', () => {
  it('creates entries for new ACS areas', () => {
    updateAcsPerformance([
      { acsCode: 'PA.I.B.K1', correct: true },
      { acsCode: 'PA.I.C.K2', correct: false },
    ], getArea);
    const perf = loadAcsPerformance();
    expect(perf['PA.I']).toEqual({ correct: 1, total: 2 });
  });

  it('accumulates across multiple calls', () => {
    updateAcsPerformance([{ acsCode: 'PA.I.A.K1', correct: true }], getArea);
    updateAcsPerformance([{ acsCode: 'PA.I.A.K1', correct: false }], getArea);
    const perf = loadAcsPerformance();
    expect(perf['PA.I']).toEqual({ correct: 1, total: 2 });
  });

  it('handles multiple areas in one result set', () => {
    updateAcsPerformance([
      { acsCode: 'PA.I.A.K1',  correct: true  },
      { acsCode: 'PA.VI.B.K1', correct: false },
    ], getArea);
    const perf = loadAcsPerformance();
    expect(perf['PA.I']).toEqual({ correct: 1, total: 1 });
    expect(perf['PA.VI']).toEqual({ correct: 0, total: 1 });
  });

  it('handles empty results gracefully', () => {
    updateAcsPerformance([], getArea);
    expect(loadAcsPerformance()).toEqual({});
  });
});

// ─── getAcsMasteryList ────────────────────────────────────────────────────────

describe('getAcsMasteryList', () => {
  it('returns entries sorted weakest first', () => {
    const perf = {
      'PA.I':  { correct: 8, total: 10 }, // 80%
      'PA.VI': { correct: 3, total: 10 }, // 30%
    };
    const list = getAcsMasteryList(perf, AREA_NAMES);
    expect(list[0].area).toBe('PA.VI');
    expect(list[1].area).toBe('PA.I');
  });

  it('calculates correct pct for each area', () => {
    const perf = { 'PA.I': { correct: 7, total: 10 } };
    const list = getAcsMasteryList(perf, AREA_NAMES);
    expect(list[0].pct).toBe(70);
  });

  it('uses fallback name when area not in map', () => {
    const perf = { 'PA.ZZ': { correct: 1, total: 1 } };
    const list = getAcsMasteryList(perf, AREA_NAMES);
    expect(list[0].name).toBe('PA.ZZ');
  });

  it('returns empty array for empty perf', () => {
    expect(getAcsMasteryList({}, AREA_NAMES)).toEqual([]);
  });
});

// ─── getWeakAreas ─────────────────────────────────────────────────────────────

describe('getWeakAreas', () => {
  it('returns areas below threshold (default 70%)', () => {
    const perf = {
      'PA.I':  { correct: 8, total: 10 }, // 80% — strong
      'PA.VI': { correct: 6, total: 10 }, // 60% — weak
    };
    expect(getWeakAreas(perf)).toEqual(['PA.VI']);
  });

  it('returns empty array when all areas meet threshold', () => {
    const perf = { 'PA.I': { correct: 10, total: 10 } };
    expect(getWeakAreas(perf)).toEqual([]);
  });

  it('respects custom threshold', () => {
    const perf = { 'PA.I': { correct: 8, total: 10 } }; // 80%
    expect(getWeakAreas(perf, 90)).toEqual(['PA.I']);
    expect(getWeakAreas(perf, 70)).toEqual([]);
  });

  it('ignores areas with zero total', () => {
    const perf = { 'PA.I': { correct: 0, total: 0 } };
    expect(getWeakAreas(perf)).toEqual([]);
  });
});

// ─── clearAcsPerformance ──────────────────────────────────────────────────────

describe('clearAcsPerformance', () => {
  it('removes all stored data', () => {
    updateAcsPerformance([{ acsCode: 'PA.I.A.K1', correct: true }], getArea);
    clearAcsPerformance();
    expect(loadAcsPerformance()).toEqual({});
  });
});

import { describe, it, expect } from 'vitest';
import { ACS_AREA_NAMES, getAcsArea, groupByAcsArea } from '@/lib/acsAreas';

// ─── getAcsArea ──────────────────────────────────────────────────────────────

describe('getAcsArea', () => {
  it('extracts two-segment prefix from full code', () => {
    expect(getAcsArea('PA.I.B.K1b')).toBe('PA.I');
  });

  it('handles two-digit roman numerals', () => {
    expect(getAcsArea('PA.IX.A.K1')).toBe('PA.IX');
  });

  it('handles three-digit roman numerals', () => {
    expect(getAcsArea('PA.XII.A.K2')).toBe('PA.XII');
  });

  it('handles short code with only two segments', () => {
    expect(getAcsArea('PA.II')).toBe('PA.II');
  });

  it('handles different prefixes', () => {
    expect(getAcsArea('PA.VI.C.K3')).toBe('PA.VI');
  });
});

// ─── ACS_AREA_NAMES ──────────────────────────────────────────────────────────

describe('ACS_AREA_NAMES', () => {
  it('defines PA.I as Preflight Preparation', () => {
    expect(ACS_AREA_NAMES['PA.I']).toBe('Preflight Preparation');
  });

  it('defines PA.IX as Emergency Operations', () => {
    expect(ACS_AREA_NAMES['PA.IX']).toBe('Emergency Operations');
  });

  it('contains at least 8 area entries', () => {
    expect(Object.keys(ACS_AREA_NAMES).length).toBeGreaterThanOrEqual(8);
  });
});

// ─── groupByAcsArea ──────────────────────────────────────────────────────────

describe('groupByAcsArea', () => {
  it('returns an empty array for empty results', () => {
    expect(groupByAcsArea([])).toEqual([]);
  });

  it('groups results by two-segment ACS prefix', () => {
    const results = [
      { acsCode: 'PA.I.B.K1', correct: true },
      { acsCode: 'PA.I.C.K2', correct: false },
      { acsCode: 'PA.II.A.K1', correct: true },
    ];
    const groups = groupByAcsArea(results);
    const areas = groups.map(g => g.area);
    expect(areas).toContain('PA.I');
    expect(areas).toContain('PA.II');
  });

  it('counts correct and total per area accurately', () => {
    const results = [
      { acsCode: 'PA.I.B.K1', correct: true },
      { acsCode: 'PA.I.B.K2', correct: true },
      { acsCode: 'PA.I.C.K1', correct: false },
    ];
    const groups = groupByAcsArea(results);
    const paI = groups.find(g => g.area === 'PA.I');
    expect(paI.correct).toBe(2);
    expect(paI.total).toBe(3);
  });

  it('calculates pct as a rounded integer', () => {
    const results = [
      { acsCode: 'PA.VI.A.K1', correct: true },
      { acsCode: 'PA.VI.A.K2', correct: true },
      { acsCode: 'PA.VI.A.K3', correct: false },
    ];
    const groups = groupByAcsArea(results);
    const paVI = groups.find(g => g.area === 'PA.VI');
    expect(paVI.pct).toBe(67); // 2/3 = 66.7 → rounds to 67
  });

  it('sorts results from worst pct to best pct (ascending)', () => {
    const results = [
      { acsCode: 'PA.I.A.K1',  correct: true  }, // PA.I → 100%
      { acsCode: 'PA.II.A.K1', correct: false }, // PA.II → 0%
      { acsCode: 'PA.VI.A.K1', correct: true  },
      { acsCode: 'PA.VI.A.K2', correct: false }, // PA.VI → 50%
    ];
    const groups = groupByAcsArea(results);
    const pcts = groups.map(g => g.pct);
    expect(pcts).toEqual([...pcts].sort((a, b) => a - b));
  });

  it('uses ACS_AREA_NAMES for known areas', () => {
    const results = [{ acsCode: 'PA.I.B.K1', correct: true }];
    const groups = groupByAcsArea(results);
    expect(groups[0].name).toBe('Preflight Preparation');
  });

  it('falls back to the area code string for unknown areas', () => {
    const results = [{ acsCode: 'PA.XX.A.K1', correct: true }];
    const groups = groupByAcsArea(results);
    expect(groups[0].name).toBe('PA.XX');
  });

  it('handles 100% correct in an area', () => {
    const results = [
      { acsCode: 'PA.IX.A.K1', correct: true },
      { acsCode: 'PA.IX.A.K2', correct: true },
    ];
    const groups = groupByAcsArea(results);
    expect(groups[0].pct).toBe(100);
    expect(groups[0].correct).toBe(2);
  });

  it('handles 0% correct in an area', () => {
    const results = [
      { acsCode: 'PA.VII.A.K1', correct: false },
      { acsCode: 'PA.VII.A.K2', correct: false },
    ];
    const groups = groupByAcsArea(results);
    expect(groups[0].pct).toBe(0);
    expect(groups[0].correct).toBe(0);
  });
});

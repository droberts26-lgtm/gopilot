import { describe, it, expect, beforeEach } from 'vitest';
import { loadBestTimes, saveBestTime, getBestTime } from '@/lib/matchingTimes';

beforeEach(() => {
  localStorage.clear();
});

// ─── loadBestTimes ────────────────────────────────────────────────────────────

describe('loadBestTimes', () => {
  it('returns empty object when localStorage is empty', () => {
    expect(loadBestTimes()).toEqual({});
  });

  it('returns empty object when stored JSON is malformed', () => {
    localStorage.setItem('gopilot_matching_times', 'not{json');
    expect(loadBestTimes()).toEqual({});
  });

  it('returns empty object when stored value is an array', () => {
    localStorage.setItem('gopilot_matching_times', JSON.stringify([1, 2, 3]));
    expect(loadBestTimes()).toEqual({});
  });

  it('returns empty object when stored value is null', () => {
    localStorage.setItem('gopilot_matching_times', 'null');
    expect(loadBestTimes()).toEqual({});
  });

  it('returns the stored times when valid', () => {
    const data = { 'airspace-classes': 12000, 'weather-metar': 8500 };
    localStorage.setItem('gopilot_matching_times', JSON.stringify(data));
    expect(loadBestTimes()).toEqual(data);
  });

  it('does not throw when localStorage.getItem throws', () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => { throw new Error('SecurityError'); };
    expect(loadBestTimes()).toEqual({});
    Storage.prototype.getItem = original;
  });
});

// ─── saveBestTime ─────────────────────────────────────────────────────────────

describe('saveBestTime', () => {
  it('saves the time on first completion', () => {
    saveBestTime('airspace-classes', 15000);
    expect(loadBestTimes()['airspace-classes']).toBe(15000);
  });

  it('returns isNewBest=true on first completion', () => {
    const result = saveBestTime('airspace-classes', 15000);
    expect(result.isNewBest).toBe(true);
  });

  it('returns previousBest=null on first completion', () => {
    const result = saveBestTime('airspace-classes', 15000);
    expect(result.previousBest).toBeNull();
  });

  it('returns bestTime equal to the saved time on first completion', () => {
    const result = saveBestTime('airspace-classes', 15000);
    expect(result.bestTime).toBe(15000);
  });

  it('replaces the time when new time is faster', () => {
    saveBestTime('airspace-classes', 15000);
    saveBestTime('airspace-classes', 10000);
    expect(loadBestTimes()['airspace-classes']).toBe(10000);
  });

  it('returns isNewBest=true when new time is faster', () => {
    saveBestTime('airspace-classes', 15000);
    const result = saveBestTime('airspace-classes', 10000);
    expect(result.isNewBest).toBe(true);
  });

  it('returns previousBest with old time when improving', () => {
    saveBestTime('airspace-classes', 15000);
    const result = saveBestTime('airspace-classes', 10000);
    expect(result.previousBest).toBe(15000);
  });

  it('does not replace the time when new time is slower', () => {
    saveBestTime('airspace-classes', 10000);
    saveBestTime('airspace-classes', 20000);
    expect(loadBestTimes()['airspace-classes']).toBe(10000);
  });

  it('returns isNewBest=false when time is not faster', () => {
    saveBestTime('airspace-classes', 10000);
    const result = saveBestTime('airspace-classes', 20000);
    expect(result.isNewBest).toBe(false);
  });

  it('returns the existing bestTime when time is not faster', () => {
    saveBestTime('airspace-classes', 10000);
    const result = saveBestTime('airspace-classes', 20000);
    expect(result.bestTime).toBe(10000);
  });

  it('stores times for multiple sets independently', () => {
    saveBestTime('set-a', 5000);
    saveBestTime('set-b', 8000);
    const times = loadBestTimes();
    expect(times['set-a']).toBe(5000);
    expect(times['set-b']).toBe(8000);
  });

  it('does not throw when localStorage.setItem throws', () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('QuotaExceeded'); };
    expect(() => saveBestTime('airspace-classes', 5000)).not.toThrow();
    Storage.prototype.setItem = original;
  });
});

// ─── getBestTime ──────────────────────────────────────────────────────────────

describe('getBestTime', () => {
  it('returns null when no time saved for the set', () => {
    expect(getBestTime('airspace-classes')).toBeNull();
  });

  it('returns the saved best time', () => {
    saveBestTime('airspace-classes', 12345);
    expect(getBestTime('airspace-classes')).toBe(12345);
  });

  it('returns null for an unknown set even when other sets have times', () => {
    saveBestTime('set-a', 5000);
    expect(getBestTime('set-b')).toBeNull();
  });
});

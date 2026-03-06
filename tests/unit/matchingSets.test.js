import { describe, it, expect } from 'vitest';
import { matchingCategories, TOTAL_SETS, allMatchingSets } from '@/data/matchingSets';

// ─── Schema integrity ────────────────────────────────────────────────────────

describe('matchingCategories schema', () => {
  it('exports an array', () => {
    expect(Array.isArray(matchingCategories)).toBe(true);
  });

  it('has exactly 6 categories', () => {
    expect(matchingCategories.length).toBe(6);
  });

  it('every category has id, name, icon, color, and sets fields', () => {
    for (const cat of matchingCategories) {
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('icon');
      expect(cat).toHaveProperty('color');
      expect(Array.isArray(cat.sets)).toBe(true);
    }
  });

  it('every category has exactly 3 sets', () => {
    for (const cat of matchingCategories) {
      expect(cat.sets.length).toBe(3);
    }
  });

  it('every set has id, name, and pairs fields', () => {
    for (const cat of matchingCategories) {
      for (const set of cat.sets) {
        expect(set).toHaveProperty('id');
        expect(set).toHaveProperty('name');
        expect(Array.isArray(set.pairs)).toBe(true);
      }
    }
  });

  it('every set has exactly 8 pairs', () => {
    for (const cat of matchingCategories) {
      for (const set of cat.sets) {
        expect(set.pairs.length).toBe(8);
      }
    }
  });

  it('every pair has id, term, and definition', () => {
    for (const cat of matchingCategories) {
      for (const set of cat.sets) {
        for (const pair of set.pairs) {
          expect(pair).toHaveProperty('id');
          expect(typeof pair.term).toBe('string');
          expect(typeof pair.definition).toBe('string');
          expect(pair.term.length).toBeGreaterThan(0);
          expect(pair.definition.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('pair ids within each set are unique numbers', () => {
    for (const cat of matchingCategories) {
      for (const set of cat.sets) {
        const ids = set.pairs.map(p => p.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
        for (const id of ids) expect(typeof id).toBe('number');
      }
    }
  });

  it('set ids within each category are unique strings', () => {
    for (const cat of matchingCategories) {
      const ids = cat.sets.map(s => s.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    }
  });

  it('category ids are unique across all categories', () => {
    const ids = matchingCategories.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all set ids are unique across the entire data set', () => {
    const ids = matchingCategories.flatMap(c => c.sets.map(s => s.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── Specific category/set existence ─────────────────────────────────────────

describe('expected categories exist', () => {
  it('has an airspace category', () => {
    expect(matchingCategories.find(c => c.id === 'airspace')).toBeDefined();
  });

  it('has a weather category', () => {
    expect(matchingCategories.find(c => c.id === 'weather')).toBeDefined();
  });

  it('has an atc category', () => {
    expect(matchingCategories.find(c => c.id === 'atc')).toBeDefined();
  });

  it('has a regulations category', () => {
    expect(matchingCategories.find(c => c.id === 'regulations')).toBeDefined();
  });

  it('has an instruments category', () => {
    expect(matchingCategories.find(c => c.id === 'instruments')).toBeDefined();
  });

  it('has a navigation category', () => {
    expect(matchingCategories.find(c => c.id === 'navigation')).toBeDefined();
  });
});

// ─── TOTAL_SETS ───────────────────────────────────────────────────────────────

describe('TOTAL_SETS', () => {
  it('equals 18 (6 categories × 3 sets)', () => {
    expect(TOTAL_SETS).toBe(18);
  });

  it('matches the actual count of all sets', () => {
    const actual = matchingCategories.reduce((sum, cat) => sum + cat.sets.length, 0);
    expect(TOTAL_SETS).toBe(actual);
  });
});

// ─── allMatchingSets ──────────────────────────────────────────────────────────

describe('allMatchingSets', () => {
  it('has 18 entries', () => {
    expect(allMatchingSets.length).toBe(18);
  });

  it('every entry has categoryId, categoryName, and color attached', () => {
    for (const set of allMatchingSets) {
      expect(typeof set.categoryId).toBe('string');
      expect(typeof set.categoryName).toBe('string');
      expect(typeof set.color).toBe('string');
    }
  });

  it('still has id, name, and pairs from the original set', () => {
    for (const set of allMatchingSets) {
      expect(set).toHaveProperty('id');
      expect(set).toHaveProperty('name');
      expect(Array.isArray(set.pairs)).toBe(true);
    }
  });
});

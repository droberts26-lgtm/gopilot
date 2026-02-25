/**
 * @fileoverview Data integrity tests for the live question banks.
 *
 * These tests validate the ACTUAL production data files, not just the
 * validator logic. A failing test here means a content editor (or an
 * AI-generation script) introduced invalid data that must be fixed
 * before it reaches users.
 */

import { describe, it, expect } from 'vitest';
import { parQuestions, figurePdfPages } from '@/data/parQuestions';
import { scenarios, levelInfo } from '@/data/atcScenarios';
import { validateParQuestionBank, validateAtcScenarioBank } from '@/lib/validators';

// ─── PAR Question bank ────────────────────────────────────────────────────────

describe('PAR question bank — data integrity', () => {
  it('passes full bank validation with no errors', () => {
    const result = validateParQuestionBank(parQuestions);
    if (!result.valid) {
      // Surface every error for easy debugging
      console.error('Validation errors:\n', result.errors.join('\n'));
    }
    expect(result.valid).toBe(true);
  });

  it('contains exactly 61 questions', () => {
    expect(parQuestions).toHaveLength(61);
  });

  it('has sequential IDs from 1 to 61', () => {
    const ids = parQuestions.map(q => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 61 }, (_, i) => i + 1));
  });

  it('every question has a non-empty explanation', () => {
    parQuestions.forEach(q => {
      expect(q.explanation.trim().length, `Q${q.id} missing explanation`).toBeGreaterThan(20);
    });
  });

  it('every question has exactly one correct option', () => {
    parQuestions.forEach(q => {
      const correct = q.options.filter(o => o.correct);
      expect(correct, `Q${q.id} should have exactly 1 correct option`).toHaveLength(1);
    });
  });

  it('all referenced figure numbers exist in figurePdfPages', () => {
    parQuestions.forEach(q => {
      q.figures.forEach(fig => {
        expect(
          figurePdfPages[fig],
          `Q${q.id} references Figure ${fig} which has no entry in figurePdfPages`,
        ).toBeDefined();
      });
    });
  });

  it('all figurePdfPages values are positive integers (valid PDF pages)', () => {
    Object.entries(figurePdfPages).forEach(([fig, page]) => {
      expect(Number.isInteger(page) && page > 0, `Figure ${fig} maps to invalid page ${page}`).toBe(true);
    });
  });

  it('all options use letters A, B, or C', () => {
    parQuestions.forEach(q => {
      q.options.forEach(opt => {
        expect(['A', 'B', 'C'], `Q${q.id} has option letter "${opt.letter}"`).toContain(opt.letter);
      });
    });
  });

  it('no question has an empty question text', () => {
    parQuestions.forEach(q => {
      expect(q.question.trim().length, `Q${q.id} has empty question text`).toBeGreaterThan(0);
    });
  });

  it('no two questions share the same question text', () => {
    const texts = parQuestions.map(q => q.question.trim());
    const unique = new Set(texts);
    expect(unique.size).toBe(texts.length);
  });

  it('no option text is repeated within a single question', () => {
    parQuestions.forEach(q => {
      const texts = q.options.map(o => o.text.trim());
      const unique = new Set(texts);
      expect(unique.size, `Q${q.id} has duplicate option texts`).toBe(texts.length);
    });
  });

  it('all ACS codes match the PA.*.*.* format', () => {
    const pattern = /^PA\.[IVX]+\.[A-Z]+\.[A-Z0-9]+[a-z]?$/;
    parQuestions.forEach(q => {
      expect(pattern.test(q.acsCode), `Q${q.id} has invalid ACS code: "${q.acsCode}"`).toBe(true);
    });
  });
});

// ─── ATC Scenario bank ────────────────────────────────────────────────────────

describe('ATC scenario bank — data integrity', () => {
  it('passes full bank validation with no errors', () => {
    const result = validateAtcScenarioBank(scenarios);
    if (!result.valid) {
      console.error('Validation errors:\n', result.errors.join('\n'));
    }
    expect(result.valid).toBe(true);
  });

  it('has exactly 3 levels: student, general, commercial', () => {
    expect(Object.keys(scenarios).sort()).toEqual(['commercial', 'general', 'student']);
  });

  it('each level has at least 10 scenarios (enough for one full session)', () => {
    Object.entries(scenarios).forEach(([level, bank]) => {
      expect(bank.length, `${level} level has fewer than 10 scenarios`).toBeGreaterThanOrEqual(10);
    });
  });

  it('every scenario has exactly one correct option', () => {
    Object.entries(scenarios).forEach(([level, bank]) => {
      bank.forEach(s => {
        const correct = s.options.filter(o => o.correct);
        expect(correct, `${level}/${s.id} should have exactly 1 correct option`).toHaveLength(1);
      });
    });
  });

  it('every scenario has a non-empty explanation', () => {
    Object.entries(scenarios).forEach(([level, bank]) => {
      bank.forEach(s => {
        expect(s.explanation.trim().length, `${level}/${s.id} missing explanation`).toBeGreaterThan(20);
      });
    });
  });

  it('every scenario has a non-empty ATC message', () => {
    Object.entries(scenarios).forEach(([level, bank]) => {
      bank.forEach(s => {
        expect(s.atcMessage.trim().length, `${level}/${s.id} has empty atcMessage`).toBeGreaterThan(10);
      });
    });
  });

  it('no two scenarios in the same level share an id', () => {
    Object.entries(scenarios).forEach(([level, bank]) => {
      const ids = bank.map(s => s.id);
      const unique = new Set(ids);
      expect(unique.size, `${level} level has duplicate IDs`).toBe(ids.length);
    });
  });

  it('levelInfo has entries for every scenario level', () => {
    Object.keys(scenarios).forEach(level => {
      expect(levelInfo[level], `levelInfo missing entry for level "${level}"`).toBeDefined();
    });
  });

  it('levelInfo entries have required fields: label, icon, color, desc', () => {
    Object.entries(levelInfo).forEach(([level, info]) => {
      expect(info.label, `${level} missing label`).toBeTruthy();
      expect(info.icon, `${level} missing icon`).toBeTruthy();
      expect(info.color, `${level} missing color`).toBeTruthy();
      expect(info.desc, `${level} missing desc`).toBeTruthy();
    });
  });
});

// ─── figurePdfPages mapping ───────────────────────────────────────────────────

describe('figurePdfPages mapping', () => {
  it('is an object', () => {
    expect(typeof figurePdfPages).toBe('object');
  });

  it('has at least 60 figure entries', () => {
    expect(Object.keys(figurePdfPages).length).toBeGreaterThanOrEqual(60);
  });

  it('all page values are between 1 and 200 (reasonable PDF range)', () => {
    Object.entries(figurePdfPages).forEach(([fig, page]) => {
      expect(page, `Figure ${fig} has out-of-range page: ${page}`).toBeGreaterThanOrEqual(1);
      expect(page, `Figure ${fig} has out-of-range page: ${page}`).toBeLessThanOrEqual(200);
    });
  });

  it('includes key figures used by PAR questions', () => {
    // These figures are referenced by actual PAR questions
    const requiredFigures = [8, 17, 20, 25, 26, 32, 33, 35, 38, 47, 48, 52, 64, 65, 78];
    requiredFigures.forEach(fig => {
      expect(figurePdfPages[fig], `Missing required Figure ${fig}`).toBeDefined();
    });
  });
});

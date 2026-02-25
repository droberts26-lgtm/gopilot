import { describe, it, expect } from 'vitest';
import {
  validateParQuestion,
  validateParQuestionBank,
  validateAtcScenario,
  validateAtcScenarioBank,
} from '@/lib/validators';

// ─── Helper factories ────────────────────────────────────────────────────────

const makeParQuestion = (overrides = {}) => ({
  id: 1,
  question: 'What does the red line on an airspeed indicator represent?',
  figures: [],
  options: [
    { letter: 'A', text: 'Maneuvering speed.', correct: false },
    { letter: 'B', text: 'Turbulent or rough-air speed.', correct: false },
    { letter: 'C', text: 'Never-exceed speed.', correct: true },
  ],
  explanation: 'The red line (VNE) marks the never-exceed speed. Exceeding it can cause structural failure.',
  acsCode: 'PA.I.F.R2',
  ...overrides,
});

const makeAtcScenario = (overrides = {}) => ({
  id: 's01',
  atcMessage: 'Cessna 7-2-3-Tango-Foxtrot, runway 9 right, cleared for takeoff.',
  situation: 'You are lined up on runway 9 right waiting for clearance.',
  options: [
    { text: 'Cleared for takeoff runway 9 right, 7-2-3-Tango-Foxtrot.', correct: true },
    { text: 'Roger, taking off now.', correct: false },
    { text: 'Wilco, 7-2-3-Tango-Foxtrot.', correct: false },
    { text: 'Thank you, departing runway 9.', correct: false },
  ],
  explanation: 'Takeoff clearances must include the phrase "cleared for takeoff" and the runway number.',
  ...overrides,
});

// ─── validateParQuestion ─────────────────────────────────────────────────────

describe('validateParQuestion', () => {
  it('accepts a valid question', () => {
    const result = validateParQuestion(makeParQuestion());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects null', () => {
    const result = validateParQuestion(null);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/must be an object/);
  });

  it('rejects a non-integer id', () => {
    const result = validateParQuestion(makeParQuestion({ id: 'q1' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('id'))).toBe(true);
  });

  it('rejects id = 0', () => {
    const result = validateParQuestion(makeParQuestion({ id: 0 }));
    expect(result.valid).toBe(false);
  });

  it('rejects a short question text', () => {
    const result = validateParQuestion(makeParQuestion({ question: 'Short?' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('question'))).toBe(true);
  });

  it('rejects non-array figures', () => {
    const result = validateParQuestion(makeParQuestion({ figures: null }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('figures'))).toBe(true);
  });

  it('rejects a figure value of 0', () => {
    const result = validateParQuestion(makeParQuestion({ figures: [0] }));
    expect(result.valid).toBe(false);
  });

  it('rejects zero correct options', () => {
    const q = makeParQuestion({
      options: [
        { letter: 'A', text: 'Wrong one.', correct: false },
        { letter: 'B', text: 'Wrong two.', correct: false },
        { letter: 'C', text: 'Wrong three.', correct: false },
      ],
    });
    const result = validateParQuestion(q);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('exactly 1 correct'))).toBe(true);
  });

  it('rejects two correct options', () => {
    const q = makeParQuestion({
      options: [
        { letter: 'A', text: 'Correct one.', correct: true },
        { letter: 'B', text: 'Correct two.', correct: true },
        { letter: 'C', text: 'Wrong.', correct: false },
      ],
    });
    expect(validateParQuestion(q).valid).toBe(false);
  });

  it('rejects duplicate option letters', () => {
    const q = makeParQuestion({
      options: [
        { letter: 'A', text: 'First.', correct: true },
        { letter: 'A', text: 'Duplicate letter.', correct: false },
        { letter: 'C', text: 'Third.', correct: false },
      ],
    });
    expect(validateParQuestion(q).valid).toBe(false);
  });

  it('rejects invalid option letter', () => {
    const q = makeParQuestion({
      options: [
        { letter: 'X', text: 'Bad letter.', correct: true },
        { letter: 'B', text: 'Fine.', correct: false },
        { letter: 'C', text: 'Fine.', correct: false },
      ],
    });
    expect(validateParQuestion(q).valid).toBe(false);
  });

  it('rejects a short explanation', () => {
    const result = validateParQuestion(makeParQuestion({ explanation: 'Too short.' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('explanation'))).toBe(true);
  });

  it('rejects a malformed ACS code', () => {
    const result = validateParQuestion(makeParQuestion({ acsCode: 'INVALID' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('acsCode'))).toBe(true);
  });

  it('accepts questions with figures', () => {
    const result = validateParQuestion(makeParQuestion({ figures: [17, 32] }));
    expect(result.valid).toBe(true);
  });

  it('accumulates multiple errors', () => {
    const result = validateParQuestion({ id: -1, question: 'x', figures: 'bad', options: [], explanation: 'x', acsCode: 'bad' });
    expect(result.errors.length).toBeGreaterThan(2);
  });
});

// ─── validateParQuestionBank ──────────────────────────────────────────────────

describe('validateParQuestionBank', () => {
  it('accepts a valid bank', () => {
    const bank = [makeParQuestion({ id: 1 }), makeParQuestion({ id: 2 })];
    expect(validateParQuestionBank(bank).valid).toBe(true);
  });

  it('rejects duplicate IDs', () => {
    const bank = [makeParQuestion({ id: 1 }), makeParQuestion({ id: 1 })];
    const result = validateParQuestionBank(bank);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('duplicate'))).toBe(true);
  });

  it('rejects an empty bank', () => {
    expect(validateParQuestionBank([]).valid).toBe(false);
  });

  it('rejects non-array input', () => {
    expect(validateParQuestionBank('not an array').valid).toBe(false);
  });

  it('surfaces errors from individual questions with context', () => {
    const bank = [makeParQuestion({ id: 1 }), makeParQuestion({ id: 2, question: 'x' })];
    const result = validateParQuestionBank(bank);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('id=2'))).toBe(true);
  });
});

// ─── validateAtcScenario ─────────────────────────────────────────────────────

describe('validateAtcScenario', () => {
  it('accepts a valid scenario', () => {
    expect(validateAtcScenario(makeAtcScenario()).valid).toBe(true);
  });

  it('rejects invalid id format', () => {
    const result = validateAtcScenario(makeAtcScenario({ id: 'x01' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('id'))).toBe(true);
  });

  it('accepts all level prefixes: s, g, c', () => {
    expect(validateAtcScenario(makeAtcScenario({ id: 's01' })).valid).toBe(true);
    expect(validateAtcScenario(makeAtcScenario({ id: 'g15' })).valid).toBe(true);
    expect(validateAtcScenario(makeAtcScenario({ id: 'c07' })).valid).toBe(true);
  });

  it('rejects zero correct options', () => {
    const s = makeAtcScenario({
      options: [
        { text: 'Wrong A.', correct: false },
        { text: 'Wrong B.', correct: false },
      ],
    });
    expect(validateAtcScenario(s).valid).toBe(false);
  });

  it('rejects two correct options', () => {
    const s = makeAtcScenario({
      options: [
        { text: 'Correct A.', correct: true },
        { text: 'Correct B.', correct: true },
      ],
    });
    expect(validateAtcScenario(s).valid).toBe(false);
  });

  it('rejects a short atcMessage', () => {
    expect(validateAtcScenario(makeAtcScenario({ atcMessage: 'Short.' })).valid).toBe(false);
  });

  it('rejects a short situation', () => {
    expect(validateAtcScenario(makeAtcScenario({ situation: 'Short.' })).valid).toBe(false);
  });
});

// ─── validateAtcScenarioBank ──────────────────────────────────────────────────

describe('validateAtcScenarioBank', () => {
  const makeBank = () => ({
    student:    [makeAtcScenario({ id: 's01' })],
    general:    [makeAtcScenario({ id: 'g01' })],
    commercial: [makeAtcScenario({ id: 'c01' })],
  });

  it('accepts a valid bank', () => {
    expect(validateAtcScenarioBank(makeBank()).valid).toBe(true);
  });

  it('rejects an array (not object)', () => {
    expect(validateAtcScenarioBank([]).valid).toBe(false);
  });

  it('rejects unknown level keys', () => {
    const bank = { elite: [makeAtcScenario({ id: 'e01' })] };
    const result = validateAtcScenarioBank(bank);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('unknown level'))).toBe(true);
  });

  it('rejects cross-level duplicate IDs', () => {
    const bank = {
      student:    [makeAtcScenario({ id: 's01' })],
      general:    [makeAtcScenario({ id: 's01' })], // duplicate
      commercial: [makeAtcScenario({ id: 'c01' })],
    };
    const result = validateAtcScenarioBank(bank);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('duplicate'))).toBe(true);
  });
});

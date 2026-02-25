/**
 * @fileoverview Data validators for GoPilot question banks.
 *
 * All validators return a { valid: boolean, errors: string[] } shape so
 * callers can either throw on invalid data or surface structured error
 * messages (useful when validating AI-generated content before insertion).
 *
 * These are pure functions with no React/Next.js dependencies so they can
 * run in test environments, API routes, and CLI scripts equally.
 */

/** Valid ACS code pattern for Private Pilot Airplane questions (PA.*.*.*) */
const ACS_CODE_PATTERN = /^PA\.[IVX]+\.[A-Z]+\.[A-Z0-9]+[a-z]?$/;

/** Letters allowed for answer options */
const VALID_LETTERS = new Set(['A', 'B', 'C', 'D']);

/** ATC level identifiers */
const VALID_ATC_LEVELS = new Set(['student', 'general', 'commercial']);

/**
 * Validates a single PAR (Private Pilot Airplane) knowledge question.
 *
 * Expected shape:
 * {
 *   id: number,
 *   question: string,
 *   figures: number[],
 *   options: Array<{ letter: 'A'|'B'|'C', text: string, correct: boolean }>,
 *   explanation: string,
 *   acsCode: string,
 * }
 *
 * @param {unknown} question
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateParQuestion(question) {
  const errors = [];

  if (question === null || typeof question !== 'object') {
    return { valid: false, errors: ['question must be an object'] };
  }

  // id
  if (typeof question.id !== 'number' || !Number.isInteger(question.id) || question.id < 1) {
    errors.push('id must be a positive integer');
  }

  // question text
  if (typeof question.question !== 'string' || question.question.trim().length < 10) {
    errors.push('question must be a string with at least 10 characters');
  }

  // figures
  if (!Array.isArray(question.figures)) {
    errors.push('figures must be an array');
  } else {
    question.figures.forEach((fig, i) => {
      if (typeof fig !== 'number' || !Number.isInteger(fig) || fig < 1) {
        errors.push(`figures[${i}] must be a positive integer`);
      }
    });
  }

  // options
  if (!Array.isArray(question.options)) {
    errors.push('options must be an array');
  } else {
    if (question.options.length < 2 || question.options.length > 4) {
      errors.push(`options must have 2–4 items, got ${question.options.length}`);
    }

    const correctCount = question.options.filter(o => o?.correct === true).length;
    if (correctCount !== 1) {
      errors.push(`options must have exactly 1 correct answer, found ${correctCount}`);
    }

    const letters = question.options.map(o => o?.letter);
    const uniqueLetters = new Set(letters);
    if (uniqueLetters.size !== letters.length) {
      errors.push('option letters must be unique');
    }

    question.options.forEach((opt, i) => {
      if (opt === null || typeof opt !== 'object') {
        errors.push(`options[${i}] must be an object`);
        return;
      }
      if (!VALID_LETTERS.has(opt.letter)) {
        errors.push(`options[${i}].letter must be A, B, C, or D — got "${opt.letter}"`);
      }
      if (typeof opt.text !== 'string' || opt.text.trim().length === 0) {
        errors.push(`options[${i}].text must be a non-empty string`);
      }
      if (typeof opt.correct !== 'boolean') {
        errors.push(`options[${i}].correct must be a boolean`);
      }
    });
  }

  // explanation
  if (typeof question.explanation !== 'string' || question.explanation.trim().length < 20) {
    errors.push('explanation must be a string with at least 20 characters');
  }

  // acsCode
  if (typeof question.acsCode !== 'string' || !ACS_CODE_PATTERN.test(question.acsCode)) {
    errors.push(`acsCode must match pattern PA.X.X.Xx — got "${question.acsCode}"`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a full bank of PAR questions.
 * Checks individual question validity AND cross-bank constraints (unique IDs).
 *
 * @param {unknown[]} questions
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateParQuestionBank(questions) {
  const errors = [];

  if (!Array.isArray(questions)) {
    return { valid: false, errors: ['question bank must be an array'] };
  }

  if (questions.length === 0) {
    errors.push('question bank must not be empty');
  }

  const ids = [];
  questions.forEach((q, i) => {
    const result = validateParQuestion(q);
    result.errors.forEach(e => errors.push(`Q[${i}] (id=${q?.id}): ${e}`));
    if (typeof q?.id === 'number') ids.push(q.id);
  });

  // Check for duplicate IDs
  const seen = new Set();
  ids.forEach(id => {
    if (seen.has(id)) errors.push(`duplicate question id: ${id}`);
    seen.add(id);
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a single ATC scenario.
 *
 * Expected shape:
 * {
 *   id: string,
 *   atcMessage: string,
 *   situation: string,
 *   options: Array<{ text: string, correct: boolean }>,
 *   explanation: string,
 * }
 *
 * @param {unknown} scenario
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateAtcScenario(scenario) {
  const errors = [];

  if (scenario === null || typeof scenario !== 'object') {
    return { valid: false, errors: ['scenario must be an object'] };
  }

  // id
  if (typeof scenario.id !== 'string' || !/^[sgc]\d{2}$/.test(scenario.id)) {
    errors.push(`id must be a string matching s##, g##, or c## — got "${scenario.id}"`);
  }

  // atcMessage
  if (typeof scenario.atcMessage !== 'string' || scenario.atcMessage.trim().length < 10) {
    errors.push('atcMessage must be a string with at least 10 characters');
  }

  // situation
  if (typeof scenario.situation !== 'string' || scenario.situation.trim().length < 10) {
    errors.push('situation must be a string with at least 10 characters');
  }

  // options
  if (!Array.isArray(scenario.options)) {
    errors.push('options must be an array');
  } else {
    if (scenario.options.length < 2 || scenario.options.length > 4) {
      errors.push(`options must have 2–4 items, got ${scenario.options.length}`);
    }

    const correctCount = scenario.options.filter(o => o?.correct === true).length;
    if (correctCount !== 1) {
      errors.push(`options must have exactly 1 correct answer, found ${correctCount}`);
    }

    scenario.options.forEach((opt, i) => {
      if (opt === null || typeof opt !== 'object') {
        errors.push(`options[${i}] must be an object`);
        return;
      }
      if (typeof opt.text !== 'string' || opt.text.trim().length === 0) {
        errors.push(`options[${i}].text must be a non-empty string`);
      }
      if (typeof opt.correct !== 'boolean') {
        errors.push(`options[${i}].correct must be a boolean`);
      }
    });
  }

  // explanation
  if (typeof scenario.explanation !== 'string' || scenario.explanation.trim().length < 20) {
    errors.push('explanation must be a string with at least 20 characters');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a full ATC scenario bank (all levels combined).
 *
 * @param {Record<string, unknown[]>} scenariosByLevel
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateAtcScenarioBank(scenariosByLevel) {
  const errors = [];

  if (scenariosByLevel === null || typeof scenariosByLevel !== 'object' || Array.isArray(scenariosByLevel)) {
    return { valid: false, errors: ['scenario bank must be an object keyed by level'] };
  }

  const levelKeys = Object.keys(scenariosByLevel);
  if (levelKeys.length === 0) {
    errors.push('scenario bank must not be empty');
  }

  levelKeys.forEach(level => {
    if (!VALID_ATC_LEVELS.has(level)) {
      errors.push(`unknown level key: "${level}" (expected student, general, commercial)`);
    }
    const scenarios = scenariosByLevel[level];
    if (!Array.isArray(scenarios)) {
      errors.push(`${level}: scenarios must be an array`);
      return;
    }
    if (scenarios.length === 0) {
      errors.push(`${level}: must have at least one scenario`);
    }
    scenarios.forEach((s, i) => {
      const result = validateAtcScenario(s);
      result.errors.forEach(e => errors.push(`${level}[${i}] (id=${s?.id}): ${e}`));
    });
  });

  // Check for duplicate IDs across all levels
  const allIds = levelKeys.flatMap(l => (Array.isArray(scenariosByLevel[l]) ? scenariosByLevel[l] : []).map(s => s?.id));
  const seen = new Set();
  allIds.forEach(id => {
    if (seen.has(id)) errors.push(`duplicate scenario id: ${id}`);
    seen.add(id);
  });

  return { valid: errors.length === 0, errors };
}

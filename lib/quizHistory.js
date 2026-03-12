/**
 * @fileoverview Lightweight quiz history + session autosave.
 *
 * History tracks the last 10 completed sessions (score, date, etc.).
 * Autosave stores an in-progress session so the user can resume after a refresh.
 *
 * All functions are silent — they never throw.
 */

const ATC_HISTORY_KEY   = 'gopilot_atc_history';
const QUIZ_HISTORY_KEY  = 'gopilot_quiz_history';
const ATC_AUTOSAVE_KEY  = 'gopilot_atc_autosave';
const QUIZ_AUTOSAVE_KEY = 'gopilot_quiz_autosave';

const MAX_HISTORY    = 10;
const SESSION_TTL_MS = 86_400_000; // 24 h

// ── ATC History ───────────────────────────────────────────────────────────────

/**
 * Record a completed ATC session.
 * @param {string} level
 * @param {number} score
 * @param {number} total
 */
export function saveAtcResult(level, score, total) {
  try {
    const history = loadAtcHistory();
    history.unshift({ date: Date.now(), level, score, total, pct: Math.round((score / total) * 100) });
    localStorage.setItem(ATC_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch (_) {}
}

/**
 * @returns {Array<{date:number, level:string, score:number, total:number, pct:number}>}
 */
export function loadAtcHistory() {
  try {
    return JSON.parse(localStorage.getItem(ATC_HISTORY_KEY) ?? '[]');
  } catch (_) { return []; }
}

// ── Quiz History ──────────────────────────────────────────────────────────────

/**
 * Record a completed knowledge quiz session.
 * @param {string} mode
 * @param {number} score
 * @param {number} total
 */
export function saveQuizResult(mode, score, total) {
  try {
    const history = loadQuizHistory();
    history.unshift({ date: Date.now(), mode, score, total, pct: Math.round((score / total) * 100) });
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch (_) {}
}

/**
 * @returns {Array<{date:number, mode:string, score:number, total:number, pct:number}>}
 */
export function loadQuizHistory() {
  try {
    return JSON.parse(localStorage.getItem(QUIZ_HISTORY_KEY) ?? '[]');
  } catch (_) { return []; }
}

// ── ATC Autosave ──────────────────────────────────────────────────────────────

/**
 * Save an in-progress ATC session.
 * @param {string}   level
 * @param {Array}    questions   full question objects (including shuffled options)
 * @param {number}   currentIdx  next question to answer (0-based)
 * @param {number}   score
 * @param {Array}    results     per-question outcome objects
 */
export function saveAtcSession(level, questions, currentIdx, score, results) {
  try {
    localStorage.setItem(ATC_AUTOSAVE_KEY, JSON.stringify(
      { level, questions, currentIdx, score, results, timestamp: Date.now() }
    ));
  } catch (_) {}
}

/**
 * Load a previously saved ATC session (null if none or expired).
 * @returns {{level:string, questions:Array, currentIdx:number, score:number, results:Array} | null}
 */
export function loadAtcSession() {
  try {
    const data = JSON.parse(localStorage.getItem(ATC_AUTOSAVE_KEY) ?? 'null');
    if (!data) return null;
    if (Date.now() - data.timestamp > SESSION_TTL_MS) { clearAtcSession(); return null; }
    return data;
  } catch (_) { return null; }
}

/** Clear saved ATC session (call on fresh start or session complete). */
export function clearAtcSession() {
  try { localStorage.removeItem(ATC_AUTOSAVE_KEY); } catch (_) {}
}

// ── Quiz Autosave ─────────────────────────────────────────────────────────────

/**
 * Save an in-progress knowledge quiz session (full test only).
 * @param {string}   mode
 * @param {Array}    questions   full question objects (shuffled)
 * @param {number}   currentIdx
 * @param {number}   score
 * @param {number[]} wrong       ids of wrong answers so far
 * @param {Array}    quizResults per-question {id, acsCode, correct}
 */
export function saveQuizSession(mode, questions, currentIdx, score, wrong, quizResults) {
  try {
    localStorage.setItem(QUIZ_AUTOSAVE_KEY, JSON.stringify(
      { mode, questions, currentIdx, score, wrong, quizResults, timestamp: Date.now() }
    ));
  } catch (_) {}
}

/**
 * Load a previously saved knowledge quiz session (null if none or expired).
 */
export function loadQuizSession() {
  try {
    const data = JSON.parse(localStorage.getItem(QUIZ_AUTOSAVE_KEY) ?? 'null');
    if (!data) return null;
    if (Date.now() - data.timestamp > SESSION_TTL_MS) { clearQuizSession(); return null; }
    return data;
  } catch (_) { return null; }
}

/** Clear saved knowledge quiz session. */
export function clearQuizSession() {
  try { localStorage.removeItem(QUIZ_AUTOSAVE_KEY); } catch (_) {}
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// The global test setup mocks this module — un-mock it so we test the real implementation.
vi.unmock('@/lib/quizHistory');

import {
  saveAtcResult, loadAtcHistory,
  saveQuizResult, loadQuizHistory,
  saveAtcSession, loadAtcSession, clearAtcSession,
  saveQuizSession, loadQuizSession, clearQuizSession,
} from '@/lib/quizHistory';

beforeEach(() => { localStorage.clear(); });
afterEach(()  => { localStorage.clear(); });

// ── ATC History ───────────────────────────────────────────────────────────────

describe('saveAtcResult / loadAtcHistory', () => {
  it('saves and loads a result', () => {
    saveAtcResult('student', 8, 10);
    const history = loadAtcHistory();
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ level: 'student', score: 8, total: 10, pct: 80 });
  });

  it('calculates pct correctly', () => {
    saveAtcResult('general', 7, 10);
    expect(loadAtcHistory()[0].pct).toBe(70);
  });

  it('keeps newest results first', () => {
    saveAtcResult('student', 7, 10);
    saveAtcResult('general', 9, 10);
    const history = loadAtcHistory();
    expect(history[0].level).toBe('general');
    expect(history[1].level).toBe('student');
  });

  it('caps history at 10 entries', () => {
    for (let i = 0; i < 12; i++) saveAtcResult('student', i % 10, 10);
    expect(loadAtcHistory()).toHaveLength(10);
  });

  it('returns empty array when nothing saved', () => {
    expect(loadAtcHistory()).toEqual([]);
  });

  it('includes a date timestamp', () => {
    saveAtcResult('student', 5, 10);
    expect(loadAtcHistory()[0].date).toBeTypeOf('number');
  });
});

// ── Quiz History ──────────────────────────────────────────────────────────────

describe('saveQuizResult / loadQuizHistory', () => {
  it('saves and loads a result', () => {
    saveQuizResult('full', 120, 131);
    const history = loadQuizHistory();
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ mode: 'full', score: 120, total: 131 });
  });

  it('returns empty array when nothing saved', () => {
    expect(loadQuizHistory()).toEqual([]);
  });

  it('keeps newest results first', () => {
    saveQuizResult('practice', 8, 10);
    saveQuizResult('full', 100, 131);
    expect(loadQuizHistory()[0].mode).toBe('full');
  });
});

// ── ATC Autosave ──────────────────────────────────────────────────────────────

const MOCK_QUESTIONS = [
  { id: 's01', atcMessage: 'Test msg 1', situation: 'Sit 1', options: [], explanation: 'Exp 1' },
  { id: 's02', atcMessage: 'Test msg 2', situation: 'Sit 2', options: [], explanation: 'Exp 2' },
];

describe('ATC autosave', () => {
  it('saves and loads a session', () => {
    const results = [{ atcMessage: 'Test msg 1', correct: true, selectedText: 'A', correctText: 'A' }];
    saveAtcSession('student', MOCK_QUESTIONS, 1, 1, results);
    const session = loadAtcSession();
    expect(session).not.toBeNull();
    expect(session.level).toBe('student');
    expect(session.currentIdx).toBe(1);
    expect(session.score).toBe(1);
    expect(session.questions).toHaveLength(2);
    expect(session.results).toHaveLength(1);
  });

  it('returns null after clearAtcSession', () => {
    saveAtcSession('student', MOCK_QUESTIONS, 0, 0, []);
    clearAtcSession();
    expect(loadAtcSession()).toBeNull();
  });

  it('returns null when nothing saved', () => {
    expect(loadAtcSession()).toBeNull();
  });

  it('returns null for expired sessions', () => {
    saveAtcSession('student', MOCK_QUESTIONS, 0, 0, []);
    const raw = JSON.parse(localStorage.getItem('gopilot_atc_autosave'));
    raw.timestamp = Date.now() - 90_000_000; // 25 hours ago
    localStorage.setItem('gopilot_atc_autosave', JSON.stringify(raw));
    expect(loadAtcSession()).toBeNull();
  });
});

// ── Quiz Autosave ─────────────────────────────────────────────────────────────

const MOCK_QUIZ_QUESTIONS = [
  { id: 1, question: 'Q1?', options: [], acsCode: 'PA.I.B.K1', explanation: 'E1', figures: [] },
  { id: 2, question: 'Q2?', options: [], acsCode: 'PA.II.A.K1', explanation: 'E2', figures: [] },
];

describe('Quiz autosave', () => {
  it('saves and loads a session', () => {
    const quizResults = [{ id: 1, acsCode: 'PA.I.B.K1', correct: true }];
    saveQuizSession('full', MOCK_QUIZ_QUESTIONS, 1, 1, [], quizResults);
    const session = loadQuizSession();
    expect(session).not.toBeNull();
    expect(session.mode).toBe('full');
    expect(session.currentIdx).toBe(1);
    expect(session.wrong).toEqual([]);
    expect(session.quizResults).toHaveLength(1);
  });

  it('returns null after clearQuizSession', () => {
    saveQuizSession('full', MOCK_QUIZ_QUESTIONS, 0, 0, [], []);
    clearQuizSession();
    expect(loadQuizSession()).toBeNull();
  });

  it('returns null when nothing saved', () => {
    expect(loadQuizSession()).toBeNull();
  });

  it('returns null for expired sessions', () => {
    saveQuizSession('full', MOCK_QUIZ_QUESTIONS, 0, 0, [], []);
    const raw = JSON.parse(localStorage.getItem('gopilot_quiz_autosave'));
    raw.timestamp = Date.now() - 90_000_000;
    localStorage.setItem('gopilot_quiz_autosave', JSON.stringify(raw));
    expect(loadQuizSession()).toBeNull();
  });
});

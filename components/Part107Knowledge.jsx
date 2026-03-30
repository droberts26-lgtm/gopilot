'use client';

import { useState, useEffect } from 'react';
import { part107Questions } from '@/data/part107Questions';
import { buildSession, calculatePct, isPassing, getPerformanceBadge } from '@/lib/quiz';
import { groupByAcsArea, getAcsArea, ACS_AREA_NAMES } from '@/lib/acsAreas';
import { saveQuizResult, loadQuizHistory } from '@/lib/quizHistory';
import {
  updateAcsPerformance, loadAcsPerformance, getAcsMasteryList, getWeakAreas,
} from '@/lib/acsPerformance';
import {
  addWrongAnswer, getDueCards, advanceInterval, getTotalCardCount,
} from '@/lib/spacedRepetition';
import ProModal from './ProModal';

const FULL_TEST_SECONDS = 9000; // 2 hours 30 minutes

function formatTimer(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function Part107Knowledge({ pro = false, proLoading = false }) {
  const [screen,       setScreen]       = useState('menu');
  const [showProModal, setShowProModal] = useState(false);
  const [questions,    setQuestions]    = useState([]);
  const [currentIdx,   setCurrentIdx]   = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [score,        setScore]        = useState(0);
  const [wrong,        setWrong]        = useState([]);
  const [mode,         setMode]         = useState('full'); // full | practice | mock | weak | review
  const [showExp,      setShowExp]      = useState(false);
  const [quizResults,  setQuizResults]  = useState([]);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [secondsLeft,  setSecondsLeft]  = useState(0);
  const [reportedIds,  setReportedIds]  = useState(new Set());
  const [quizHistory]                  = useState(() => loadQuizHistory());

  const [dueCardCount] = useState(() => getDueCards().filter(c => c.bank === 'part107').length);
  const [acsPerf]      = useState(() => loadAcsPerformance());

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    const timerActive = screen === 'quiz' && (mode === 'mock' || timerEnabled);
    if (!timerActive) return;
    if (secondsLeft <= 0) { setScreen('result'); return; }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [screen, timerEnabled, mode, secondsLeft]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'quiz') return;
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (selected === null) {
        if (e.key === 'a' || e.key === 'A') handleSelect(0);
        else if (e.key === 'b' || e.key === 'B') handleSelect(1);
        else if (e.key === 'c' || e.key === 'C') handleSelect(2);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ── Quiz control ─────────────────────────────────────────────────────────
  const startQuiz = (m) => {
    setMode(m);

    let bank;
    if (m === 'review') {
      const dueCards = getDueCards().filter(c => c.bank === 'part107');
      bank = part107Questions.filter(q => dueCards.some(c => c.questionId === q.id));
      if (bank.length === 0) { setScreen('menu'); return; }
    } else if (m === 'weak') {
      const perf = loadAcsPerformance();
      const weakAreas = getWeakAreas(perf);
      bank = weakAreas.length > 0
        ? part107Questions.filter(q => weakAreas.includes(getAcsArea(q.acsCode)))
        : part107Questions;
    } else {
      bank = part107Questions;
    }

    const sessionSize = m === 'practice' ? Math.min(10, bank.length)
      : m === 'mock' ? Math.min(40, bank.length)
      : bank.length;

    const qs = buildSession(bank, sessionSize);
    setQuestions(qs);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setWrong([]);
    setQuizResults([]);
    setShowExp(false);
    if (m === 'full' && timerEnabled) setSecondsLeft(FULL_TEST_SECONDS);
    if (m === 'mock') setSecondsLeft(FULL_TEST_SECONDS);
    setScreen('quiz');
  };

  const handleSelect = (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const q = questions[currentIdx];
    const isCorrect = q.options[optionIndex].correct;

    const newScore   = isCorrect ? score + 1 : score;
    const newWrong   = isCorrect ? wrong : [...wrong, q.id];
    const newResults = [...quizResults, { id: q.id, acsCode: q.acsCode, correct: isCorrect }];

    if (isCorrect) { setScore(newScore); } else { setWrong(newWrong); }
    setQuizResults(newResults);
    setShowExp(true);

    if (!isCorrect) {
      addWrongAnswer(q.id, 'part107');
    } else if (mode === 'review') {
      advanceInterval(q.id, 'part107');
    }

    if (currentIdx + 1 >= questions.length) {
      updateAcsPerformance(newResults, getAcsArea);
    }
  };

  const next = () => {
    if (currentIdx + 1 >= questions.length) {
      saveQuizResult(mode, score, questions.length);
      setScreen('result');
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setShowExp(false);
  };

  const q   = questions[currentIdx];
  const pct = calculatePct(score, questions.length);

  // ─── MENU ──────────────────────────────────────────────────────────────────
  if (screen === 'menu') {
    const part107AcsPerf = Object.fromEntries(
      Object.entries(acsPerf).filter(([key]) => key.startsWith('UA.'))
    );

    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', animation: 'fadeSlide 0.4s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: '#22d3ee', marginBottom: 8, opacity: 0.8 }}>
            ◈ FAA PART 107 KNOWLEDGE TEST ◈
          </div>
          <p style={{ color: '#6a8aa4', fontSize: 13, marginTop: 14, lineHeight: 1.7, maxWidth: 500, margin: '14px auto 0' }}>
            Practice with <strong style={{ color: '#0891b2' }}>{part107Questions.length} Part 107 (UAG) questions</strong> covering
            regulations, airspace, weather, sUAS loading, emergency procedures, and aeronautical decision-making.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              key: 'full',
              label: `FULL TEST — ${part107Questions.length} QUESTIONS`,
              desc: 'All Part 107 UAG questions, randomized. Covers every knowledge area on the FAA exam.',
              icon: '📋',
              color: '#22d3ee',
              proOnly: true,
            },
            {
              key: 'practice',
              label: 'QUICK PRACTICE — 10 QUESTIONS',
              desc: '10 randomly selected Part 107 questions for a focused study session.',
              icon: '⚡',
              color: '#34d399',
              proOnly: false,
            },
            {
              key: 'mock',
              label: 'MOCK FAA EXAM — 40 QUESTIONS',
              desc: 'Simulates the real Part 107 knowledge test: 40 questions, 2.5-hour timer, full topic breakdown.',
              icon: '🎓',
              color: '#f43f5e',
              proOnly: true,
            },
            {
              key: 'weak',
              label: 'WEAK AREAS DRILL',
              desc: Object.keys(part107AcsPerf).length === 0
                ? 'Complete a full test first to unlock adaptive drilling.'
                : `Focuses on your lowest-scoring UA topic areas. ${getWeakAreas(part107AcsPerf).length} weak area${getWeakAreas(part107AcsPerf).length !== 1 ? 's' : ''} identified.`,
              icon: '🎯',
              color: '#fb923c',
              proOnly: true,
            },
            {
              key: 'review',
              label: `SPACED REPETITION REVIEW${dueCardCount > 0 ? ` — ${dueCardCount} DUE` : ''}`,
              desc: dueCardCount > 0
                ? `${dueCardCount} question${dueCardCount !== 1 ? 's' : ''} due for review today.`
                : 'No cards due today. Wrong answers are automatically added to your review queue.',
              icon: '🔁',
              color: '#a78bfa',
              proOnly: true,
            },
          ].map(opt => {
            const locked = opt.proOnly && !pro && !proLoading;
            const handleClick = () => {
              if (proLoading) return;
              if (locked) { setShowProModal(true); return; }
              if (opt.key === 'review' && dueCardCount === 0) return;
              startQuiz(opt.key);
            };
            return (
              <button
                key={opt.key}
                onClick={handleClick}
                style={{
                  background: 'rgba(255,255,255,0.017)',
                  border: `1px solid ${opt.color}28`,
                  borderLeft: `3px solid ${opt.color}`,
                  borderRadius: 9, padding: '18px 22px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 17, textAlign: 'left',
                  transition: 'all 0.16s', color: '#e2e8f0',
                  fontFamily: "'Courier New',monospace", width: '100%', position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${opt.color}0d`;
                  e.currentTarget.style.borderColor = `${opt.color}55`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.017)';
                  e.currentTarget.style.borderColor = `${opt.color}28`;
                }}
              >
                <span style={{ fontSize: 28 }}>{opt.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, color: opt.color }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6a8aa4', marginTop: 3 }}>{opt.desc}</div>
                </div>
                {locked ? (
                  <span style={{
                    position: 'absolute', top: 8, right: 10,
                    fontSize: 9, letterSpacing: 1, color: '#22d3ee',
                    fontFamily: "'Courier New', monospace", fontWeight: 700,
                  }}>🔒 PRO</span>
                ) : (
                  <span style={{ color: `${opt.color}55`, fontSize: 20 }}>›</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress dashboard button */}
        {pro && (
          <button
            onClick={() => setScreen('progress')}
            style={{
              marginTop: 10, width: '100%', padding: '11px 18px',
              background: 'rgba(255,255,255,0.01)', border: '1px solid #0f2030',
              borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s',
              color: '#4a6a84', fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#6a8aa4'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; e.currentTarget.style.color = '#4a6a84'; }}
          >
            <span style={{ fontSize: 14 }}>📊</span>
            <span>PROGRESS DASHBOARD</span>
            <span style={{ marginLeft: 'auto', fontSize: 14 }}>›</span>
          </button>
        )}

        {/* FAA Exam Timer toggle */}
        <div
          onClick={() => proLoading ? null : (pro ? setTimerEnabled(t => !t) : setShowProModal(true))}
          style={{
            marginTop: 14, padding: '12px 18px',
            background: timerEnabled ? 'rgba(34,211,238,0.06)' : 'rgba(255,255,255,0.01)',
            border: `1px solid ${timerEnabled ? 'rgba(34,211,238,0.3)' : '#0f1d2c'}`,
            borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.18s', position: 'relative',
          }}
        >
          <div style={{
            width: 36, height: 20, borderRadius: 10, flexShrink: 0, position: 'relative',
            background: timerEnabled ? 'rgba(34,211,238,0.3)' : '#0d1a28',
            border: `1px solid ${timerEnabled ? '#22d3ee' : '#1a2436'}`, transition: 'all 0.2s',
          }}>
            <div style={{
              position: 'absolute', top: 3, left: timerEnabled ? 17 : 3,
              width: 12, height: 12, borderRadius: '50%',
              background: timerEnabled ? '#22d3ee' : '#3a5870', transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: 11, color: timerEnabled ? '#22d3ee' : '#4a6a84', letterSpacing: 1 }}>
            FAA EXAM TIMER (2:30:00) — FULL TEST ONLY
          </span>
          {!pro && (
            <span style={{
              position: 'absolute', top: 8, right: 10,
              fontSize: 9, letterSpacing: 1, color: '#22d3ee',
              fontFamily: "'Courier New', monospace", fontWeight: 700,
            }}>🔒 PRO</span>
          )}
        </div>

        {/* Stats strip */}
        <div style={{
          marginTop: 24, padding: '16px 20px', background: 'rgba(255,255,255,0.012)',
          border: '1px solid #0f1d2c', borderRadius: 9,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
        }}>
          {[
            { label: 'TOTAL QUESTIONS', val: part107Questions.length },
            { label: 'TOPIC AREAS',     val: new Set(part107Questions.map(q => getAcsArea(q.acsCode))).size },
            { label: 'ACS CODES',       val: new Set(part107Questions.map(q => q.acsCode)).size },
          ].map(({ label, val }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#22d3ee' }}>{val}</div>
              <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#4a6a84', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Recent score history */}
        {quizHistory.length > 0 && (
          <div style={{
            marginTop: 18, padding: '14px 18px',
            background: 'rgba(255,255,255,0.012)', border: '1px solid #0f1d2c', borderRadius: 9,
          }}>
            <div style={{ fontSize: 8, letterSpacing: 3, color: '#4a6a84', marginBottom: 10 }}>RECENT SESSIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {quizHistory.slice(0, 5).map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#22d3ee', letterSpacing: 0.5 }}>
                    {h.mode === 'full' ? 'Full Test' : h.mode === 'mock' ? 'Mock Exam' : 'Quick Practice'}
                  </span>
                  <span style={{ fontSize: 11, fontFamily: "'Courier New',monospace", color: h.pct >= 70 ? '#00ff88' : '#ef4444' }}>
                    {h.score}/{h.total} — {h.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 28, fontSize: 10, color: '#2a4464', letterSpacing: 3 }}>
          14 CFR PART 107 · REMOTE PILOT – SMALL UAS
        </div>

        {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
      </div>
    );
  }

  // ─── QUIZ ──────────────────────────────────────────────────────────────────
  if (screen === 'quiz' && q) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 60px', animation: 'fadeSlide 0.3s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <button
            onClick={() => setScreen('menu')}
            style={{
              background: 'none', border: '1px solid #1a2436', borderRadius: 6, color: '#6a8aa4',
              padding: '6px 13px', cursor: 'pointer', fontFamily: "'Courier New',monospace",
              fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
            }}
          >
            ← MENU
          </button>
          <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
            {(timerEnabled || mode === 'mock') && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 7.5, letterSpacing: 2.5, color: '#4a6a84', marginBottom: 2 }}>TIME LEFT</div>
                <div style={{
                  fontSize: 18, fontWeight: 900, lineHeight: 1.1, fontFamily: "'Courier New',monospace",
                  color: secondsLeft < 300 ? '#ef4444' : secondsLeft < 900 ? '#f59e0b' : '#f0f6ff',
                }}>
                  {formatTimer(secondsLeft)}
                </div>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 7.5, letterSpacing: 2.5, color: '#4a6a84', marginBottom: 2 }}>SCORE</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#f0f6ff', lineHeight: 1.1 }}>
                {score}/{currentIdx + (selected !== null ? 1 : 0)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 7.5, letterSpacing: 2.5, color: '#4a6a84', marginBottom: 2 }}>REMAINING</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#22d3ee', lineHeight: 1.1 }}>
                {questions.length - currentIdx - (selected !== null ? 1 : 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: '#22d3ee' }}>◈ PART 107 KNOWLEDGE</div>
          <div style={{ fontSize: 9, letterSpacing: 2, color: '#4a6a84' }}>Q {currentIdx + 1} / {questions.length}</div>
        </div>
        <div style={{ height: 2, background: '#0b1220', borderRadius: 2, marginBottom: 22, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2, background: '#22d3ee', transition: 'width 0.4s ease',
            width: `${((currentIdx + (selected !== null ? 1 : 0)) / questions.length) * 100}%`,
          }} />
        </div>

        {/* Question number tag */}
        <div style={{ marginBottom: 10 }}>
          <span style={{
            fontSize: 8.5, letterSpacing: 3, background: 'rgba(34,211,238,0.1)',
            border: '1px solid rgba(34,211,238,0.2)', borderRadius: 4, padding: '3px 8px', color: '#22d3ee',
          }}>
            QUESTION {currentIdx + 1}
          </span>
          {q.acsCode && (
            <span style={{
              fontSize: 8, letterSpacing: 2, color: '#4a6a84', marginLeft: 8,
              background: 'rgba(255,255,255,0.02)', border: '1px solid #0f1d2c',
              borderRadius: 4, padding: '3px 8px',
            }}>
              ACS: {q.acsCode}
            </span>
          )}
        </div>

        {/* Question text */}
        <div style={{
          background: 'rgba(34,211,238,0.028)', border: '1px solid rgba(34,211,238,0.12)',
          borderRadius: 10, padding: '18px 20px', marginBottom: 16,
        }}>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.8, color: '#d8e4f0', whiteSpace: 'pre-line' }}>
            {q.question}
          </p>
        </div>

        {/* Keyboard hint */}
        <div style={{ fontSize: 8, letterSpacing: 2, color: '#2a3a4a', marginBottom: 10, textAlign: 'right' }}>
          A / B / C to select · ENTER to continue
        </div>

        {/* Answer options */}
        <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#4a6a84', marginBottom: 10 }}>SELECT YOUR ANSWER:</div>
        {q.options.map((opt, i) => {
          let borderColor = 'rgba(255,255,255,0.09)';
          let bgColor     = 'rgba(255,255,255,0.024)';
          let textColor   = '#bccede';
          let indicator   = null;

          if (selected !== null) {
            if (opt.correct) {
              borderColor = '#00ff88'; bgColor = 'rgba(0,255,136,0.065)'; textColor = '#00ff88';
              indicator = <span style={{ float: 'right', fontSize: 10, letterSpacing: 1, color: '#00ff88' }}>✓ CORRECT</span>;
            } else if (i === selected) {
              borderColor = '#ef4444'; bgColor = 'rgba(239,68,68,0.065)'; textColor = '#ef4444';
              indicator = <span style={{ float: 'right', fontSize: 10, letterSpacing: 1, color: '#ef4444' }}>✗ INCORRECT</span>;
            } else {
              textColor = '#3a5870';
            }
          }

          return (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => handleSelect(i)}
              style={{
                display: 'block', width: '100%', background: bgColor, border: `1px solid ${borderColor}`,
                borderRadius: 8, padding: '13px 16px', cursor: selected !== null ? 'default' : 'pointer',
                textAlign: 'left', color: textColor, fontFamily: "'Courier New',monospace",
                fontSize: 13.5, lineHeight: 1.55, transition: 'all 0.13s', marginBottom: 8,
              }}
              onMouseEnter={e => { if (selected === null) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; } }}
              onMouseLeave={e => { if (selected === null) { e.currentTarget.style.background = bgColor; e.currentTarget.style.borderColor = borderColor; } }}
            >
              <span style={{ color: '#4a6a84', marginRight: 10, fontWeight: 700 }}>{opt.letter}.</span>
              {opt.text}
              {indicator}
            </button>
          );
        })}

        {/* Explanation panel */}
        {showExp && (
          <div style={{
            background: selected !== null && questions[currentIdx].options[selected].correct
              ? 'rgba(0,255,136,0.04)' : 'rgba(239,68,68,0.04)',
            border: `1px solid ${selected !== null && questions[currentIdx].options[selected].correct
              ? 'rgba(0,255,136,0.15)' : 'rgba(239,68,68,0.15)'}`,
            borderRadius: 8, padding: '14px 17px', marginTop: 4, marginBottom: 20, animation: 'popIn 0.22s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 8, letterSpacing: 3, color: '#4a6a84' }}>
                {selected !== null && questions[currentIdx].options[selected].correct ? '✓ WELL DONE — ' : '✗ EXPLANATION — '}
                WHY THIS ANSWER:
              </div>
              <button
                onClick={() => {
                  const text = `Q${q.id} (${q.acsCode}): ${q.question}`;
                  navigator.clipboard.writeText(text).catch(() => {});
                  setReportedIds(prev => new Set([...prev, q.id]));
                }}
                style={{
                  background: 'none',
                  border: `1px solid ${reportedIds.has(q.id) ? '#4a6a84' : '#1a2436'}`,
                  borderRadius: 4, color: reportedIds.has(q.id) ? '#4a6a84' : '#3a5870',
                  padding: '3px 8px', cursor: 'pointer',
                  fontFamily: "'Courier New',monospace", fontSize: 8, letterSpacing: 1,
                  flexShrink: 0, marginLeft: 8,
                }}
                title="Copy question ID to clipboard to report an issue"
              >
                {reportedIds.has(q.id) ? '✓ COPIED' : '⚑ REPORT'}
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: '#7a9ab4', lineHeight: 1.76 }}>
              {q.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {selected !== null && (
          <div style={{ textAlign: 'right', marginTop: 4 }}>
            <button
              onClick={next}
              style={{
                background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.36)', color: '#22d3ee',
                padding: '10px 26px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Courier New',monospace",
                fontSize: 12.5, letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.08)'; }}
            >
              {currentIdx + 1 >= questions.length ? 'VIEW RESULTS' : 'NEXT QUESTION →'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── RESULTS ───────────────────────────────────────────────────────────────
  if (screen === 'result') {
    const badge      = getPerformanceBadge(pct);
    const passing    = isPassing(pct);
    const acsBreakdown = quizResults.length > 0 ? groupByAcsArea(quizResults) : null;

    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 22px', textAlign: 'center', animation: 'fadeSlide 0.4s ease' }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: '#4a6a84', marginBottom: 18 }}>TEST COMPLETE</div>
        <div style={{ fontSize: 62, marginBottom: 10 }}>{badge.icon}</div>
        <div style={{ fontSize: 11, letterSpacing: 4, color: badge.color, marginBottom: 8 }}>{badge.label}</div>
        <h2 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 4px', color: '#f0f6ff', lineHeight: 1 }}>{pct}%</h2>
        <p style={{ color: '#6a8aa4', fontSize: 13.5, margin: '6px 0 28px' }}>
          {score} correct out of {questions.length} questions
        </p>

        {/* Score breakdown */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28,
          padding: '20px', background: 'rgba(255,255,255,0.015)', border: '1px solid #111c2a', borderRadius: 12,
        }}>
          {[
            { label: 'CORRECT',   val: score,                    col: '#00ff88' },
            { label: 'INCORRECT', val: questions.length - score, col: '#ef4444' },
            { label: 'ACCURACY',  val: `${pct}%`,                col: badge.color },
          ].map(({ label, val, col }) => (
            <div key={label}>
              <div style={{ fontSize: 28, fontWeight: 900, color: col }}>{val}</div>
              <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#4a6a84', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Pass/fail indicator */}
        <div style={{
          padding: '14px 20px', borderRadius: 8, marginBottom: 28,
          background: passing ? 'rgba(0,255,136,0.04)' : 'rgba(239,68,68,0.04)',
          border: `1px solid ${passing ? 'rgba(0,255,136,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: passing ? '#00ff88' : '#ef4444', marginBottom: 4 }}>
            {passing ? '✓ PASSING SCORE' : '✗ BELOW PASSING THRESHOLD'}
          </div>
          <div style={{ fontSize: 11.5, color: '#6a8aa4', lineHeight: 1.6 }}>
            {passing
              ? 'You meet the FAA minimum passing score of 70%. You\'re on track to pass the Part 107 exam.'
              : 'The FAA requires a minimum score of 70%. Review missed questions and use the Weak Areas Drill.'}
          </div>
        </div>

        {/* ACS breakdown */}
        {acsBreakdown && acsBreakdown.length > 0 && (
          <div style={{
            padding: '16px 20px', borderRadius: 10, marginBottom: 12, textAlign: 'left',
            background: 'rgba(255,255,255,0.012)', border: '1px solid #0f1d2c',
          }}>
            <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#5a7a94', marginBottom: 14 }}>
              PERFORMANCE BY TOPIC AREA
            </div>
            {acsBreakdown.map(({ area, name, correct, total, pct: areaPct }) => (
              <div key={area} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#8aabe0' }}>{name}</span>
                  <span style={{
                    fontSize: 10, fontFamily: "'Courier New',monospace",
                    color: areaPct >= 70 ? '#00ff88' : '#ef4444',
                  }}>
                    {correct}/{total} ({areaPct}%)
                  </span>
                </div>
                <div style={{ height: 3, background: '#0b1220', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2, transition: 'width 0.6s ease',
                    background: areaPct >= 70 ? '#00ff88' : areaPct >= 50 ? '#f59e0b' : '#ef4444',
                    width: `${areaPct}%`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Missed questions */}
        {wrong.length > 0 && (
          <div style={{
            padding: '12px 16px', borderRadius: 8, marginBottom: 24, textAlign: 'left',
            background: 'rgba(255,255,255,0.012)', border: '1px solid #0f1d2c',
          }}>
            <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#5a7a94', marginBottom: 8 }}>MISSED QUESTIONS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {wrong.map(id => (
                <span key={id} style={{
                  fontSize: 10, padding: '3px 8px', background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, color: '#ef4444',
                }}>
                  Q{id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => startQuiz(mode)}
            style={{
              background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.36)', color: '#22d3ee',
              padding: '10px 22px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Courier New',monospace",
              fontSize: 12.5, letterSpacing: 1, textTransform: 'uppercase',
            }}
          >
            RETAKE TEST
          </button>
          <button
            onClick={() => setScreen('menu')}
            style={{
              background: 'none', border: '1px solid #1a2436', borderRadius: 6, color: '#6a8aa4',
              padding: '10px 20px', cursor: 'pointer', fontFamily: "'Courier New',monospace",
              fontSize: 12, textTransform: 'uppercase', letterSpacing: 1,
            }}
          >
            BACK TO MENU
          </button>
        </div>
      </div>
    );
  }

  // ─── PROGRESS DASHBOARD ────────────────────────────────────────────────────
  if (screen === 'progress') {
    const part107AcsPerf = Object.fromEntries(
      Object.entries(acsPerf).filter(([key]) => key.startsWith('UA.'))
    );
    const mastery = getAcsMasteryList(part107AcsPerf, ACS_AREA_NAMES);
    const totalAnswered = mastery.reduce((s, a) => s + a.total, 0);
    const totalCorrect  = mastery.reduce((s, a) => s + a.correct, 0);
    const overallPct    = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;

    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 22px', animation: 'fadeSlide 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <button
            onClick={() => setScreen('menu')}
            style={{
              background: 'none', border: '1px solid #1a2436', borderRadius: 6, color: '#6a8aa4',
              padding: '6px 13px', cursor: 'pointer', fontFamily: "'Courier New',monospace",
              fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
            }}
          >
            ← MENU
          </button>
          <div style={{ fontSize: 9, letterSpacing: 5, color: '#22d3ee' }}>◈ PART 107 PROGRESS</div>
        </div>

        {mastery.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4a6a84', fontFamily: "'Courier New',monospace", fontSize: 12 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
            <div style={{ letterSpacing: 2 }}>NO DATA YET</div>
            <div style={{ marginTop: 10, fontSize: 11, color: '#2a4464' }}>Complete a quiz to start tracking your progress.</div>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28,
              padding: '18px', background: 'rgba(255,255,255,0.015)', border: '1px solid #111c2a', borderRadius: 12,
            }}>
              {[
                { label: 'QUESTIONS ANSWERED', val: totalAnswered, col: '#94a3b8' },
                { label: 'CORRECT',            val: totalCorrect,  col: '#00ff88' },
                { label: 'OVERALL MASTERY',    val: overallPct !== null ? `${overallPct}%` : '—', col: overallPct >= 70 ? '#00ff88' : '#f59e0b' },
              ].map(({ label, val, col }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: col }}>{val}</div>
                  <div style={{ fontSize: 7.5, letterSpacing: 2, color: '#4a6a84', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '18px 20px', borderRadius: 10, marginBottom: 20, background: 'rgba(255,255,255,0.012)', border: '1px solid #0f1d2c' }}>
              <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#5a7a94', marginBottom: 16 }}>MASTERY BY TOPIC AREA</div>
              {mastery.map(({ area, name, correct, total, pct: areaPct }) => (
                <div key={area} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11.5, color: '#8aabe0' }}>{name}</span>
                    <span style={{
                      fontSize: 10, fontFamily: "'Courier New',monospace",
                      color: areaPct >= 70 ? '#00ff88' : areaPct >= 50 ? '#f59e0b' : '#ef4444',
                    }}>
                      {correct}/{total} ({areaPct}%)
                    </span>
                  </div>
                  <div style={{ height: 4, background: '#0b1220', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2, transition: 'width 0.7s ease',
                      background: areaPct >= 70 ? '#00ff88' : areaPct >= 50 ? '#f59e0b' : '#ef4444',
                      width: `${areaPct}%`,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {getWeakAreas(part107AcsPerf).length > 0 && (
              <button
                onClick={() => startQuiz('weak')}
                style={{
                  width: '100%', padding: '12px 16px', marginBottom: 12,
                  background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.3)',
                  borderRadius: 8, cursor: 'pointer',
                  color: '#fb923c', fontFamily: "'Courier New',monospace",
                  fontSize: 12, letterSpacing: 1, textAlign: 'center',
                }}
              >
                DRILL WEAK AREAS ({getWeakAreas(part107AcsPerf).length} area{getWeakAreas(part107AcsPerf).length !== 1 ? 's' : ''} below 70%)
              </button>
            )}

            <div style={{
              padding: '12px 16px', borderRadius: 8,
              background: 'rgba(255,255,255,0.01)', border: '1px solid #0f1d2c',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: 2, color: '#4a6a84', marginBottom: 3 }}>REVIEW QUEUE</div>
                <div style={{ fontSize: 11, color: '#6a8aa4' }}>
                  {getTotalCardCount()} card{getTotalCardCount() !== 1 ? 's' : ''} scheduled · {dueCardCount} due today
                </div>
              </div>
              {dueCardCount > 0 && (
                <button
                  onClick={() => startQuiz('review')}
                  style={{
                    background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)',
                    borderRadius: 6, color: '#a78bfa', padding: '7px 14px', cursor: 'pointer',
                    fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: 1,
                  }}
                >
                  REVIEW NOW
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}

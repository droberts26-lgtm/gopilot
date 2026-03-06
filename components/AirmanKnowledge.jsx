'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { parQuestions, figurePdfPages } from '@/data/parQuestions';
import { buildSession, calculatePct, isPassing, getPerformanceBadge } from '@/lib/quiz';
import { groupByAcsArea } from '@/lib/acsAreas';
import LearnMode from './LearnMode';
import MatchingMode from './MatchingMode';

// Load PDF viewer client-side only
const PdfFigure = dynamic(() => import('./PdfFigure'), { ssr: false });

const FULL_TEST_SECONDS = 9000; // 2 hours 30 minutes — matches FAA exam

/** Formats seconds as M:SS or H:MM:SS */
function formatTimer(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function AirmanKnowledge() {
  const [screen,        setScreen]        = useState('menu'); // menu | quiz | result | learn | match
  const [questions,     setQuestions]     = useState([]);
  const [currentIdx,    setCurrentIdx]    = useState(0);
  const [selected,      setSelected]      = useState(null);    // index of selected option
  const [score,         setScore]         = useState(0);
  const [wrong,         setWrong]         = useState([]);      // ids of wrong answers
  const [mode,          setMode]          = useState('full'); // full | practice
  const [showExp,       setShowExp]       = useState(false);
  const [quizResults,   setQuizResults]   = useState([]);     // [{id, acsCode, correct}] for breakdown
  const [timerEnabled,  setTimerEnabled]  = useState(false);
  const [secondsLeft,   setSecondsLeft]   = useState(0);
  const [searchQuery,   setSearchQuery]   = useState('');

  // ── Computed: filtered question bank ──────────────────────────────────
  const filteredQuestions = searchQuery.trim()
    ? parQuestions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.acsCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : parQuestions;

  // ── Countdown timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'quiz' || !timerEnabled) return;
    if (secondsLeft <= 0) {
      setScreen('result');
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [screen, timerEnabled, secondsLeft]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────
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

  // ── Quiz control ───────────────────────────────────────────────────────
  const startQuiz = (m, questionBank = null) => {
    setMode(m);
    const bank = questionBank ?? (searchQuery.trim() ? filteredQuestions : parQuestions);
    const sessionSize = m === 'practice' ? Math.min(10, bank.length) : bank.length;
    setQuestions(buildSession(bank, sessionSize));
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setWrong([]);
    setQuizResults([]);
    setShowExp(false);
    if (m === 'full' && timerEnabled) {
      setSecondsLeft(FULL_TEST_SECONDS);
    }
    setScreen('quiz');
  };

  const handleSelect = (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const q = questions[currentIdx];
    const isCorrect = q.options[optionIndex].correct;
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      setWrong(w => [...w, q.id]);
    }
    setQuizResults(r => [...r, { id: q.id, acsCode: q.acsCode, correct: isCorrect }]);
    setShowExp(true);
  };

  const next = () => {
    if (currentIdx + 1 >= questions.length) {
      setScreen('result');
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setShowExp(false);
  };

  const q   = questions[currentIdx];
  const pct = calculatePct(score, questions.length);

  const getFigurePages = (figNums) => figNums.map(n => figurePdfPages[n]).filter(Boolean);

  // ─── MENU ──────────────────────────────────────────────────────────────────
  if (screen === 'menu') {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', animation: 'fadeSlide 0.4s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: '#f59e0b', marginBottom: 8, opacity: 0.8 }}>
            ◈ FAA PRIVATE PILOT KNOWLEDGE TEST ◈
          </div>
          <p style={{ color: '#6a8aa4', fontSize: 13, marginTop: 14, lineHeight: 1.7, maxWidth: 500, margin: '14px auto 0' }}>
            Practice with all <strong style={{ color: '#b45309' }}>131 official PAR questions</strong> from the FAA knowledge test bank.
            Questions referencing figures will display the actual{' '}
            <strong style={{ color: '#b45309' }}>FAA-CT-8080-2H</strong> supplement image.
            Wrong answers include a full explanation.
          </p>
        </div>

        {/* Mode buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              key: 'full',
              label: 'FULL TEST — 131 QUESTIONS',
              desc: 'All PAR exam questions, randomized. Mirrors the actual FAA knowledge test format.',
              icon: '📋',
              color: '#f59e0b',
            },
            {
              key: 'practice',
              label: 'QUICK PRACTICE — 10 QUESTIONS',
              desc: '10 randomly selected questions for a focused study session.',
              icon: '⚡',
              color: '#34d399',
            },
            {
              key: 'learn',
              label: 'LEARN MODE — 131 QUESTIONS',
              desc: 'Mastery-based: every question must be answered correctly 3× before it\'s done. Wrong answers recycle to the front.',
              icon: '🧠',
              color: '#a78bfa',
            },
            {
              key: 'match',
              label: 'MATCHING — 18 SETS',
              desc: 'Match aviation terms to their definitions. 6 categories, 144 pairs total.',
              icon: '🔗',
              color: '#06b6d4',
            },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => (opt.key === 'learn' || opt.key === 'match') ? setScreen(opt.key === 'learn' ? 'learn' : 'match') : startQuiz(opt.key)}
              style={{
                background: 'rgba(255,255,255,0.017)',
                border: `1px solid ${opt.color}28`,
                borderLeft: `3px solid ${opt.color}`,
                borderRadius: 9,
                padding: '18px 22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 17,
                textAlign: 'left',
                transition: 'all 0.16s',
                color: '#e2e8f0',
                fontFamily: "'Courier New',monospace",
                width: '100%',
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
              <span style={{ color: `${opt.color}55`, fontSize: 20 }}>›</span>
            </button>
          ))}
        </div>

        {/* FAA Exam Timer toggle */}
        <div
          onClick={() => setTimerEnabled(t => !t)}
          style={{
            marginTop: 14, padding: '12px 18px',
            background: timerEnabled ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.01)',
            border: `1px solid ${timerEnabled ? 'rgba(245,158,11,0.3)' : '#0f1d2c'}`,
            borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 12,
            transition: 'all 0.18s',
          }}
        >
          {/* Toggle pill */}
          <div style={{
            width: 36, height: 20, borderRadius: 10, flexShrink: 0, position: 'relative',
            background: timerEnabled ? 'rgba(245,158,11,0.3)' : '#0d1a28',
            border: `1px solid ${timerEnabled ? '#f59e0b' : '#1a2436'}`,
            transition: 'all 0.2s',
          }}>
            <div style={{
              position: 'absolute', top: 3, left: timerEnabled ? 17 : 3,
              width: 12, height: 12, borderRadius: '50%',
              background: timerEnabled ? '#f59e0b' : '#3a5870',
              transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: 11, color: timerEnabled ? '#f59e0b' : '#4a6a84', letterSpacing: 1 }}>
            FAA EXAM TIMER (2:30:00) — FULL TEST ONLY
          </span>
        </div>

        {/* Stats strip */}
        <div style={{
          marginTop: 24, padding: '16px 20px', background: 'rgba(255,255,255,0.012)',
          border: '1px solid #0f1d2c', borderRadius: 9,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
        }}>
          {[
            { label: 'TOTAL QUESTIONS', val: parQuestions.length },
            { label: 'WITH FIGURES',    val: parQuestions.filter(q => q.figures.length > 0).length },
            { label: 'ACS CODES',       val: new Set(parQuestions.map(q => q.acsCode)).size },
          ].map(({ label, val }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>{val}</div>
              <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#4a6a84', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Search / filter */}
        <div style={{ marginTop: 18 }}>
          <input
            type="text"
            placeholder="Search by keyword or ACS code…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.02)',
              border: '1px solid #1a2436', borderRadius: 7,
              color: '#c0d4e8', fontFamily: "'Courier New',monospace",
              fontSize: 12, padding: '10px 14px', boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          {searchQuery.trim() && (
            <div style={{ marginTop: 6, fontSize: 10, letterSpacing: 1.5 }}>
              <span style={{ color: filteredQuestions.length > 0 ? '#f59e0b' : '#ef4444' }}>
                {filteredQuestions.length} MATCHING QUESTION{filteredQuestions.length !== 1 ? 'S' : ''} FOUND
              </span>
              {filteredQuestions.length > 0 && (
                <span style={{ color: '#4a6a84', marginLeft: 8 }}>
                  — buttons above will use this filtered set
                </span>
              )}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 28, fontSize: 10, color: '#2a4464', letterSpacing: 3 }}>
          FAA-CT-8080-2H SUPPLEMENT · PRIVATE PILOT ACS
        </div>
      </div>
    );
  }

  // ─── QUIZ ──────────────────────────────────────────────────────────────────
  if (screen === 'quiz' && q) {
    const figPages = getFigurePages(q.figures);

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
            {timerEnabled && (
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
              <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', lineHeight: 1.1 }}>
                {questions.length - currentIdx - (selected !== null ? 1 : 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: '#f59e0b' }}>◈ AIRMAN KNOWLEDGE</div>
          <div style={{ fontSize: 9, letterSpacing: 2, color: '#4a6a84' }}>Q {currentIdx + 1} / {questions.length}</div>
        </div>
        <div style={{ height: 2, background: '#0b1220', borderRadius: 2, marginBottom: 22, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2, background: '#f59e0b', transition: 'width 0.4s ease',
            width: `${((currentIdx + (selected !== null ? 1 : 0)) / questions.length) * 100}%`,
          }} />
        </div>

        {/* Question number tag */}
        <div style={{ marginBottom: 10 }}>
          <span style={{
            fontSize: 8.5, letterSpacing: 3, background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.2)', borderRadius: 4, padding: '3px 8px', color: '#f59e0b',
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
          background: 'rgba(245,158,11,0.028)', border: '1px solid rgba(245,158,11,0.12)',
          borderRadius: 10, padding: '18px 20px', marginBottom: 16,
        }}>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.8, color: '#d8e4f0', whiteSpace: 'pre-line' }}>
            {q.question}
          </p>
        </div>

        {/* Figure viewer (if applicable) */}
        {q.figures.length > 0 && figPages.length > 0 && (
          <PdfFigure
            pageNumber={figPages}
            figureNumbers={q.figures}
            note={q.figures.length > 1 ? 'Multiple figures — expand to view' : undefined}
          />
        )}

        {/* Keyboard hint */}
        <div style={{ fontSize: 8, letterSpacing: 2, color: '#2a3a4a', marginBottom: 10, textAlign: 'right' }}>
          A / B / C to select · ENTER to continue
        </div>

        {/* Answer options */}
        <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#4a6a84', marginBottom: 10 }}>
          SELECT YOUR ANSWER:
        </div>
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
            <div style={{ fontSize: 8, letterSpacing: 3, color: '#4a6a84', marginBottom: 8 }}>
              {selected !== null && questions[currentIdx].options[selected].correct ? '✓ WELL DONE — ' : '✗ EXPLANATION — '}
              WHY THIS ANSWER:
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
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.36)', color: '#f59e0b',
                padding: '10px 26px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Courier New',monospace",
                fontSize: 12.5, letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.08)'; }}
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
    const badge   = getPerformanceBadge(pct);
    const passing = isPassing(pct);
    const acsBreakdown = mode === 'full' && quizResults.length > 0
      ? groupByAcsArea(quizResults)
      : null;

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
            { label: 'CORRECT',   val: score,                        col: '#00ff88' },
            { label: 'INCORRECT', val: questions.length - score,     col: '#ef4444' },
            { label: 'ACCURACY',  val: `${pct}%`,                    col: badge.color },
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
              ? 'You meet the FAA minimum passing score of 70%. Consider a review of any missed topics before your official test.'
              : 'The FAA requires a minimum score of 70% on the knowledge test. Review the explanation for each missed question and retake the test.'}
          </div>
        </div>

        {/* ACS weak-area breakdown (full test only) */}
        {acsBreakdown && acsBreakdown.length > 0 && (
          <div style={{
            padding: '16px 20px', borderRadius: 10, marginBottom: 24, textAlign: 'left',
            background: 'rgba(255,255,255,0.012)', border: '1px solid #0f1d2c',
          }}>
            <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#5a7a94', marginBottom: 14 }}>
              PERFORMANCE BY ACS TOPIC AREA
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
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.36)', color: '#f59e0b',
              padding: '10px 22px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Courier New',monospace",
              fontSize: 12.5, letterSpacing: 1, textTransform: 'uppercase',
            }}
          >
            RETAKE TEST
          </button>
          {wrong.length > 0 && (
            <button
              onClick={() => {
                const wrongQs = parQuestions.filter(q => wrong.includes(q.id));
                startQuiz('full', wrongQs);
              }}
              style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.36)', color: '#ef4444',
                padding: '10px 22px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Courier New',monospace",
                fontSize: 12.5, letterSpacing: 1, textTransform: 'uppercase',
              }}
            >
              REVIEW MISSED ({wrong.length})
            </button>
          )}
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

  // ─── LEARN MODE ────────────────────────────────────────────────────────────
  if (screen === 'learn') {
    return <LearnMode onBack={() => setScreen('menu')} />;
  }

  // ─── MATCHING MODE ──────────────────────────────────────────────────────────
  if (screen === 'match') {
    return <MatchingMode onBack={() => setScreen('menu')} />;
  }

  return null;
}

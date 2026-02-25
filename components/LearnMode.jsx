'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { parQuestions, figurePdfPages } from '@/data/parQuestions';
import {
  MASTERY_THRESHOLD,
  initLearnSession,
  processAnswer,
  getCurrentQuestionId,
  isLearnSessionComplete,
  getLearnStats,
} from '@/lib/learn';

const PdfFigure = dynamic(() => import('./PdfFigure'), { ssr: false });

const PURPLE = '#a78bfa';

/** Format elapsed milliseconds as m:ss */
function formatElapsed(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

/**
 * Mastery-based learn mode. Every question must be answered correctly
 * MASTERY_THRESHOLD times before it's mastered. Wrong answers recycle
 * the question toward the front of the queue.
 *
 * @param {{ onBack: () => void }} props
 */
export default function LearnMode({ onBack }) {
  const [session, setSession] = useState(() => initLearnSession(parQuestions));
  const [screen, setScreen] = useState('learn'); // 'learn' | 'complete'
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [startTime] = useState(Date.now());
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  // ── Derived values ──────────────────────────────────────────────────────────
  const currentId = getCurrentQuestionId(session);
  const currentQ = parQuestions.find(q => q.id === currentId);
  const stats = getLearnStats(session);
  const currentEntry = currentId != null ? session.masteryMap[currentId] : null;

  const getFigurePages = (figNums) => figNums.map(n => figurePdfPages[n]).filter(Boolean);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSelect = (optionIdx) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(optionIdx);
    const isCorrect = currentQ.options[optionIdx].correct;
    setTotalAnswered(n => n + 1);
    if (isCorrect) setTotalCorrect(n => n + 1);
  };

  const handleContinue = () => {
    if (selectedIdx === null || !currentQ) return;
    const isCorrect = currentQ.options[selectedIdx].correct;
    const nextSession = processAnswer(session, currentId, isCorrect);
    setSession(nextSession);
    setSelectedIdx(null);
    if (isLearnSessionComplete(nextSession)) {
      setScreen('complete');
    }
  };

  const handleRestart = () => {
    setSession(initLearnSession(parQuestions));
    setSelectedIdx(null);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setScreen('learn');
  };

  // ── Complete screen ─────────────────────────────────────────────────────────
  if (screen === 'complete') {
    const elapsed = Date.now() - startTime;
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return (
      <div style={{
        maxWidth: 600, margin: '0 auto', padding: '48px 22px',
        textAlign: 'center', animation: 'fadeSlide 0.4s ease',
      }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: '#4c3d7a', marginBottom: 16 }}>
          LEARN MODE COMPLETE
        </div>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎓</div>
        <h2 style={{
          fontSize: 22, fontWeight: 900, letterSpacing: 3,
          color: PURPLE, margin: '0 0 6px',
        }}>
          ALL TOPICS MASTERED
        </h2>
        <p style={{ color: '#4a3a6a', fontSize: 13, margin: '0 0 32px' }}>
          You answered correctly {MASTERY_THRESHOLD}× on every one of the 61 questions.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32,
          padding: '20px', background: 'rgba(167,139,250,0.04)',
          border: '1px solid rgba(167,139,250,0.18)', borderRadius: 12,
        }}>
          {[
            { label: 'TOTAL ANSWERED', val: totalAnswered, col: PURPLE },
            { label: 'ACCURACY', val: `${accuracy}%`, col: '#34d399' },
            { label: 'TIME', val: formatElapsed(elapsed), col: '#60a5fa' },
          ].map(({ label, val, col }) => (
            <div key={label}>
              <div style={{ fontSize: 26, fontWeight: 900, color: col }}>{val}</div>
              <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#3a2e52', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleRestart}
            style={{
              background: `rgba(167,139,250,0.08)`, border: `1px solid rgba(167,139,250,0.36)`,
              color: PURPLE, padding: '10px 22px', borderRadius: 6, cursor: 'pointer',
              fontFamily: "'Courier New',monospace", fontSize: 12.5,
              letterSpacing: 1, textTransform: 'uppercase',
            }}
          >
            RESTART LEARN MODE
          </button>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: '1px solid #1a2436', borderRadius: 6,
              color: '#3d5068', padding: '10px 20px', cursor: 'pointer',
              fontFamily: "'Courier New',monospace", fontSize: 12, textTransform: 'uppercase', letterSpacing: 1,
            }}
          >
            BACK TO MENU
          </button>
        </div>
      </div>
    );
  }

  // ── Learn screen ────────────────────────────────────────────────────────────
  if (!currentQ || !currentEntry) return null;

  const figPages = getFigurePages(currentQ.figures);
  const isAnswered = selectedIdx !== null;
  const wasCorrect = isAnswered && currentQ.options[selectedIdx].correct;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 60px', animation: 'fadeSlide 0.3s ease' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: '1px solid #1a2436', borderRadius: 6, color: '#3d5068',
            padding: '6px 13px', cursor: 'pointer', fontFamily: "'Courier New',monospace",
            fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
          }}
        >
          ← MENU
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 7.5, letterSpacing: 2.5, color: '#3a2e52', marginBottom: 2 }}>MASTERED</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: PURPLE, lineHeight: 1.1 }}>
            {stats.mastered} / {stats.total}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: PURPLE }}>◈ LEARN MODE</div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: '#2d2240' }}>
          {stats.mastered} mastered · {stats.learning} in progress · {stats.notSeen} not seen
        </div>
      </div>
      <div style={{ height: 3, background: '#0b1220', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2, background: PURPLE, transition: 'width 0.4s ease',
          width: `${(stats.mastered / stats.total) * 100}%`,
        }} />
      </div>

      {/* Streak dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <span style={{ fontSize: 8, letterSpacing: 2.5, color: '#2d2240', marginRight: 4 }}>STREAK</span>
        {Array.from({ length: MASTERY_THRESHOLD }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: 14,
              color: i < currentEntry.correctStreak ? '#a78bfa' : '#1e1530',
            }}
          >
            ●
          </span>
        ))}
        <span style={{ fontSize: 8.5, color: '#2d2240', marginLeft: 4 }}>
          {currentEntry.correctStreak}/{MASTERY_THRESHOLD}
        </span>
      </div>

      {/* Question number tag + ACS code */}
      <div style={{ marginBottom: 10 }}>
        <span style={{
          fontSize: 8.5, letterSpacing: 3, background: 'rgba(167,139,250,0.08)',
          border: '1px solid rgba(167,139,250,0.2)', borderRadius: 4, padding: '3px 8px', color: PURPLE,
        }}>
          QUESTION {currentId}
        </span>
        {currentQ.acsCode && (
          <span style={{
            fontSize: 8, letterSpacing: 2, color: '#182230', marginLeft: 8,
            background: 'rgba(255,255,255,0.02)', border: '1px solid #0f1d2c',
            borderRadius: 4, padding: '3px 8px',
          }}>
            ACS: {currentQ.acsCode}
          </span>
        )}
      </div>

      {/* Question text */}
      <div style={{
        background: 'rgba(167,139,250,0.028)', border: '1px solid rgba(167,139,250,0.12)',
        borderRadius: 10, padding: '18px 20px', marginBottom: 16,
      }}>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.8, color: '#d8e4f0', whiteSpace: 'pre-line' }}>
          {currentQ.question}
        </p>
      </div>

      {/* PDF figure (if applicable) */}
      {currentQ.figures.length > 0 && figPages.length > 0 && (
        <PdfFigure
          pageNumber={figPages}
          figureNumbers={currentQ.figures}
          note={currentQ.figures.length > 1 ? 'Multiple figures — expand to view' : undefined}
        />
      )}

      {/* Answer options */}
      <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#182230', marginBottom: 10 }}>
        SELECT YOUR ANSWER:
      </div>
      {currentQ.options.map((opt, i) => {
        let borderColor = 'rgba(255,255,255,0.09)';
        let bgColor     = 'rgba(255,255,255,0.024)';
        let textColor   = '#bccede';
        let indicator   = null;

        if (isAnswered) {
          if (opt.correct) {
            borderColor = '#00ff88'; bgColor = 'rgba(0,255,136,0.065)'; textColor = '#00ff88';
            indicator = <span style={{ float: 'right', fontSize: 10, letterSpacing: 1, color: '#00ff88' }}>✓ CORRECT</span>;
          } else if (i === selectedIdx) {
            borderColor = '#ef4444'; bgColor = 'rgba(239,68,68,0.065)'; textColor = '#ef4444';
            indicator = <span style={{ float: 'right', fontSize: 10, letterSpacing: 1, color: '#ef4444' }}>✗ INCORRECT</span>;
          } else {
            textColor = '#1e2e3e';
          }
        }

        return (
          <button
            key={i}
            disabled={isAnswered}
            onClick={() => handleSelect(i)}
            style={{
              display: 'block', width: '100%', background: bgColor, border: `1px solid ${borderColor}`,
              borderRadius: 8, padding: '13px 16px', cursor: isAnswered ? 'default' : 'pointer',
              textAlign: 'left', color: textColor, fontFamily: "'Courier New',monospace",
              fontSize: 13.5, lineHeight: 1.55, transition: 'all 0.13s', marginBottom: 8,
            }}
            onMouseEnter={e => { if (!isAnswered) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; } }}
            onMouseLeave={e => { if (!isAnswered) { e.currentTarget.style.background = bgColor; e.currentTarget.style.borderColor = borderColor; } }}
          >
            <span style={{ color: '#2a3d50', marginRight: 10, fontWeight: 700 }}>{opt.letter}.</span>
            {opt.text}
            {indicator}
          </button>
        );
      })}

      {/* Feedback panel */}
      {isAnswered && (
        <div style={{
          background: wasCorrect ? 'rgba(0,255,136,0.04)' : 'rgba(239,68,68,0.04)',
          border: `1px solid ${wasCorrect ? 'rgba(0,255,136,0.15)' : 'rgba(239,68,68,0.15)'}`,
          borderRadius: 8, padding: '14px 17px', marginTop: 4, marginBottom: 20,
          animation: 'popIn 0.22s ease',
        }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: '#182230', marginBottom: 8 }}>
            {wasCorrect ? '✓ WELL DONE — ' : '✗ INCORRECT — '}EXPLANATION:
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: '#4a6480', lineHeight: 1.76 }}>
            {currentQ.explanation}
          </p>
          {!wasCorrect && (
            <p style={{ margin: '8px 0 0', fontSize: 11, color: '#3a2e52', letterSpacing: 0.5 }}>
              This question will return soon — keep going.
            </p>
          )}
        </div>
      )}

      {/* Continue button */}
      {isAnswered && (
        <div style={{ textAlign: 'right', marginTop: 4 }}>
          <button
            onClick={handleContinue}
            style={{
              background: `rgba(167,139,250,0.08)`, border: `1px solid rgba(167,139,250,0.36)`,
              color: PURPLE, padding: '10px 26px', borderRadius: 6, cursor: 'pointer',
              fontFamily: "'Courier New',monospace", fontSize: 12.5,
              letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.08)'; }}
          >
            CONTINUE →
          </button>
        </div>
      )}
    </div>
  );
}

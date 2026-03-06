'use client';

import { useState, useRef } from 'react';
import { scenarios, levelInfo } from '@/data/atcScenarios';
import { buildSession } from '@/lib/quiz';

const QUESTIONS_PER_SESSION = 10;

export default function ATCSimulator() {
  const [screen, setScreen]       = useState('menu');
  const [level, setLevel]         = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected]   = useState(null);
  const [streak, setStreak]       = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore]         = useState(0);
  const [showExp, setShowExp]     = useState(false);
  const [radioStatic, setRadioStatic] = useState(false);
  const audioCtx = useRef(null);

  const playStatic = () => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      const bufferSize = Math.floor(ctx.sampleRate * 0.22);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.22;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 1900; f.Q.value = 0.5;
      src.connect(f); f.connect(ctx.destination);
      src.start(); src.stop(ctx.currentTime + 0.22);
    } catch (_) {}
  };

  const startLevel = (lvl) => {
    setLevel(lvl);
    setQuestions(buildSession(scenarios[lvl], QUESTIONS_PER_SESSION));
    setCurrentIdx(0); setSelected(null); setShowExp(false);
    setStreak(0); setScore(0); setScreen('sim');
    setRadioStatic(true); playStatic();
    setTimeout(() => setRadioStatic(false), 320);
  };

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = questions[currentIdx].options[i].correct;
    if (isCorrect) {
      const ns = streak + 1;
      setStreak(ns); setBestStreak(p => Math.max(p, ns)); setScore(s => s + 1);
    } else { setStreak(0); }
    setShowExp(true);
  };

  const next = () => {
    if (currentIdx + 1 >= questions.length) { setScreen('result'); return; }
    setCurrentIdx(i => i + 1); setSelected(null); setShowExp(false);
    setRadioStatic(true); playStatic();
    setTimeout(() => setRadioStatic(false), 320);
  };

  const q    = questions[currentIdx];
  const info = level ? levelInfo[level] : null;
  const pct  = (score / (questions.length || 1)) * 100;
  const totalQ = Object.values(scenarios).flat().length;

  return (
    <div style={{ minHeight: '80vh', fontFamily: "'Courier New','Lucida Console',monospace", position: 'relative' }}>

      {/* MENU */}
      {screen === 'menu' && (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', animation: 'fadeSlide 0.4s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 9, letterSpacing: 5, color: '#38bdf8', marginBottom: 8, opacity: 0.8 }}>
              ◈ ATC RADIO COMMUNICATIONS ◈
            </div>
            <p style={{ color: '#6a8aa4', fontSize: 13, marginTop: 14, lineHeight: 1.7, maxWidth: 460, margin: '14px auto 0' }}>
              Select a difficulty level. You'll receive <strong style={{ color: '#7a9ab4' }}>10 random transmissions</strong> drawn from a bank of{' '}
              <strong style={{ color: '#7a9ab4' }}>{totalQ}</strong> unique scenarios. Choose your best readback.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(levelInfo).map(([key, val]) => (
              <button
                key={key}
                onClick={() => startLevel(key)}
                style={{
                  background: 'rgba(255,255,255,0.017)',
                  border: `1px solid ${val.color}28`,
                  borderLeft: `3px solid ${val.color}`,
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
                  e.currentTarget.style.background = `${val.color}0d`;
                  e.currentTarget.style.borderColor = `${val.color}66`;
                  e.currentTarget.style.borderLeftColor = val.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.017)';
                  e.currentTarget.style.borderColor = `${val.color}28`;
                  e.currentTarget.style.borderLeftColor = val.color;
                }}
              >
                <span style={{ fontSize: 26 }}>{val.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1.2, color: val.color }}>
                    {val.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6a8aa4', marginTop: 3 }}>{val.desc}</div>
                </div>
                <span style={{ color: `${val.color}55`, fontSize: 20 }}>›</span>
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40, fontSize: 10, color: '#2a4464', letterSpacing: 3 }}>
            PHRASEOLOGY · FAA AIM & ORDER 7110.65
          </div>
        </div>
      )}

      {/* SIM */}
      {screen === 'sim' && q && (
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 20px 60px', animation: 'fadeSlide 0.3s ease' }}>
          {/* Header bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
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
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                { label: 'STREAK', val: streak > 0 ? `🔥 ${streak}` : `${streak}`, col: streak > 0 ? '#00ff88' : '#ef4444' },
                { label: 'SCORE',  val: `${score}/${currentIdx + (selected !== null ? 1 : 0)}`, col: '#f0f6ff' },
                { label: 'BEST',   val: bestStreak, col: info.color },
              ].map(({ label, val, col }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 7.5, letterSpacing: 2.5, color: '#4a6a84', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: col, lineHeight: 1.1 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: info.color }}>{info.icon} {info.label.toUpperCase()}</div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#4a6a84' }}>Q {currentIdx + 1} / {questions.length}</div>
          </div>
          <div style={{ height: 2, background: '#0b1220', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2, background: info.color, transition: 'width 0.4s ease',
              width: `${((currentIdx + (selected !== null ? 1 : 0)) / questions.length) * 100}%`,
            }} />
          </div>

          {/* Situation */}
          <div style={{
            background: 'rgba(255,255,255,0.015)', border: '1px solid #111c2a', borderRadius: 8,
            padding: '11px 15px', marginBottom: 14, fontSize: 12.5, color: '#6a8aa4', lineHeight: 1.62,
          }}>
            <span style={{ color: '#4a6a84', letterSpacing: 2.5, fontSize: 9 }}>SITUATION // </span>
            {q.situation}
          </div>

          {/* ATC Transmission */}
          <div style={{
            background: 'rgba(56,189,248,0.028)', border: '1px solid rgba(56,189,248,0.14)',
            borderRadius: 10, padding: '16px 20px', marginBottom: 22,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%', background: '#38bdf8',
                animation: radioStatic ? 'none' : 'pulse 2s ease infinite',
              }} />
              <span style={{ fontSize: 8.5, letterSpacing: 3.5, color: '#38bdf8' }}>ATC TRANSMISSION</span>
            </div>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.78, color: '#d8e4f0', fontStyle: 'italic', letterSpacing: 0.3 }}>
              "{q.atcMessage}"
            </p>
          </div>

          {/* Options */}
          <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#4a6a84', marginBottom: 10 }}>
            YOUR RESPONSE — SELECT ONE:
          </div>
          {q.options.map((opt, i) => {
            let borderColor = 'rgba(255,255,255,0.09)';
            let bgColor     = 'rgba(255,255,255,0.024)';
            let textColor   = '#bccede';
            if (selected !== null) {
              if (opt.correct)       { borderColor = '#00ff88'; bgColor = 'rgba(0,255,136,0.065)'; textColor = '#00ff88'; }
              else if (i === selected) { borderColor = '#ef4444'; bgColor = 'rgba(239,68,68,0.065)'; textColor = '#ef4444'; }
              else                   { textColor = '#3a5870'; }
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
                onMouseEnter={e => { if (selected === null) { e.currentTarget.style.background = 'rgba(255,255,255,0.055)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; } }}
                onMouseLeave={e => { if (selected === null) { e.currentTarget.style.background = bgColor; e.currentTarget.style.borderColor = borderColor; } }}
              >
                <span style={{ color: selected !== null ? (opt.correct ? '#00ff8844' : '#4a6a84') : '#4a6a84', marginRight: 10 }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt.text}
                {selected !== null && opt.correct && (
                  <span style={{ float: 'right', fontSize: 10.5, letterSpacing: 1 }}>✓ CORRECT</span>
                )}
                {selected !== null && i === selected && !opt.correct && (
                  <span style={{ float: 'right', fontSize: 10.5, letterSpacing: 1 }}>✗ INCORRECT</span>
                )}
              </button>
            );
          })}

          {/* Explanation */}
          {showExp && (
            <div style={{
              background: 'rgba(255,255,255,0.014)', border: '1px solid #111c2a', borderRadius: 8,
              padding: '13px 16px', marginTop: 2, marginBottom: 18, animation: 'popIn 0.22s ease',
            }}>
              <div style={{ fontSize: 8, letterSpacing: 3, color: '#4a6a84', marginBottom: 6 }}>INSTRUCTOR NOTE</div>
              <p style={{ margin: 0, fontSize: 12.5, color: '#7090aa', lineHeight: 1.76 }}>{q.explanation}</p>
            </div>
          )}

          {selected !== null && (
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <button
                onClick={next}
                style={{
                  background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.36)', color: '#38bdf8',
                  padding: '10px 26px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Courier New',monospace",
                  fontSize: 12.5, letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.17)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.08)'; }}
              >
                {currentIdx + 1 >= questions.length ? 'VIEW RESULTS' : 'NEXT TRANSMISSION →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* RESULTS */}
      {screen === 'result' && (
        <div style={{ maxWidth: 540, margin: '0 auto', padding: '58px 22px', textAlign: 'center', animation: 'fadeSlide 0.4s ease' }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: '#4a6a84', marginBottom: 18 }}>SESSION COMPLETE</div>
          <div style={{ fontSize: 58, marginBottom: 10 }}>
            {pct >= 90 ? '🏆' : pct >= 70 ? '📻' : pct >= 50 ? '📖' : '🔁'}
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 900, margin: '0 0 6px', color: '#f0f6ff' }}>{score} / {questions.length}</h2>
          <p style={{ color: '#5a7a94', fontSize: 13, lineHeight: 1.65 }}>
            {pct >= 90 ? 'Outstanding. You\'re cleared for full operations.' :
             pct >= 70 ? 'Solid performance. Review the highlighted areas.' :
             pct >= 50 ? 'Keep studying. Focus on mandatory readback items.' :
             'Return to the AIM phraseology chapters and try again.'}
          </p>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: 40, margin: '30px 0',
            padding: '18px', background: 'rgba(255,255,255,0.015)', border: '1px solid #111c2a', borderRadius: 12,
          }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 3, color: '#4a6a84' }}>BEST STREAK</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#38bdf8' }}>🔥 {bestStreak}</div>
            </div>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 3, color: '#4a6a84' }}>ACCURACY</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: info.color }}>{Math.round(pct)}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={() => startLevel(level)}
              style={{
                background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.36)', color: '#38bdf8',
                padding: '10px 24px', borderRadius: 6, cursor: 'pointer', fontFamily: "'Courier New',monospace",
                fontSize: 12.5, letterSpacing: 1, textTransform: 'uppercase',
              }}
            >
              RETRY LEVEL
            </button>
            <button
              onClick={() => setScreen('menu')}
              style={{
                background: 'none', border: '1px solid #1a2436', borderRadius: 6, color: '#6a8aa4',
                padding: '10px 20px', cursor: 'pointer', fontFamily: "'Courier New',monospace",
                fontSize: 12, textTransform: 'uppercase', letterSpacing: 1,
              }}
            >
              CHANGE LEVEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { matchingCategories } from '@/data/matchingSets';
import { loadBestTimes, saveBestTime } from '@/lib/matchingTimes';

const CYAN = '#06b6d4';
const FLASH_MS = 600;

/** Shuffle an array (Fisher-Yates) — returns a new array */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Format ms as M:SS.t (tenths) — used for the live stopwatch */
function formatStopwatch(ms) {
  if (ms <= 0) return '0:00.0';
  const totalTenths = Math.floor(ms / 100);
  const tenths = totalTenths % 10;
  const totalSecs = Math.floor(ms / 1000);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);
  return `${mins}:${String(secs).padStart(2, '0')}.${tenths}`;
}

/** Format ms as M:SS — used for compact best-time chips */
function formatCompact(ms) {
  if (ms <= 0) return '0:00';
  const totalSecs = Math.floor(ms / 1000);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * MatchingMode
 *
 * Screens:
 *   'categories' — grid of 6 category cards
 *   'sets'       — list of 3 set cards within the chosen category
 *   'game'       — two-column click-to-match board with running stopwatch
 *   'complete'   — well done screen with time stats and NEW BEST! badge
 *
 * Props:
 *   onBack — called when user exits to the Airman Knowledge menu
 */
export default function MatchingMode({ onBack }) {
  const [screen,        setScreen]        = useState('categories');
  const [category,      setCategory]      = useState(null);
  const [set,           setSet]           = useState(null);
  const [leftItems,     setLeftItems]     = useState([]);
  const [rightItems,    setRightItems]    = useState([]);
  const [matched,       setMatched]       = useState([]);
  const [selectedLeft,  setSelectedLeft]  = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [wrongPair,     setWrongPair]     = useState(null);
  const [startTime,     setStartTime]     = useState(null);
  const [elapsedMs,     setElapsedMs]     = useState(0);
  const [bestTimes,     setBestTimes]     = useState(() => loadBestTimes());
  const [isNewBest,     setIsNewBest]     = useState(false);
  const [previousBest,  setPreviousBest]  = useState(null);

  // ── Start a game ───────────────────────────────────────────────────────────
  const startGame = useCallback((cat, s) => {
    setCategory(cat);
    setSet(s);
    setLeftItems(shuffle(s.pairs));
    setRightItems(shuffle(s.pairs));
    setMatched([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setWrongPair(null);
    setElapsedMs(0);
    setIsNewBest(false);
    setPreviousBest(null);
    setStartTime(Date.now());
    setScreen('game');
  }, []);

  // ── Running stopwatch (100 ms ticks) ───────────────────────────────────────
  useEffect(() => {
    if (screen !== 'game' || !startTime) return;
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [screen, startTime]);

  // ── Match-checking logic ───────────────────────────────────────────────────
  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return;

    if (selectedLeft === selectedRight) {
      const nowMatched = [...matched, selectedLeft];
      setMatched(nowMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (nowMatched.length === set.pairs.length) {
        const finalMs = Date.now() - startTime;
        setElapsedMs(finalMs);
        const result = saveBestTime(set.id, finalMs);
        setIsNewBest(result.isNewBest);
        setPreviousBest(result.previousBest);
        setBestTimes(loadBestTimes());
        setScreen('complete');
      }
    } else {
      setWrongPair({ left: selectedLeft, right: selectedRight });
      const timeout = setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, FLASH_MS);
      return () => clearTimeout(timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeft, selectedRight]);

  const handleLeft = (pairId) => {
    if (matched.includes(pairId) || wrongPair) return;
    setSelectedLeft(pairId);
  };

  const handleRight = (pairId) => {
    if (matched.includes(pairId) || wrongPair || selectedLeft === null) return;
    setSelectedRight(pairId);
  };

  // ─── CATEGORIES screen ─────────────────────────────────────────────────────
  if (screen === 'categories') {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', animation: 'fadeSlide 0.4s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: '1px solid #2a3c54', borderRadius: 6, color: '#8fb8d0',
              padding: '6px 13px', cursor: 'pointer', fontFamily: "'Courier New',monospace",
              fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
            }}
          >
            ← MENU
          </button>
          <div style={{ fontSize: 9, letterSpacing: 5, color: CYAN, opacity: 0.9 }}>◈ MATCHING MODE ◈</div>
          <div style={{ width: 80 }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#e2e8f0', letterSpacing: 1.5 }}>
            CHOOSE A CATEGORY
          </div>
          <p style={{ color: '#8fb8d0', fontSize: 12, marginTop: 10 }}>
            Match each term to its correct definition. 18 sets across 6 topics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {matchingCategories.map(cat => {
            const completedSets = cat.sets.filter(s => bestTimes[s.id] != null).length;
            return (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat); setScreen('sets'); }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${cat.color}33`,
                  borderLeft: `3px solid ${cat.color}`,
                  borderRadius: 9,
                  padding: '20px 18px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Courier New',monospace",
                  color: '#e2e8f0',
                  transition: 'all 0.16s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${cat.color}15`;
                  e.currentTarget.style.borderColor = `${cat.color}66`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = `${cat.color}33`;
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: cat.color }}>
                  {cat.name.toUpperCase()}
                </div>
                <div style={{ fontSize: 11, color: '#7a9ab4', marginTop: 4 }}>
                  {cat.sets.length} SETS · {cat.sets[0].pairs.length * cat.sets.length} PAIRS
                  {completedSets > 0 && (
                    <span style={{ color: cat.color, marginLeft: 6 }}>· {completedSets}/{cat.sets.length} DONE</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 10, color: '#5a7a94', letterSpacing: 3 }}>
          18 SETS · 144 PAIRS TOTAL
        </div>
      </div>
    );
  }

  // ─── SETS screen ───────────────────────────────────────────────────────────
  if (screen === 'sets' && category) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', animation: 'fadeSlide 0.4s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <button
            onClick={() => setScreen('categories')}
            style={{
              background: 'none', border: '1px solid #2a3c54', borderRadius: 6, color: '#8fb8d0',
              padding: '6px 13px', cursor: 'pointer', fontFamily: "'Courier New',monospace",
              fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
            }}
          >
            ← BACK
          </button>
          <div style={{ fontSize: 9, letterSpacing: 5, color: category.color, opacity: 0.9 }}>
            ◈ {category.name.toUpperCase()} ◈
          </div>
          <div style={{ width: 80 }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 26, marginBottom: 8 }}>{category.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#e2e8f0', letterSpacing: 1.5 }}>
            {category.name.toUpperCase()}
          </div>
          <p style={{ color: '#8fb8d0', fontSize: 12, marginTop: 10 }}>Choose a set to practice.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {category.sets.map((s, idx) => {
            const best = bestTimes[s.id] ?? null;
            return (
              <button
                key={s.id}
                onClick={() => startGame(category, s)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${category.color}33`,
                  borderLeft: `3px solid ${category.color}`,
                  borderRadius: 9,
                  padding: '18px 22px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Courier New',monospace",
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.16s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${category.color}15`;
                  e.currentTarget.style.borderColor = `${category.color}66`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = `${category.color}33`;
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: `${category.color}22`, border: `1px solid ${category.color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 900, color: category.color,
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: category.color }}>
                    {s.name.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 11, color: '#7a9ab4', marginTop: 3 }}>
                    {s.pairs.length} PAIRS
                    {best !== null && (
                      <span style={{ color: '#34d399', marginLeft: 8 }}>
                        ⏱ BEST: {formatCompact(best)}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ color: `${category.color}88`, fontSize: 20 }}>›</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── GAME screen ───────────────────────────────────────────────────────────
  if (screen === 'game' && set) {
    const accent = category?.color ?? CYAN;
    const bestForSet = bestTimes[set.id] ?? null;

    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px 60px', animation: 'fadeSlide 0.3s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <button
            onClick={() => setScreen('sets')}
            style={{
              background: 'none', border: '1px solid #2a3c54', borderRadius: 6, color: '#8fb8d0',
              padding: '6px 13px', cursor: 'pointer', fontFamily: "'Courier New',monospace",
              fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
            }}
          >
            ← SETS
          </button>

          {/* Stopwatch — centrepiece */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#7a9ab4', marginBottom: 2 }}>TIME</div>
            <div
              data-testid="stopwatch"
              style={{
                fontSize: 30, fontWeight: 900, fontFamily: "'Courier New',monospace",
                color: accent, lineHeight: 1,
                textShadow: `0 0 18px ${accent}55`,
              }}
            >
              {formatStopwatch(elapsedMs)}
            </div>
            {bestForSet !== null && (
              <div style={{ fontSize: 10, color: '#6a8aa4', marginTop: 3, letterSpacing: 1 }}>
                BEST {formatCompact(bestForSet)}
              </div>
            )}
          </div>

          {/* Matched counter */}
          <div style={{ textAlign: 'right', fontFamily: "'Courier New',monospace" }}>
            <div style={{ fontSize: 9, letterSpacing: 2.5, color: '#7a9ab4' }}>MATCHED</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: accent }}>
              {matched.length} / {set.pairs.length}
            </div>
          </div>
        </div>

        {/* Category / set subtitle */}
        <div style={{ textAlign: 'center', fontSize: 10, letterSpacing: 3, color: '#6a8aa4', marginBottom: 16 }}>
          {category?.name.toUpperCase()} · {set.name.toUpperCase()}
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: '#0d1a28', borderRadius: 2, marginBottom: 22 }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${(matched.length / set.pairs.length) * 100}%`,
            background: accent,
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Instruction */}
        {selectedLeft === null ? (
          <div style={{ textAlign: 'center', fontSize: 11, color: '#8fb8d0', letterSpacing: 2, marginBottom: 18 }}>
            SELECT A TERM ON THE LEFT
          </div>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 11, color: accent, letterSpacing: 2, marginBottom: 18 }}>
            NOW SELECT THE MATCHING DEFINITION ON THE RIGHT
          </div>
        )}

        {/* Two-column board */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
          {/* Left column — Terms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#7a9ab4', marginBottom: 4, textAlign: 'center' }}>
              TERMS
            </div>
            {leftItems.map(item => {
              const isMatched  = matched.includes(item.id);
              const isSelected = selectedLeft === item.id;
              const isWrong    = wrongPair?.left === item.id;
              const leftBorder = isWrong ? '#ef4444'
                : isMatched  ? '#34d399'
                : isSelected ? accent
                : '#4a6a84';
              const textColor = isWrong ? '#ef4444'
                : isMatched  ? '#34d399'
                : isSelected ? accent
                : '#c0d4e8';
              const bg = isWrong ? 'rgba(239,68,68,0.12)'
                : isMatched  ? 'rgba(52,211,153,0.08)'
                : isSelected ? `${accent}18`
                : 'rgba(255,255,255,0.04)';
              const border = isWrong ? '#ef444455'
                : isMatched  ? '#34d39940'
                : isSelected ? `${accent}55`
                : '#2a3c54';

              return (
                <button
                  key={item.id}
                  onClick={() => handleLeft(item.id)}
                  disabled={isMatched || !!wrongPair}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderLeft: `3px solid ${leftBorder}`,
                    borderRadius: 7,
                    padding: '12px 16px',
                    cursor: isMatched ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Courier New',monospace",
                    fontSize: 12,
                    color: isMatched ? '#34d39966' : textColor,
                    transition: isWrong ? 'none' : 'all 0.15s',
                    opacity: isMatched ? 0.5 : 1,
                    lineHeight: 1.4,
                  }}
                >
                  {item.term}
                </button>
              );
            })}
          </div>

          {/* Right column — Definitions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#7a9ab4', marginBottom: 4, textAlign: 'center' }}>
              DEFINITIONS
            </div>
            {rightItems.map(item => {
              const isMatched  = matched.includes(item.id);
              const isSelected = selectedRight === item.id;
              const isWrong    = wrongPair?.right === item.id;
              const leftBorder = isWrong ? '#ef4444'
                : isMatched  ? '#34d399'
                : isSelected ? accent
                : '#4a6a84';
              const textColor = isWrong ? '#ef4444'
                : isMatched  ? '#34d399'
                : isSelected ? accent
                : '#c0d4e8';
              const bg = isWrong ? 'rgba(239,68,68,0.12)'
                : isMatched  ? 'rgba(52,211,153,0.08)'
                : isSelected ? `${accent}18`
                : 'rgba(255,255,255,0.04)';
              const border = isWrong ? '#ef444455'
                : isMatched  ? '#34d39940'
                : isSelected ? `${accent}55`
                : '#2a3c54';

              return (
                <button
                  key={item.id}
                  onClick={() => handleRight(item.id)}
                  disabled={isMatched || !!wrongPair || selectedLeft === null}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderLeft: `3px solid ${leftBorder}`,
                    borderRadius: 7,
                    padding: '12px 16px',
                    cursor: (isMatched || selectedLeft === null) ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Courier New',monospace",
                    fontSize: 12,
                    color: isMatched ? '#34d39966' : textColor,
                    transition: isWrong ? 'none' : 'all 0.15s',
                    opacity: isMatched ? 0.5 : selectedLeft === null && !isMatched ? 0.55 : 1,
                    lineHeight: 1.4,
                  }}
                >
                  {item.definition}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── COMPLETE screen ───────────────────────────────────────────────────────
  if (screen === 'complete' && set) {
    const accent = category?.color ?? CYAN;
    const totalPairs = set.pairs.length;
    const improvement = isNewBest && previousBest !== null
      ? ((previousBest - elapsedMs) / 1000).toFixed(1)
      : null;

    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 20px', textAlign: 'center', animation: 'fadeSlide 0.4s ease' }}>
        {/* NEW BEST banner or normal header */}
        {isNewBest ? (
          <>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⭐</div>
            <div style={{
              display: 'inline-block',
              background: `${accent}22`, border: `1px solid ${accent}66`,
              borderRadius: 20, padding: '4px 16px', marginBottom: 14,
              fontSize: 11, letterSpacing: 3, color: accent, fontFamily: "'Courier New',monospace",
            }}>
              NEW BEST!
            </div>
            {improvement && (
              <div style={{ fontSize: 13, color: '#34d399', marginBottom: 10, letterSpacing: 1 }}>
                ↑ {improvement}s faster than previous best ({formatCompact(previousBest)})
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 11, letterSpacing: 5, color: accent, marginBottom: 10 }}>SET COMPLETE</div>
          </>
        )}

        <div style={{ fontSize: 26, fontWeight: 900, color: '#e2e8f0', letterSpacing: 1.5, marginBottom: 6 }}>
          {set.name.toUpperCase()}
        </div>
        <div style={{ fontSize: 13, color: '#8fb8d0', marginBottom: 36 }}>
          {category?.name.toUpperCase()}
        </div>

        {/* Stats grid — 2 columns: pairs matched + time */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
          background: '#0d1a28', borderRadius: 10, overflow: 'hidden',
          border: '1px solid #2a3c54', marginBottom: 32,
        }}>
          {[
            { label: 'PAIRS MATCHED', val: totalPairs },
            { label: 'TIME',          val: formatStopwatch(elapsedMs) },
          ].map(({ label, val }) => (
            <div key={label} style={{ padding: '20px 12px', background: 'rgba(255,255,255,0.025)', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: accent }}>{val}</div>
              <div style={{ fontSize: 9, letterSpacing: 2.5, color: '#7a9ab4', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => startGame(category, set)}
            style={{
              background: `${accent}18`, border: `1px solid ${accent}55`, borderRadius: 8,
              color: accent, fontFamily: "'Courier New',monospace", fontSize: 12,
              letterSpacing: 1.5, padding: '14px 24px', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${accent}28`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${accent}18`; }}
          >
            PLAY AGAIN
          </button>
          <button
            onClick={() => setScreen('sets')}
            style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid #2a3c54', borderRadius: 8,
              color: '#8fb8d0', fontFamily: "'Courier New',monospace", fontSize: 12,
              letterSpacing: 1.5, padding: '14px 24px', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#c0d4e8'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8fb8d0'; }}
          >
            MORE SETS IN {category?.name.toUpperCase()}
          </button>
          <button
            onClick={() => setScreen('categories')}
            style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid #2a3c54', borderRadius: 8,
              color: '#8fb8d0', fontFamily: "'Courier New',monospace", fontSize: 12,
              letterSpacing: 1.5, padding: '14px 24px', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#c0d4e8'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8fb8d0'; }}
          >
            ALL CATEGORIES
          </button>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none',
              color: '#6a8aa4', fontFamily: "'Courier New',monospace", fontSize: 11,
              letterSpacing: 1, padding: '10px 24px', cursor: 'pointer',
            }}
          >
            ← BACK TO MENU
          </button>
        </div>
      </div>
    );
  }

  return null;
}

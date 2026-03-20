'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';

const HIDDEN_KEY = 'gopilot_hero_hidden';

/** Smooth count-up animation */
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

// Plane images are in /public — used as <img> for the flyAcross animation

/**
 * Hero section with atmospheric background, animated counters, and flying aircraft.
 * @param {{ onUnlockPro: () => void, pro: boolean, proLoading: boolean }} props
 */
export default function HeroSection({ onUnlockPro, pro = false, proLoading = false }) {
  const { data: session } = useSession();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(HIDDEN_KEY) === '1');
  }, []);

  const dismiss = () => {
    localStorage.setItem(HIDDEN_KEY, '1');
    setHidden(true);
  };

  const q131 = useCountUp(hidden ? 0 : 131, 1600);
  const a45  = useCountUp(hidden ? 0 : 45,  1400);
  const v46  = useCountUp(hidden ? 0 : 46,  1500);

  if (hidden) return null;

  const stats = [
    { value: q131, label: 'Exam Questions',  color: '#38bdf8' },
    { value: a45,  label: 'ATC Scenarios',   color: '#a78bfa' },
    { value: v46,  label: 'Training Videos', color: '#34d399' },
  ];

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(40px, 7vw, 72px) clamp(16px, 4vw, 32px)',
      }}
    >
      {/* ── Hero background photo + atmospheric overlays ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80&fit=crop&crop=center)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 55%',
        backgroundColor: '#030812',
      }} />
      {/* Dark overlay + gradient for readability */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `
          linear-gradient(180deg, rgba(2,5,16,0.88) 0%, rgba(6,12,30,0.82) 50%, rgba(10,22,48,0.9) 100%),
          radial-gradient(ellipse at 50% 110%, rgba(14,165,233,0.12) 0%, transparent 55%)
        `,
      }} />

      {/* ── Horizon glow line ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.35), transparent)',
        animation: 'horizonPulse 4s ease-in-out infinite',
        zIndex: 1,
      }} />

      {/* ── Boeing 777 — high altitude, slow, left to right ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '12%', left: 0,
        zIndex: 1,
        animation: 'flyAcross 32s -8s linear infinite',
        willChange: 'transform',
      }}>
        <img src="/boeing777.webp" alt=""
          style={{ width: 300, height: 'auto', opacity: 0.55, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
        />
      </div>

      {/* ── Boeing 737 — mid altitude, right to left ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '35%', left: 0,
        zIndex: 1,
        animation: 'flyAcrossReverse 26s -5s linear infinite',
        willChange: 'transform',
      }}>
        <img src="/737.png" alt=""
          style={{ width: 260, height: 'auto', opacity: 0.5, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
        />
      </div>

      {/* ── Cessna Caravan — low and slow, right to left ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '60%', left: 0,
        zIndex: 1,
        animation: 'flyAcrossReverse 22s -15s linear infinite',
        willChange: 'transform',
      }}>
        <img src="/cessna.png" alt=""
          style={{ width: 180, height: 'auto', opacity: 0.5, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
        />
      </div>

      {/* ── F-16 — fastest, lowest pass, left to right ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '78%', left: 0,
        zIndex: 1,
        animation: 'flyAcross 14s -3s linear infinite',
        willChange: 'transform',
      }}>
        <img src="/f16.png" alt=""
          style={{ width: 160, height: 'auto', opacity: 0.5, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
        />
      </div>

      {/* ── Dismiss ── */}
      <button
        onClick={dismiss}
        aria-label="Dismiss hero section"
        style={{
          position: 'absolute', top: 16, right: 18, zIndex: 10,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#1e3a5f', fontSize: 18, lineHeight: 1, padding: 4,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#475569'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#1e3a5f'; }}
      >
        ✕
      </button>

      {/* ── Content ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 11, letterSpacing: 2.5, color: '#0ea5e9', marginBottom: 18,
          fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600,
          opacity: 0.85,
          animation: 'riseIn 0.5s ease both',
        }}>
          FAA Private Pilot · Knowledge Test Prep
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 800, color: '#f1f5f9',
          fontFamily: "'Sora', system-ui, sans-serif",
          margin: '0 0 16px', lineHeight: 1.1,
          letterSpacing: '-1px',
          animation: 'riseIn 0.55s 0.05s ease both',
        }}>
          Pass Your FAA<br />Written Exam.
        </h1>

        {/* Sub-headline */}
        <p style={{
          fontSize: 'clamp(13px, 2vw, 16px)', color: '#64748b',
          lineHeight: 1.8, maxWidth: 520, margin: '0 0 36px',
          fontFamily: "'Inter', system-ui, sans-serif",
          animation: 'riseIn 0.6s 0.1s ease both',
        }}>
          The most complete study tool for student pilots — real exam questions,
          ATC radio simulator, and a curated video library, all in one place.
        </p>

        {/* Animated stats */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36,
          animation: 'riseIn 0.65s 0.15s ease both',
        }}>
          {stats.map(s => (
            <div
              key={s.label}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '14px 22px',
                textAlign: 'center', minWidth: 100,
                transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${s.color}40`;
                e.currentTarget.style.background = 'rgba(255,255,255,0.055)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                fontSize: 32, fontWeight: 800, color: s.color,
                fontFamily: "'Sora', system-ui, sans-serif",
                lineHeight: 1, minWidth: 56, tabularNums: true,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: 10, color: '#475569', marginTop: 5, letterSpacing: 0.5,
                fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
          animation: 'riseIn 0.7s 0.2s ease both',
        }}>
          <button
            onClick={() => document.querySelector('[data-tab-bar]')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              border: 'none',
              borderRadius: 9, padding: '11px 24px',
              color: '#fff',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 4px 20px rgba(14,165,233,0.25)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 28px rgba(14,165,233,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,233,0.25)';
            }}
          >
            Start Studying →
          </button>

          {!session && (
            <button
              onClick={() => signIn('google')}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 9, padding: '11px 24px',
                color: '#94a3b8',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
            >
              Sign In Free →
            </button>
          )}

          {!proLoading && (pro ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 9, padding: '11px 20px',
              color: '#4ade80',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13, fontWeight: 600,
            }}>
              <span>✓</span> Pro Active
            </div>
          ) : (
            <button
              onClick={onUnlockPro}
              style={{
                background: 'rgba(129,140,248,0.08)',
                border: '1px solid rgba(129,140,248,0.2)',
                borderRadius: 9, padding: '11px 24px',
                color: '#a5b4fc',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(129,140,248,0.15)';
                e.currentTarget.style.borderColor = 'rgba(129,140,248,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(129,140,248,0.08)';
                e.currentTarget.style.borderColor = 'rgba(129,140,248,0.2)';
              }}
            >
              Unlock Pro — $14.99
            </button>
          ))}
        </div>

        {/* Trust line */}
        <div style={{
          marginTop: 24, fontSize: 11, color: '#1e3a5f',
          fontFamily: "'Inter', system-ui, sans-serif",
          animation: 'riseIn 0.75s 0.25s ease both',
        }}>
          Based on FAA-CT-8080-2H · Private Pilot ACS · Updated for current test standards
        </div>
      </div>
    </section>
  );
}

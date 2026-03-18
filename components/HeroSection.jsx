'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

const HIDDEN_KEY = 'gopilot_hero_hidden';

/**
 * Hero section shown above the tab content.
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

  if (hidden) return null;

  const stats = [
    { value: '131', label: 'Exam Questions' },
    { value: '45',  label: 'ATC Scenarios'  },
    { value: '46',  label: 'Training Videos' },
  ];

  return (
    <section style={{
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'linear-gradient(180deg, rgba(14,165,233,0.04) 0%, transparent 100%)',
      padding: 'clamp(28px, 5vw, 52px) clamp(16px, 4vw, 32px)',
      position: 'relative',
      animation: 'fadeSlide 0.4s ease',
    }}>
      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss hero section"
        style={{
          position: 'absolute', top: 14, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#334155', fontSize: 16, padding: 4,
          lineHeight: 1, transition: 'color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#334155'; }}
      >
        ✕
      </button>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 11, letterSpacing: 2, color: '#0ea5e9', marginBottom: 14,
          fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600,
          opacity: 0.8,
        }}>
          FAA Private Pilot · Knowledge Test Prep
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(24px, 4.5vw, 42px)',
          fontWeight: 800, color: '#f1f5f9',
          fontFamily: "'Sora', system-ui, sans-serif",
          margin: '0 0 14px', lineHeight: 1.15,
          letterSpacing: '-0.5px',
        }}>
          Pass Your FAA Written Exam.
        </h1>

        {/* Sub-headline */}
        <p style={{
          fontSize: 'clamp(13px, 2vw, 15px)', color: '#64748b',
          lineHeight: 1.75, maxWidth: 540, margin: '0 0 32px',
          fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400,
        }}>
          The most complete online study tool for student pilots. Real exam questions,
          ATC radio simulator, and a full video library — all in one place.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'rgba(14,165,233,0.06)',
              border: '1px solid rgba(14,165,233,0.12)',
              borderRadius: 10, padding: '12px 20px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 26, fontWeight: 800, color: '#38bdf8',
                fontFamily: "'Sora', system-ui, sans-serif", lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: 10, color: '#334155', marginTop: 4, letterSpacing: 0.5,
                fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => document.querySelector('[data-tab-bar]')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'rgba(14,165,233,0.1)',
              border: '1px solid rgba(14,165,233,0.25)',
              borderRadius: 8, padding: '10px 22px',
              color: '#38bdf8',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,165,233,0.17)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,165,233,0.1)'; }}
          >
            Start Studying →
          </button>

          {!session && (
            <button
              onClick={() => signIn('google')}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '10px 22px',
                color: '#475569',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              Sign In Free →
            </button>
          )}

          {!proLoading && (pro ? (
            <div style={{
              background: 'rgba(34,197,94,0.07)',
              border: '1px solid rgba(34,197,94,0.18)',
              borderRadius: 8, padding: '10px 20px',
              color: '#4ade80',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13, fontWeight: 600,
            }}>
              ✓ Pro Active
            </div>
          ) : (
            <button
              onClick={onUnlockPro}
              style={{
                background: 'rgba(129,140,248,0.08)',
                border: '1px solid rgba(129,140,248,0.22)',
                borderRadius: 8, padding: '10px 22px',
                color: '#a5b4fc',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.08)'; }}
            >
              Unlock Pro — $14.99
            </button>
          ))}
        </div>

        {/* Trust line */}
        <div style={{
          marginTop: 22, fontSize: 11, color: '#1e3a5f', letterSpacing: 0.3,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          Based on FAA-CT-8080-2H · Private Pilot ACS · Updated for current test standards
        </div>
      </div>
    </section>
  );
}

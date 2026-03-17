'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

const HIDDEN_KEY = 'gopilot_hero_hidden';

/**
 * Hero section shown above the tab content. Describes what GoPilot is,
 * shows key stats, and surfaces the Pro CTA. Dismissable — preference
 * is saved to localStorage.
 *
 * @param {{ onUnlockPro: () => void, pro: boolean, proLoading: boolean }} props
 */
export default function HeroSection({ onUnlockPro, pro = false, proLoading = false }) {
  const { data: session } = useSession();
  const [hidden, setHidden] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    setHidden(localStorage.getItem(HIDDEN_KEY) === '1');
  }, []);

  const dismiss = () => {
    localStorage.setItem(HIDDEN_KEY, '1');
    setHidden(true);
  };

  if (hidden) return null;

  const stats = [
    { value: '131', label: 'EXAM QUESTIONS' },
    { value: '45',  label: 'ATC SCENARIOS'  },
    { value: '46',  label: 'TRAINING VIDEOS' },
  ];

  return (
    <section style={{
      borderBottom: '1px solid rgba(0,255,136,0.08)',
      background: 'linear-gradient(180deg, rgba(0,255,136,0.03) 0%, transparent 100%)',
      padding: 'clamp(28px, 5vw, 48px) clamp(16px, 4vw, 32px)',
      position: 'relative',
      animation: 'fadeSlide 0.4s ease',
    }}>
      {/* Dismiss button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss hero section"
        style={{
          position: 'absolute', top: 14, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#2a4464', fontSize: 11, letterSpacing: 1,
          fontFamily: "'Courier New', monospace", padding: 4,
        }}
      >
        ✕
      </button>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 9, letterSpacing: 5, color: '#00ff88', marginBottom: 14, opacity: 0.7,
          fontFamily: "'Courier New', monospace",
        }}>
          ◈ FAA PRIVATE PILOT KNOWLEDGE TEST PREP ◈
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 900, letterSpacing: 2, color: '#f0f6ff',
          fontFamily: "'Courier New', monospace",
          margin: '0 0 12px', lineHeight: 1.2,
        }}>
          Pass Your FAA Written Exam.
        </h1>

        {/* Sub-headline */}
        <p style={{
          fontSize: 'clamp(12px, 2vw, 14px)', color: '#6a8aa4',
          lineHeight: 1.8, maxWidth: 560, margin: '0 0 28px',
          fontFamily: "'Courier New', monospace",
        }}>
          The most complete online study tool for student pilots. Real exam questions,
          ATC radio simulator, and a full video library — all in one place.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'rgba(0,255,136,0.05)',
              border: '1px solid rgba(0,255,136,0.15)',
              borderRadius: 8, padding: '10px 18px',
              textAlign: 'center', fontFamily: "'Courier New', monospace",
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#00ff88', letterSpacing: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 8.5, letterSpacing: 2, color: '#3d5878', marginTop: 2 }}>
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
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: 7, padding: '10px 22px',
              color: '#00ff88', fontFamily: "'Courier New', monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: 2, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.16)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.1)'; }}
          >
            START STUDYING →
          </button>

          {!session && (
            <button
              onClick={() => signIn('google')}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 7, padding: '10px 22px',
                color: '#5a7a94', fontFamily: "'Courier New', monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: 2, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#cfe2f7'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#5a7a94'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              SIGN IN FREE →
            </button>
          )}

          {!proLoading && (pro ? (
            <div style={{
              background: 'rgba(0,255,136,0.06)',
              border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: 7, padding: '10px 22px',
              color: '#00ff88', fontFamily: "'Courier New', monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: 2,
            }}>
              ✓ PRO ACTIVE
            </div>
          ) : (
            <button
              onClick={onUnlockPro}
              style={{
                background: 'rgba(129,140,248,0.1)',
                border: '1px solid rgba(129,140,248,0.25)',
                borderRadius: 7, padding: '10px 22px',
                color: '#818cf8', fontFamily: "'Courier New', monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: 2, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.1)'; }}
            >
              UNLOCK PRO — $14.99
            </button>
          ))}
        </div>

        {/* Trust line */}
        <div style={{
          marginTop: 20, fontSize: 9.5, color: '#2a4464', letterSpacing: 1.5,
          fontFamily: "'Courier New', monospace",
        }}>
          Based on FAA-CT-8080-2H · Private Pilot ACS · Updated for current test standards
        </div>
      </div>
    </section>
  );
}

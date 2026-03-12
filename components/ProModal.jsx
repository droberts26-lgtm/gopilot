'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

const PRO_FEATURES = [
  'Full Test — all 131 official FAA PAR exam questions',
  'Learn Mode — mastery-based study: every question 3× correct before it\'s done',
  'ATC General Aviation & Commercial/ATP scenario levels',
  'Matching Mode — 18 sets, 144 aviation term pairs across 6 categories',
  'ACS weak-area breakdown — see exactly which topics to study after each test',
  'FAA Exam Timer — official 2:30:00 countdown matching the real test format',
];

const FREE_FEATURES = [
  'ATC Student Pilot level (50 scenarios)',
  'Quick Practice — 10 random knowledge questions',
  'Aviation Basics — 9 visual slideshow topics',
  'Videos — 46 curated FAA training videos',
];

/** Multicolor Google "G" logo — per Google brand guidelines */
function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

/**
 * ProModal — shown when a free user clicks a locked Pro feature.
 * Unauthenticated users see a sign-in screen first; authenticated users
 * see the full Pro plan and can proceed to Stripe checkout.
 * @param {{ onClose: () => void }} props
 */
export default function ProModal({ onClose }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUnlock() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0b1220',
          border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: 12,
          padding: '32px 28px',
          maxWidth: 420,
          width: '100%',
          fontFamily: "'Courier New', monospace",
          boxShadow: '0 0 40px rgba(0,255,136,0.06)',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
        }}
      >
        {session ? (
          /* ── Authenticated: show full Pro plan ── */
          <>
            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 3, color: '#00ff88' }}>
                GOPILOT PRO
              </div>
              <div style={{ fontSize: 10, letterSpacing: 3, color: '#3d5878', marginTop: 4 }}>
                UNLOCK ALL FEATURES
              </div>
            </div>

            {/* What's already free */}
            <div style={{
              background: 'rgba(52,211,153,0.03)',
              border: '1px solid rgba(52,211,153,0.12)',
              borderRadius: 8,
              padding: '11px 14px',
              marginBottom: 10,
            }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: '#34d399', marginBottom: 8 }}>
                YOUR FREE ACCESS INCLUDES
              </div>
              {FREE_FEATURES.map(f => (
                <div key={f} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  marginBottom: 6, fontSize: 11, color: '#6a8a74', lineHeight: 1.4,
                }}>
                  <span style={{ color: '#34d399', flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Pro features list */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid #0f1d2c',
              borderRadius: 8,
              padding: '16px 18px',
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: '#00ff88', marginBottom: 10 }}>
                UNLOCK WITH PRO
              </div>
              {PRO_FEATURES.map(f => (
                <div key={f} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  marginBottom: 10, fontSize: 12, color: '#c0d4e8', lineHeight: 1.5,
                }}>
                  <span style={{ color: '#00ff88', flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div style={{
              textAlign: 'center',
              padding: '14px',
              background: 'rgba(0,255,136,0.04)',
              border: '1px solid rgba(0,255,136,0.12)',
              borderRadius: 8,
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#00ff88', letterSpacing: 1 }}>
                $14.99
              </div>
              <div style={{ fontSize: 10, color: '#4a8a6a', letterSpacing: 2, marginTop: 2 }}>
                ONE-TIME UNLOCK · LIFETIME ACCESS
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                marginBottom: 10, padding: '8px 12px',
                background: 'rgba(255,80,80,0.08)',
                border: '1px solid rgba(255,80,80,0.25)',
                borderRadius: 6,
                fontSize: 11, color: '#ff6b6b',
                lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            {/* Unlock button */}
            <button
              onClick={handleUnlock}
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading ? 'rgba(0,255,136,0.04)' : 'rgba(0,255,136,0.1)',
                border: '1px solid rgba(0,255,136,0.35)',
                borderRadius: 7, cursor: loading ? 'default' : 'pointer',
                color: '#00ff88',
                fontFamily: "'Courier New', monospace",
                fontSize: 11, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 10,
                transition: 'all 0.15s',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.background = 'rgba(0,255,136,0.16)';
                  e.currentTarget.style.borderColor = 'rgba(0,255,136,0.55)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = loading ? 'rgba(0,255,136,0.04)' : 'rgba(0,255,136,0.1)';
                e.currentTarget.style.borderColor = 'rgba(0,255,136,0.35)';
              }}
            >
              {loading ? 'CONNECTING...' : 'UNLOCK PRO — $14.99'}
            </button>
          </>
        ) : (
          /* ── Unauthenticated: sign-in gate ── */
          <>
            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>🔒</div>
              <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: 3, color: '#00ff88' }}>
                SIGN IN REQUIRED
              </div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: '#3d5878', marginTop: 5 }}>
                CREATE AN ACCOUNT OR SIGN IN TO CONTINUE
              </div>
            </div>

            {/* What they're unlocking */}
            <div style={{
              background: 'rgba(0,255,136,0.03)',
              border: '1px solid #0f1d2c',
              borderRadius: 8,
              padding: '14px 16px',
              marginBottom: 18,
            }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: '#3d8a64', marginBottom: 10 }}>
                GOPILOT PRO INCLUDES
              </div>
              {PRO_FEATURES.map(f => (
                <div key={f} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  marginBottom: 8, fontSize: 11.5, color: '#8fb8d0', lineHeight: 1.5,
                }}>
                  <span style={{ color: '#00cc6a', flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
              <div style={{
                marginTop: 10, paddingTop: 10,
                borderTop: '1px solid #0f1d2c',
                textAlign: 'center',
                fontSize: 15, fontWeight: 900, color: '#00ff88', letterSpacing: 1,
              }}>
                $14.99 <span style={{ fontSize: 9, color: '#4a8a6a', letterSpacing: 2, fontWeight: 400 }}>ONE-TIME · LIFETIME ACCESS</span>
              </div>
            </div>

            {/* Google sign-in button */}
            <button
              onClick={() => signIn('google')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10,
                width: '100%', padding: '12px 16px',
                background: '#ffffff',
                border: '1px solid #dadce0',
                borderRadius: 7, cursor: 'pointer',
                color: '#3c4043',
                fontFamily: "'Courier New', monospace",
                fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
                marginBottom: 10,
                transition: 'background 0.15s, box-shadow 0.15s',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f8f8f8';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <GoogleIcon />
              SIGN IN / SIGN UP WITH GOOGLE
            </button>

            {/* Note */}
            <div style={{
              fontSize: 10, color: '#3d5878', textAlign: 'center',
              marginBottom: 10, lineHeight: 1.6,
            }}>
              New here? Your account is created automatically on first sign-in.
            </div>
          </>
        )}

        {/* Close button — always visible */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '10px',
            background: 'none',
            border: '1px solid #1a2436',
            borderRadius: 7, cursor: 'pointer',
            color: '#5a7a94',
            fontFamily: "'Courier New', monospace",
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#2a3c54';
            e.currentTarget.style.color = '#8fb8d0';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1a2436';
            e.currentTarget.style.color = '#5a7a94';
          }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}

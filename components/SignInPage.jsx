'use client';

import { signIn } from 'next-auth/react';

/** Multicolor Google "G" logo — per Google brand guidelines */
function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

/**
 * Full-page sign-in screen shown to unauthenticated visitors.
 * Matches the app's dark theme with radar grid overlay.
 */
export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#070b12',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Courier New', monospace",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.028, pointerEvents: 'none',
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, #00ff88 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, #00ff88 40px)
        `,
      }} />

      {/* Radar sweep */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        width: '200vw', height: '200vh',
        marginLeft: '-100vw', marginTop: '-100vh',
        background: 'conic-gradient(from 0deg, transparent 345deg, rgba(0,255,136,0.018) 360deg)',
        animation: 'radarSweep 9s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Sign-in card */}
      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: 420, width: '100%',
        padding: '48px 40px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(0,255,136,0.12)',
        borderRadius: 16,
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(0,255,136,0.04)',
        margin: '0 20px',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontSize: 38, fontWeight: 900, letterSpacing: 3,
            color: '#f0f6ff',
          }}>
            GO<span style={{ color: '#00ff88' }}>PILOT</span>
          </span>
        </div>
        <div style={{ fontSize: 9, letterSpacing: 4, color: '#3d8a64', marginBottom: 12 }}>
          AVIATION TRAINING SIMULATOR
        </div>
        <div style={{ fontSize: 10, color: '#3d6a54', letterSpacing: 0.5, marginBottom: 20 }}>
          New here? Your account is created automatically on first sign-in.
        </div>

        {/* Description */}
        <p style={{
          fontSize: 13, color: '#8fb8d0', lineHeight: 1.7,
          marginBottom: 36,
        }}>
          Practice ATC communications, FAA knowledge test questions,
          and aviation fundamentals — all in one place.
        </p>

        {/* Google sign-in button */}
        <button
          onClick={() => signIn('google')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            width: '100%',
            padding: '13px 20px',
            background: '#ffffff',
            border: '1px solid #dadce0',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: '#3c4043',
            fontFamily: "'Courier New', monospace",
            letterSpacing: 1,
            transition: 'background 0.15s, box-shadow 0.15s',
            boxSizing: 'border-box',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f8f8f8';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <GoogleIcon />
          CONTINUE WITH GOOGLE
        </button>

        {/* Disclaimer */}
        <p style={{
          marginTop: 24, fontSize: 10, color: '#3a5870',
          letterSpacing: 0.5, lineHeight: 1.6,
        }}>
          Your progress is automatically saved to your account.
          <br />
          For training purposes only — not for actual flight operations.
        </p>
      </div>
    </div>
  );
}

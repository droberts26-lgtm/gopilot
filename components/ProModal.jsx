'use client';

import { useSession, signIn } from 'next-auth/react';

const PRO_FEATURES = [
  'Full Test — all 131 PAR exam questions',
  'Learn Mode — mastery-based study (3× correct)',
  'ATC General & Commercial levels',
  'Matching — 5 additional categories',
  'ACS weak-area breakdown on results',
  'FAA Exam Timer (2:30:00 countdown)',
];

/**
 * ProModal — shown when a free user clicks a locked Pro feature.
 * @param {{ onClose: () => void }} props
 */
export default function ProModal({ onClose }) {
  const { data: session } = useSession();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
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
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
          <div style={{
            fontSize: 18, fontWeight: 900, letterSpacing: 3,
            color: '#00ff88',
          }}>
            GOPILOT PRO
          </div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: '#3d5878', marginTop: 4 }}>
            UNLOCK ALL FEATURES
          </div>
        </div>

        {/* Features list */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid #0f1d2c',
          borderRadius: 8,
          padding: '16px 18px',
          marginBottom: 20,
        }}>
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
            ONE-TIME UNLOCK
          </div>
          <div style={{ fontSize: 10, color: '#3d5878', letterSpacing: 1.5, marginTop: 8 }}>
            ⏳ COMING SOON — CHECK BACK SHORTLY
          </div>
        </div>

        {/* Buttons */}
        {!session && (
          <button
            onClick={() => signIn('google')}
            style={{
              width: '100%', padding: '11px',
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: 7, cursor: 'pointer',
              color: '#00ff88',
              fontFamily: "'Courier New', monospace",
              fontSize: 11, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom: 10,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,255,136,0.14)';
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0,255,136,0.08)';
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)';
            }}
          >
            SIGN IN TO CONTINUE
          </button>
        )}

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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) { router.push('/'); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070b12',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Courier New', monospace",
      padding: 20,
    }}>
      <div style={{
        background: '#0b1220',
        border: '1px solid rgba(0,255,136,0.3)',
        borderRadius: 12,
        padding: '40px 36px',
        maxWidth: 440,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(0,255,136,0.08)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>

        <div style={{
          fontSize: 20, fontWeight: 900, letterSpacing: 3,
          color: '#00ff88', marginBottom: 8,
        }}>
          PRO UNLOCKED
        </div>
        <div style={{
          fontSize: 11, letterSpacing: 3, color: '#3d5878', marginBottom: 28,
        }}>
          WELCOME TO GOPILOT PRO
        </div>

        <div style={{
          background: 'rgba(0,255,136,0.04)',
          border: '1px solid rgba(0,255,136,0.1)',
          borderRadius: 8,
          padding: '16px',
          marginBottom: 24,
          fontSize: 12,
          color: '#c0d4e8',
          lineHeight: 1.7,
        }}>
          All features are now unlocked. Your access is tied to your account
          and will be available every time you sign in.
        </div>

        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(0,255,136,0.1)',
            border: '1px solid rgba(0,255,136,0.35)',
            borderRadius: 7,
            cursor: 'pointer',
            color: '#00ff88',
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 14,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,255,136,0.16)';
            e.currentTarget.style.borderColor = 'rgba(0,255,136,0.55)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0,255,136,0.1)';
            e.currentTarget.style.borderColor = 'rgba(0,255,136,0.35)';
          }}
        >
          GO TO APP NOW
        </button>

        <div style={{ fontSize: 10, letterSpacing: 2, color: '#3d5878' }}>
          AUTO-REDIRECTING IN {countdown}s...
        </div>
      </div>
    </div>
  );
}

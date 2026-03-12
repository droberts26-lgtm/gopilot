'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ProSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'confirmed' | 'timeout'
  const [countdown, setCountdown] = useState(5);
  const pollRef = useRef(null);

  // Poll /api/pro until it returns true (webhook has fired + Redis is updated)
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15; // 30 seconds max

    const poll = async () => {
      try {
        const res = await fetch('/api/pro');
        const data = await res.json();
        if (data.pro) {
          setStatus('confirmed');
          return;
        }
      } catch (_) {}

      attempts++;
      if (attempts >= maxAttempts) {
        setStatus('timeout');
        return;
      }
      pollRef.current = setTimeout(poll, 2000);
    };

    poll();
    return () => clearTimeout(pollRef.current);
  }, []);

  // Once confirmed, count down and redirect
  useEffect(() => {
    if (status !== 'confirmed') return;
    if (countdown <= 0) { router.push('/'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, router]);

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

        {status === 'verifying' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 3, color: '#00ff88', marginBottom: 8 }}>
              ACTIVATING PRO
            </div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#3d5878', marginBottom: 24 }}>
              CONFIRMING YOUR PAYMENT...
            </div>
            <div style={{ fontSize: 11, color: '#4a6a84', lineHeight: 1.7 }}>
              This usually takes just a few seconds.
            </div>
          </>
        )}

        {status === 'confirmed' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 3, color: '#00ff88', marginBottom: 8 }}>
              PRO UNLOCKED
            </div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#3d5878', marginBottom: 28 }}>
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
              All features are now unlocked. Your access is tied to your Google
              account and will be available every time you sign in.
            </div>
            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%', padding: '12px',
                background: 'rgba(0,255,136,0.1)',
                border: '1px solid rgba(0,255,136,0.35)',
                borderRadius: 7, cursor: 'pointer',
                color: '#00ff88',
                fontFamily: "'Courier New', monospace",
                fontSize: 11, fontWeight: 700, letterSpacing: 2,
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
          </>
        )}

        {status === 'timeout' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 3, color: '#00ff88', marginBottom: 8 }}>
              PAYMENT RECEIVED
            </div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#3d5878', marginBottom: 24 }}>
              YOUR ACCESS IS BEING ACTIVATED
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
              Your payment was successful. Pro access will appear within a minute.
              Try signing out and back in if features are still locked.
            </div>
            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%', padding: '12px',
                background: 'rgba(0,255,136,0.1)',
                border: '1px solid rgba(0,255,136,0.35)',
                borderRadius: 7, cursor: 'pointer',
                color: '#00ff88',
                fontFamily: "'Courier New', monospace",
                fontSize: 11, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase',
                transition: 'all 0.15s',
              }}
            >
              GO TO APP
            </button>
          </>
        )}

      </div>
    </div>
  );
}

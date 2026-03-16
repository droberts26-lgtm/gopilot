'use client';

import { useState, useEffect } from 'react';

const ONBOARDED_KEY = 'gopilot_onboarded';

const STEPS = [
  {
    icon: '📋',
    color: '#f59e0b',
    title: 'AIRMAN KNOWLEDGE',
    body: '131 real FAA exam questions with detailed explanations. Quick Practice is free — unlock Full Test, Learn Mode, and Matching Mode with Pro.',
  },
  {
    icon: '📡',
    color: '#38bdf8',
    title: 'ATC COMMS',
    body: 'Practice real ATC radio calls at student, general, and commercial levels. Read back clearances, taxi instructions, and in-flight communications.',
  },
  {
    icon: '▶',
    color: '#818cf8',
    title: 'VIDEO LIBRARY',
    body: '46 curated videos covering every FAA exam topic. The first 2 per topic are free — Pro unlocks the full library.',
  },
  {
    icon: '🛩️',
    color: '#34d399',
    title: 'AVIATION BASICS',
    body: 'Visual slideshows on weather, airspace, navigation, and more. Great for beginners or a quick refresher before the exam.',
  },
];

/**
 * First-visit onboarding modal. Shown once, then dismissed permanently
 * via localStorage. Steps through the 4 core features.
 */
export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDED_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(ONBOARDED_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to GoPilot"
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeSlide 0.3s ease',
      }}
    >
      <div style={{
        background: '#0b1220',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: 'clamp(28px, 5vw, 44px)',
        maxWidth: 420, width: '100%',
        fontFamily: "'Courier New', monospace",
        position: 'relative',
        boxShadow: '0 0 80px rgba(0,0,0,0.6)',
      }}>

        {/* Skip */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute', top: 14, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#2a4464', fontSize: 10, letterSpacing: 1,
            fontFamily: "'Courier New', monospace",
          }}
        >
          SKIP
        </button>

        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: '#00ff88', marginBottom: 8, opacity: 0.7 }}>
            ◈ WELCOME TO GOPILOT ◈
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: 2, color: '#f0f6ff' }}>
            YOUR TRAINING SIMULATOR
          </div>
          <div style={{ fontSize: 10, color: '#3d5878', letterSpacing: 1.5, marginTop: 4 }}>
            Here's a quick tour of the 4 training modules.
          </div>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 20 : 6, height: 6,
                borderRadius: 3,
                background: i === step ? current.color : 'rgba(255,255,255,0.08)',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>

        {/* Step card */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${current.color}22`,
          borderRadius: 10, padding: '22px 20px',
          marginBottom: 24,
          animation: 'fadeSlide 0.25s ease',
          minHeight: 140,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{current.icon}</div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            color: current.color, marginBottom: 10,
          }}>
            {current.title}
          </div>
          <div style={{ fontSize: 12, color: '#6a8aa4', lineHeight: 1.75 }}>
            {current.body}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1, padding: '11px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, cursor: 'pointer',
                color: '#5a7a94', fontFamily: "'Courier New', monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
              }}
            >
              ← BACK
            </button>
          )}
          <button
            onClick={isLast ? dismiss : () => setStep(s => s + 1)}
            style={{
              flex: 2, padding: '11px',
              background: isLast ? `rgba(0,255,136,0.1)` : `${current.color}18`,
              border: `1px solid ${isLast ? 'rgba(0,255,136,0.3)' : current.color + '40'}`,
              borderRadius: 8, cursor: 'pointer',
              color: isLast ? '#00ff88' : current.color,
              fontFamily: "'Courier New', monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
              transition: 'all 0.15s',
            }}
          >
            {isLast ? 'BEGIN TRAINING →' : 'NEXT →'}
          </button>
        </div>
      </div>
    </div>
  );
}

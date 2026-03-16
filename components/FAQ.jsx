'use client';

import { useState } from 'react';

const QUESTIONS = [
  {
    q: 'What exam does GoPilot prepare me for?',
    a: 'GoPilot is built for the FAA Private Pilot Airman Knowledge Test (written exam). All 131 questions are drawn from the official FAA question bank (FAA-CT-8080-2H) and mapped to the Airman Certification Standards (ACS). The ATC simulator covers radio phraseology for student through commercial pilot operations.',
  },
  {
    q: 'What\'s free vs. Pro?',
    a: 'Free: Quick Practice (10 random questions), student-level ATC scenarios, all Aviation Basics slideshows, and the first 2 videos per topic in the library. Pro ($14.99 one-time): Full 131-question test, Learn Mode (spaced-repetition mastery), Matching Mode, FAA Exam Timer, general and commercial ATC levels, and the complete 46-video library.',
  },
  {
    q: 'Is the $14.99 a subscription or one-time?',
    a: 'One-time payment. You pay $14.99 once and your Pro access is permanent — no recurring charges, no hidden fees. Access is tied to your Google account so it follows you across devices.',
  },
  {
    q: 'How is GoPilot different from other study apps?',
    a: 'Most apps give you a question list. GoPilot gives you a full training environment: an ATC radio simulator with real phraseology, Learn Mode that tracks which questions you\'ve mastered and brings back ones you\'ve missed, ACS weak-area breakdowns so you know exactly where to focus, and curated video guides that match each exam topic.',
  },
  {
    q: 'Can I use this on my phone or tablet?',
    a: 'Yes. GoPilot is fully mobile-responsive and works on any modern browser — no app download required. It also installs as a PWA (Add to Home Screen) for an app-like experience on iOS and Android.',
  },
  {
    q: 'How accurate are the practice questions?',
    a: 'All questions come directly from the official FAA Private Pilot knowledge test question bank. They are identical in format to what appears on the actual test. Each question includes a detailed explanation of the correct answer and why the distractors are wrong, mapped to the specific ACS knowledge area.',
  },
  {
    q: 'Does my progress save between sessions?',
    a: 'Yes. Progress is saved to your browser automatically. If you sign in with Google, your progress syncs to the cloud so you can continue on any device.',
  },
  {
    q: 'I paid but Pro features aren\'t unlocked — what do I do?',
    a: 'Pro activation usually happens within a few seconds of payment. If features are still locked after 1 minute, try signing out and signing back in — this refreshes your account status. If the issue persists, contact us and we\'ll sort it out immediately.',
  },
];

/**
 * Accordion FAQ section rendered below the main app content.
 */
export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

  return (
    <section style={{
      maxWidth: 800, margin: '0 auto',
      padding: 'clamp(32px, 6vw, 60px) clamp(16px, 4vw, 32px)',
      fontFamily: "'Courier New', monospace",
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: '#3d5878', marginBottom: 10 }}>
          ◈ FREQUENTLY ASKED QUESTIONS ◈
        </div>
        <h2 style={{
          fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 900, letterSpacing: 2.5,
          color: '#f0f6ff', margin: 0,
        }}>
          QUESTIONS & ANSWERS
        </h2>
      </div>

      {/* Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {QUESTIONS.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              style={{
                background: isOpen ? 'rgba(0,255,136,0.03)' : 'rgba(255,255,255,0.015)',
                border: `1px solid ${isOpen ? 'rgba(0,255,136,0.18)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 10,
                overflow: 'hidden',
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              {/* Question row */}
              <button
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  padding: '16px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: "'Courier New', monospace",
                }}
              >
                <span style={{
                  fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
                  color: isOpen ? '#00ff88' : '#cfe2f7',
                  lineHeight: 1.45, transition: 'color 0.2s',
                }}>
                  {item.q}
                </span>
                <span style={{
                  fontSize: 14, color: isOpen ? '#00ff88' : '#3d5878',
                  flexShrink: 0, transition: 'transform 0.2s, color 0.2s',
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                  display: 'inline-block',
                }}>
                  +
                </span>
              </button>

              {/* Answer */}
              {isOpen && (
                <div style={{
                  padding: '0 20px 18px',
                  fontSize: 12, color: '#6a8aa4', lineHeight: 1.8,
                  animation: 'fadeSlide 0.2s ease',
                }}>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{
        textAlign: 'center', marginTop: 32,
        fontSize: 10, color: '#1e3248', letterSpacing: 1.5,
      }}>
        FOR TRAINING PURPOSES ONLY — NOT FOR USE IN ACTUAL FLIGHT OPERATIONS
      </div>
    </section>
  );
}

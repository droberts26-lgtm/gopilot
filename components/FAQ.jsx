'use client';

import { useState, useRef, useEffect } from 'react';

const QUESTIONS = [
  {
    q: 'What exam does GoPilot prepare me for?',
    a: 'GoPilot is built for the FAA Private Pilot Airman Knowledge Test (written exam). All 131 questions are drawn from the official FAA question bank (FAA-CT-8080-2H) and mapped to the Airman Certification Standards (ACS). The ATC simulator covers radio phraseology for student through commercial pilot operations.',
  },
  {
    q: "What's free vs. Pro?",
    a: 'Free: Quick Practice (10 random questions), student-level ATC scenarios, all Aviation Basics slideshows, and the first 2 videos per topic in the library. Pro ($14.99 one-time): Full 131-question test, Learn Mode (spaced-repetition mastery), Matching Mode, FAA Exam Timer, general and commercial ATC levels, and the complete 46-video library.',
  },
  {
    q: 'Is the $14.99 a subscription or one-time?',
    a: 'One-time payment. You pay $14.99 once and your Pro access is permanent — no recurring charges, no hidden fees. Access is tied to your Google account so it follows you across devices.',
  },
  {
    q: 'How is GoPilot different from other study apps?',
    a: "Most apps give you a question list. GoPilot gives you a full training environment: an ATC radio simulator with real phraseology, Learn Mode that tracks which questions you've mastered and brings back ones you've missed, ACS weak-area breakdowns so you know exactly where to focus, and curated video guides that match each exam topic.",
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
    q: "I paid but Pro features aren't unlocked — what do I do?",
    a: "Pro activation usually happens within a few seconds of payment. If features are still locked after 1 minute, try signing out and signing back in — this refreshes your account status. If the issue persists, contact us and we'll sort it out immediately.",
  },
];

/** Animated accordion item */
function FAQItem({ item, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div style={{
      border: `1px solid ${isOpen ? 'rgba(56,189,248,0.22)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 12,
      overflow: 'hidden',
      background: isOpen ? 'rgba(14,165,233,0.04)' : 'rgba(255,255,255,0.02)',
      transition: 'border-color 0.25s, background 0.25s',
    }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '18px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontSize: 14, fontWeight: 600,
          color: isOpen ? '#e2e8f0' : '#94a3b8',
          lineHeight: 1.45, transition: 'color 0.2s',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {item.q}
        </span>
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          border: `1px solid ${isOpen ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          color: isOpen ? '#38bdf8' : '#475569',
          fontSize: 14, fontWeight: 300, lineHeight: 1,
          transition: 'transform 0.25s ease, color 0.2s, border-color 0.2s',
          transform: isOpen ? 'rotate(45deg)' : 'none',
        }}>
          +
        </span>
      </button>

      {/* Animated height container */}
      <div style={{
        height: height,
        overflow: 'hidden',
        transition: 'height 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div ref={bodyRef} style={{
          padding: '0 22px 20px',
          fontSize: 14, color: '#64748b', lineHeight: 1.8,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {item.a}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

  return (
    <section style={{
      maxWidth: 800, margin: '0 auto',
      padding: 'clamp(40px, 7vw, 72px) clamp(16px, 4vw, 32px)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          fontSize: 11, letterSpacing: 2, color: '#0ea5e9', marginBottom: 12,
          fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, opacity: 0.8,
        }}>
          Got questions?
        </div>
        <h2 style={{
          fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 800,
          color: '#f1f5f9', margin: 0,
          fontFamily: "'Sora', system-ui, sans-serif",
          letterSpacing: '-0.5px',
        }}>
          Frequently Asked Questions
        </h2>
      </div>

      {/* Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {QUESTIONS.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            isOpen={openIdx === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        textAlign: 'center', marginTop: 36,
        fontSize: 11, color: '#1e3a5f', letterSpacing: 0.5,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        For training purposes only — not for use in actual flight operations
      </div>
    </section>
  );
}

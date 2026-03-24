'use client';

const REASONS = [
  {
    icon: '🎯',
    title: 'Real FAA Questions',
    description: 'Every question is pulled directly from the official FAA-CT-8080-2H question bank — identical in format to what appears on your actual written exam.',
    color: '#34d399',
    stat: '131',
    statLabel: 'official questions',
  },
  {
    icon: '🎙️',
    title: 'ATC Radio Simulator',
    description: 'The only study platform with an interactive ATC radio simulator using real phraseology from the FAA Aeronautical Information Manual.',
    color: '#38bdf8',
    stat: '45',
    statLabel: 'ATC scenarios',
  },
  {
    icon: '💳',
    title: 'Pay Once, Keep Forever',
    description: 'No subscription. $14.99 unlocks everything permanently. No recurring charges, no expiry — your access follows your Google account on every device.',
    color: '#a78bfa',
    stat: '$14.99',
    statLabel: 'one-time unlock',
  },
];

export default function WhyGoPilot() {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Background photo with overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(/cockpit.avif)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundColor: '#0a1628',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(6,9,17,0.95) 0%, rgba(10,22,40,0.92) 50%, rgba(6,9,17,0.96) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto',
        padding: 'clamp(48px, 8vw, 88px) clamp(16px, 4vw, 32px)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 800,
            color: '#f1f5f9', margin: '0 0 14px',
            fontFamily: "'Sora', system-ui, sans-serif", letterSpacing: '-0.4px',
          }}>
            Why student pilots choose GoPilot
          </h2>
          <p style={{
            fontSize: 15, color: '#475569', maxWidth: 440, margin: '0 auto',
            fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1.7,
          }}>
            Built specifically for the FAA Private Pilot written exam. Not a generic quiz app.
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: 20,
        }}>
          {REASONS.map(r => (
            <div
              key={r.title}
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '30px 26px',
                display: 'flex', flexDirection: 'column', gap: 0,
                transition: 'transform 0.2s, border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = `${r.color}38`;
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16, lineHeight: 1 }}>{r.icon}</div>
              {/* Stat */}
              <div style={{
                fontSize: 28, fontWeight: 800, color: r.color, lineHeight: 1, marginBottom: 4,
                fontFamily: "'Sora', system-ui, sans-serif",
              }}>
                {r.stat}
              </div>
              <div style={{
                fontSize: 10, color: r.color, letterSpacing: 1, marginBottom: 14,
                fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, opacity: 0.7,
              }}>
                {r.statLabel.toUpperCase()}
              </div>
              <div style={{
                fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 10,
                fontFamily: "'Sora', system-ui, sans-serif", letterSpacing: '-0.2px',
              }}>
                {r.title}
              </div>
              <p style={{
                fontSize: 13.5, color: '#64748b', lineHeight: 1.7, margin: 0,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}>
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

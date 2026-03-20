'use client';

const FEATURES = [
  {
    id: 'atc',
    title: 'ATC Radio Simulator',
    color: '#38bdf8',
    emoji: '📡',
    photo: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80&fit=crop&crop=center',
    fallback: '#051525',
    tagline: 'Sound like a real pilot',
    description: 'Practice real ATC radio communications across 45 scenarios — from student call-ups to commercial IFR clearances. Audio-based, phraseology-accurate.',
    bullets: ['45 ATC scenarios across 3 levels', 'Official FAA AIM phraseology', 'Instant readback feedback'],
    freeBadge: 'Free — Student pilot level',
    proBadge: 'Pro — General & Commercial levels',
  },
  {
    id: 'knowledge',
    title: 'Airman Knowledge Test',
    color: '#f59e0b',
    emoji: '📋',
    photo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop&crop=center',
    fallback: '#1a1000',
    tagline: 'All 131 official FAA questions',
    description: 'Study with the complete official FAA question bank. Detailed explanations, spaced-repetition Learn Mode, and ACS weak-area analytics show you exactly where to focus.',
    bullets: ['131 official FAA-CT-8080-2H questions', 'Learn Mode mastery tracking', 'ACS weak-area score breakdown'],
    freeBadge: 'Free — Quick Practice (10 questions)',
    proBadge: 'Pro — Full test + Learn Mode + Timer',
  },
  {
    id: 'basics',
    title: 'Aviation Basics',
    color: '#34d399',
    emoji: '🛩️',
    photo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80&fit=crop&crop=center',
    fallback: '#061a0e',
    tagline: 'Visual learning for new pilots',
    description: '9 visual slideshow topics covering aerodynamics, weather, navigation, airspace, and more. Designed for complete beginners starting from zero.',
    bullets: ['9 illustrated slideshow topics', 'Covers aerodynamics, weather, nav', 'Airport operations & airspace'],
    freeBadge: 'Free — All 9 topics included',
    proBadge: null,
  },
  {
    id: 'videos',
    title: 'Video Library',
    color: '#818cf8',
    emoji: '▶',
    photo: 'https://images.unsplash.com/photo-1569074187119-c87815b476da?w=800&q=80&fit=crop&crop=center',
    fallback: '#0d0a1e',
    tagline: '46 curated FAA training videos',
    description: 'Expert-curated YouTube videos matched to every FAA knowledge exam topic — organized by subject, searchable, and watch-progress tracked.',
    bullets: ['46 curated videos across 14 topics', 'Matched to FAA exam subjects', 'Watch progress tracked'],
    freeBadge: 'Free — First 2 videos per topic',
    proBadge: 'Pro — Full 46-video library',
  },
];

export default function FeatureShowcase({ onNavigate }) {
  return (
    <section style={{
      padding: 'clamp(48px, 8vw, 88px) clamp(16px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{
            fontSize: 11, letterSpacing: 2.5, color: '#0ea5e9', marginBottom: 14,
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, opacity: 0.8,
          }}>
            Everything you need to pass
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800,
            color: '#f1f5f9', margin: '0 0 16px',
            fontFamily: "'Sora', system-ui, sans-serif", letterSpacing: '-0.5px',
          }}>
            Four training tools. One platform.
          </h2>
          <p style={{
            fontSize: 15, color: '#475569', maxWidth: 480, margin: '0 auto',
            fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1.75,
          }}>
            GoPilot covers every aspect of FAA Private Pilot exam prep — from radio communications to knowledge questions to video lessons.
          </p>
        </div>

        {/* Feature grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(248px, 1fr))',
          gap: 18,
        }}>
          {FEATURES.map(f => (
            <div
              key={f.id}
              onClick={() => onNavigate?.(f.id)}
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                background: f.fallback,
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.22s ease, border-color 0.22s, box-shadow 0.22s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = `${f.color}45`;
                e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${f.color}10`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Photo area */}
              <div style={{
                height: 200,
                position: 'relative',
                backgroundImage: `url(${f.photo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: f.fallback,
              }}>
                {/* Dark gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)',
                }} />
                {/* Color accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${f.color}, ${f.color}80)`,
                }} />
                {/* Icon bottom-left */}
                <div style={{
                  position: 'absolute', bottom: 14, left: 16,
                  fontSize: 30, lineHeight: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                }}>
                  {f.emoji}
                </div>
                {/* Title overlay */}
                <div style={{
                  position: 'absolute', bottom: 14, left: 58, right: 16,
                  fontSize: 15, fontWeight: 700, color: '#f1f5f9',
                  fontFamily: "'Sora', system-ui, sans-serif",
                  lineHeight: 1.2, letterSpacing: '-0.2px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}>
                  {f.title}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '18px 18px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontSize: 11, color: f.color, fontWeight: 600, marginBottom: 10,
                  fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: 0.3,
                }}>
                  {f.tagline}
                </div>
                <p style={{
                  fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: '0 0 16px',
                  fontFamily: "'Inter', system-ui, sans-serif", flex: 1,
                }}>
                  {f.description}
                </p>

                {/* Bullet points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {f.bullets.map(b => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: f.color, flexShrink: 0, opacity: 0.8,
                      }} />
                      <span style={{
                        fontSize: 12, color: '#94a3b8',
                        fontFamily: "'Inter', system-ui, sans-serif",
                      }}>
                        {b}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Access badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                  <div style={{
                    fontSize: 10.5, fontWeight: 600,
                    color: '#64748b', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 6, padding: '5px 10px', alignSelf: 'flex-start',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}>
                    ✓ {f.freeBadge}
                  </div>
                  {f.proBadge && (
                    <div style={{
                      fontSize: 10.5, fontWeight: 600,
                      color: f.color, background: `${f.color}12`,
                      border: `1px solid ${f.color}28`,
                      borderRadius: 6, padding: '5px 10px', alignSelf: 'flex-start',
                      fontFamily: "'Inter', system-ui, sans-serif",
                    }}>
                      ★ {f.proBadge}
                    </div>
                  )}
                </div>

                {/* Launch CTA */}
                <div style={{
                  marginTop: 'auto',
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 700, color: f.color,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  letterSpacing: 0.3,
                }}>
                  Open {f.title} →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

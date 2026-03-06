'use client';

import { useState } from 'react';

const GREEN  = '#00ff88';

const FEATURES = [
  {
    icon: '📡',
    label: 'ATC COMMS',
    color: '#38bdf8',
    desc: 'Real radio phraseology drills across 45 scenarios — student, general, and commercial levels.',
  },
  {
    icon: '📋',
    label: 'AIRMAN KNOWLEDGE',
    color: '#f59e0b',
    desc: '131 FAA exam questions with full test, quick practice, and a mastery learn mode.',
  },
  {
    icon: '🛩️',
    label: 'AVIATION BASICS',
    color: '#34d399',
    desc: 'Visual slideshows covering airspace, weather, aerodynamics, and instruments.',
  },
  {
    icon: '▶',
    label: 'VIDEOS',
    color: '#818cf8',
    desc: '46 curated training videos organized by FAA ACS topic area.',
  },
];

// Radar blip positions (decorative)
const BLIPS = [
  { top: '26%', left: '64%', size: 6, delay: '0s'   },
  { top: '60%', left: '36%', size: 4, delay: '0.8s' },
  { top: '38%', left: '22%', size: 5, delay: '1.5s' },
];

export default function SplashScreen({ onEnter }) {
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onEnter, 380);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: '#070b12',
        fontFamily: "'Courier New', monospace",
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 0.38s ease',
      }}
    >
      {/* ── Background grid ── */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.028, pointerEvents: 'none',
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, #00ff88 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, #00ff88 40px)
        `,
      }} />

      {/* ── Ambient glow ── */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at top, rgba(0,255,136,0.045) 0%, transparent 68%)',
      }} />

      {/* ── Corner HUD ── */}
      <div style={{
        position: 'fixed', top: 22, left: 24,
        fontSize: 9, letterSpacing: 2.5, color: '#1a2e44', lineHeight: 2,
        animation: 'fadeSlide 0.5s ease 0.05s both',
      }}>
        <div>LAT: 38°53′43″ N</div>
        <div>LON: 77°02′12″ W</div>
        <div>ELEV: 10,500 FT MSL</div>
      </div>
      <div style={{
        position: 'fixed', top: 22, right: 24, textAlign: 'right',
        fontSize: 9, letterSpacing: 2.5, color: '#1a2e44', lineHeight: 2,
        animation: 'fadeSlide 0.5s ease 0.05s both',
      }}>
        <div>SQUAWK: 1200</div>
        <div>MODE C: ON</div>
        <div>ADS-B: TX / RX</div>
      </div>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px 32px',
        position: 'relative', zIndex: 1,
        maxWidth: 860, margin: '0 auto', width: '100%',
      }}>

        {/* ── Radar circle ── */}
        <div style={{
          position: 'relative', width: 200, height: 200,
          marginBottom: 50, flexShrink: 0,
          animation: 'fadeSlide 0.6s ease 0.15s both',
        }}>
          {/* Concentric rings */}
          {[1, 0.72, 0.46, 0.22].map((scale, i) => (
            <div key={i} style={{
              position: 'absolute',
              top:  `${(1 - scale) * 50}%`,
              left: `${(1 - scale) * 50}%`,
              width:  `${scale * 100}%`,
              height: `${scale * 100}%`,
              border: `1px solid rgba(0,255,136,${0.07 + i * 0.05})`,
              borderRadius: '50%',
            }} />
          ))}

          {/* Crosshairs */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', height: 1, background: 'rgba(0,255,136,0.06)' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 1, height: '100%', background: 'rgba(0,255,136,0.06)' }} />
          </div>

          {/* Rotating sweep */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 295deg, rgba(0,255,136,0.08) 330deg, rgba(0,255,136,0.28) 360deg)',
            animation: 'radarSweep 4s linear infinite',
          }} />

          {/* Outer glow ring */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1px solid rgba(0,255,136,0.14)',
            boxShadow: '0 0 32px rgba(0,255,136,0.04)',
          }} />

          {/* Center dot */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 7, height: 7, borderRadius: '50%',
            background: GREEN, boxShadow: `0 0 12px ${GREEN}`,
          }} />

          {/* Blips */}
          {BLIPS.map((b, i) => (
            <div key={i} style={{
              position: 'absolute', top: b.top, left: b.left,
              width: b.size, height: b.size, borderRadius: '50%',
              background: GREEN, boxShadow: `0 0 6px ${GREEN}`,
              animation: `pulse 2.2s ease ${b.delay} infinite`,
            }} />
          ))}

          {/* Status label */}
          <div style={{
            position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: GREEN, animation: 'pulse 1.6s ease infinite',
            }} />
            <span style={{ fontSize: 8.5, letterSpacing: 3.5, color: GREEN, opacity: 0.65 }}>
              SYSTEMS ONLINE
            </span>
          </div>
        </div>

        {/* ── Title ── */}
        <div style={{
          textAlign: 'center', marginBottom: 6,
          animation: 'fadeSlide 0.6s ease 0.38s both',
        }}>
          <div style={{
            display: 'flex', alignItems: 'baseline',
            justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 'clamp(46px, 9vw, 74px)',
              fontWeight: 900, letterSpacing: 5, color: '#f0f6ff',
            }}>GO</span>
            <span style={{
              fontSize: 'clamp(46px, 9vw, 74px)',
              fontWeight: 900, letterSpacing: 5, color: GREEN,
              textShadow: `0 0 48px ${GREEN}44`,
            }}>PILOT</span>
          </div>
          <div style={{ fontSize: 10, letterSpacing: 7, color: '#3d5878', marginTop: 5 }}>
            AVIATION TRAINING SIMULATOR
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{
          width: 240, height: 1, margin: '20px 0 24px',
          background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.22), transparent)',
          animation: 'fadeSlide 0.5s ease 0.52s both',
        }} />

        {/* ── Description ── */}
        <p style={{
          textAlign: 'center', color: '#6a8aa4', fontSize: 13.5,
          lineHeight: 1.85, maxWidth: 560, marginBottom: 42,
          animation: 'fadeSlide 0.6s ease 0.62s both',
        }}>
          The complete digital co-pilot for the{' '}
          <span style={{ color: '#cfe2f7' }}>FAA Private Pilot written exam</span>.
          Drill real ATC radio calls, quiz yourself on 131 knowledge questions,
          explore visual concept slideshows, and study with 46 curated training videos —
          all in one purpose-built training environment.
        </p>

        {/* ── Feature cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(176px, 1fr))',
          gap: 12, width: '100%', marginBottom: 48,
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              style={{
                background: `${f.color}09`,
                border: `1px solid ${f.color}24`,
                borderRadius: 10, padding: '18px 16px',
                animation: `fadeSlide 0.5s ease ${0.72 + i * 0.1}s both`,
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 9 }}>{f.icon}</div>
              <div style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: 1.8,
                color: f.color, marginBottom: 7,
              }}>
                {f.label}
              </div>
              <div style={{ fontSize: 11, color: '#5a7a94', lineHeight: 1.65 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ animation: 'fadeSlide 0.6s ease 1.14s both', textAlign: 'center' }}>
          <button
            onClick={handleEnter}
            style={{
              background: `linear-gradient(135deg, ${GREEN}18, ${GREEN}08)`,
              border: `1px solid ${GREEN}55`,
              borderRadius: 10, padding: '15px 52px',
              color: GREEN, fontSize: 12, fontWeight: 700, letterSpacing: 3,
              fontFamily: "'Courier New', monospace",
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${GREEN}28, ${GREEN}12)`;
              e.currentTarget.style.boxShadow = `0 0 28px ${GREEN}22`;
              e.currentTarget.style.borderColor = `${GREEN}88`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${GREEN}18, ${GREEN}08)`;
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = `${GREEN}55`;
            }}
          >
            ▶&nbsp;&nbsp;INITIALIZE TRAINING
          </button>
          <div style={{
            marginTop: 14, fontSize: 9, letterSpacing: 2.5, color: '#1a2e44',
          }}>
            FOR STUDY USE ONLY — NOT FOR ACTUAL FLIGHT OPERATIONS
          </div>
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.025)',
        padding: '10px 20px',
        display: 'flex', justifyContent: 'center',
        flexWrap: 'wrap', gap: '8px 20px',
        animation: 'fadeSlide 0.5s ease 1.3s both',
      }}>
        {['FAA AIM', 'ORDER 7110.65', 'FAA-CT-8080-2H', 'PRIVATE PILOT ACS'].map(item => (
          <span key={item} style={{ fontSize: 8, letterSpacing: 2.5, color: '#192838' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

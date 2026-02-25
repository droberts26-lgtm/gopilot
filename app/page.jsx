'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const ATCSimulator    = dynamic(() => import('@/components/ATCSimulator'),    { ssr: false });
const AirmanKnowledge = dynamic(() => import('@/components/AirmanKnowledge'), { ssr: false });

const TABS = [
  {
    id: 'atc',
    label: 'ATC COMMS',
    icon: '📡',
    color: '#38bdf8',
    desc: 'Radio communications & phraseology',
  },
  {
    id: 'knowledge',
    label: 'AIRMAN KNOWLEDGE',
    icon: '📋',
    color: '#f59e0b',
    desc: 'FAA Private Pilot written exam prep',
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('atc');

  return (
    <div style={{ minHeight: '100vh', background: '#070b12', position: 'relative', overflow: 'hidden' }}>

      {/* ── Background grid ── */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.028, pointerEvents: 'none',
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, #00ff88 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, #00ff88 40px)
        `,
      }} />

      {/* ── Radar sweep ── */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        width: '200vw', height: '200vh',
        marginLeft: '-100vw', marginTop: '-100vh',
        background: 'conic-gradient(from 0deg, transparent 345deg, rgba(0,255,136,0.018) 360deg)',
        animation: 'radarSweep 9s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* ── Scan line ── */}
      <div style={{
        position: 'fixed', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.07), transparent)',
        animation: 'scanLine 8s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* ── Header ── */}
      <header style={{
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(7,11,18,0.8)',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18, paddingBottom: 16 }}>
            {/* Logo */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{
                  fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, letterSpacing: 2,
                  color: '#f0f6ff', fontFamily: "'Courier New', monospace",
                }}>
                  GO<span style={{ color: '#00ff88' }}>PILOT</span>
                </span>
                <span style={{
                  fontSize: 8, letterSpacing: 4, color: '#1a2d44', fontFamily: "'Courier New', monospace",
                }}>
                  v1.0
                </span>
              </div>
              <div style={{ fontSize: 9, letterSpacing: 3.5, color: '#1a2d44', marginTop: 1 }}>
                AVIATION TRAINING SIMULATOR
              </div>
            </div>

            {/* Status lights */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {['SYS', 'NAV', 'COM'].map((label, i) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: ['#00ff88', '#38bdf8', '#f59e0b'][i],
                    animation: `pulse ${2 + i * 0.5}s ease infinite`,
                    opacity: 0.8,
                  }} />
                  <span style={{ fontSize: 7.5, letterSpacing: 2, color: '#1a2d44' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: 0, marginTop: 4 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? `${tab.color}10` : 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                  padding: '10px 22px 12px',
                  cursor: 'pointer',
                  color: activeTab === tab.id ? tab.color : '#2d4255',
                  fontFamily: "'Courier New', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  transition: 'all 0.18s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
                onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = tab.color; }}
                onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#2d4255'; }}
              >
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Tab description strip ── */}
      <div style={{
        background: 'rgba(255,255,255,0.008)', borderBottom: '1px solid rgba(255,255,255,0.03)',
        padding: '8px 0',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          {TABS.map(tab => (
            activeTab === tab.id && (
              <div key={tab.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: tab.color, animation: 'pulse 2s ease infinite' }} />
                <span style={{ fontSize: 10, letterSpacing: 2.5, color: tab.color, opacity: 0.7 }}>
                  {tab.desc.toUpperCase()}
                </span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {activeTab === 'atc'       && <ATCSimulator />}
        {activeTab === 'knowledge' && <AirmanKnowledge />}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.03)',
        padding: '18px 20px',
        textAlign: 'center',
        marginTop: 40,
      }}>
        <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#0d1724' }}>
          GOPILOT · FAA AIM · ORDER 7110.65 · FAA-CT-8080-2H · PRIVATE PILOT ACS
        </div>
        <div style={{ fontSize: 8, letterSpacing: 2, color: '#0a1520', marginTop: 4 }}>
          FOR TRAINING PURPOSES ONLY — NOT FOR USE IN ACTUAL FLIGHT OPERATIONS
        </div>
      </footer>
    </div>
  );
}

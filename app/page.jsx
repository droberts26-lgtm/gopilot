'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import UserMenu from '@/components/UserMenu';
import HeroSection from '@/components/HeroSection';
import FeatureShowcase from '@/components/FeatureShowcase';
import WhyGoPilot from '@/components/WhyGoPilot';
import FAQ from '@/components/FAQ';
import OnboardingModal from '@/components/OnboardingModal';
import ProModal from '@/components/ProModal';
import { useProgressSync } from '@/hooks/useProgressSync';
import { usePro } from '@/hooks/usePro';
import ParticleField from '@/components/ParticleField';

const ATCSimulator     = dynamic(() => import('@/components/ATCSimulator'),     { ssr: false });
const AirmanKnowledge  = dynamic(() => import('@/components/AirmanKnowledge'),  { ssr: false });
const Part107Knowledge = dynamic(() => import('@/components/Part107Knowledge'), { ssr: false });
const AviationBasics   = dynamic(() => import('@/components/AviationBasics'),   { ssr: false });
const VideoLibrary     = dynamic(() => import('@/components/VideoLibrary'),     { ssr: false });

const TABS = [
  {
    id: 'home',
    label: 'HOME',
    icon: '⌂',
    color: '#94a3b8',
    desc: '',
  },
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
  {
    id: 'part107',
    label: 'PART 107',
    icon: '🚁',
    color: '#22d3ee',
    desc: 'FAA Part 107 Remote Pilot knowledge test prep',
  },
  {
    id: 'basics',
    label: 'AVIATION BASICS',
    icon: '🛩️',
    color: '#34d399',
    desc: 'Visual slideshows covering core aviation concepts for beginners',
  },
  {
    id: 'videos',
    label: 'VIDEOS',
    icon: '▶',
    color: '#818cf8',
    desc: 'Curated YouTube videos for every FAA knowledge exam topic',
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('home');
  const [proModalOpen, setProModalOpen] = useState(false);
  const { pro, loading: proLoading } = usePro();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  useProgressSync();

  return (
    <div style={{ minHeight: '100vh', background: '#060911', position: 'relative', overflow: 'hidden' }}>
      <ParticleField />

      {/* ── Ambient glow — subtle depth, not a radar ── */}
      <div style={{
        position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '80vw', height: '60vh',
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.06) 0%, transparent 70%)',
        animation: 'driftGlow 12s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* ── Header ── */}
      <header style={{
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(6,9,17,0.88)',
        backdropFilter: 'blur(14px)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(12px, 3vw, 20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 15, paddingBottom: 13 }}>
            {/* Logo */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{
                  fontSize: 'clamp(20px, 3.5vw, 27px)', fontWeight: 800,
                  color: '#f1f5f9', fontFamily: "'Sora', system-ui, sans-serif",
                  letterSpacing: '-0.3px', lineHeight: 1,
                }}>
                  Go<span style={{ color: '#0ea5e9' }}>Pilot</span>
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: 1.5,
                  color: '#0ea5e9', background: 'rgba(14,165,233,0.1)',
                  border: '1px solid rgba(14,165,233,0.18)',
                  borderRadius: 4, padding: '2px 7px',
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}>
                  BETA
                </span>
              </div>
              <div style={{
                fontSize: 9.5, color: '#334155', marginTop: 3, letterSpacing: 1,
                fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
              }}>
                Aviation Training Simulator
              </div>
            </div>

            {/* User menu */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {session
                ? <UserMenu user={session.user} />
                : (
                  <button
                    onClick={() => signIn('google')}
                    style={{
                      padding: '7px 16px',
                      background: 'rgba(14,165,233,0.08)',
                      border: '1px solid rgba(14,165,233,0.2)',
                      borderRadius: 8,
                      color: '#38bdf8',
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: 12, fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(14,165,233,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(14,165,233,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(14,165,233,0.2)';
                    }}
                  >
                    Sign In
                  </button>
                )
              }
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-bar-wrapper" data-tab-bar>
          <div style={{
            display: 'flex', gap: 0, marginTop: 2,
            overflowX: 'auto', WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                  padding: '10px clamp(12px, 3vw, 24px) 12px',
                  cursor: 'pointer',
                  color: activeTab === tab.id ? tab.color : '#475569',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 'clamp(11px, 2vw, 12px)',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#94a3b8'; }}
                onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#475569'; }}
              >
                <span style={{ fontSize: 13 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          </div>{/* end tab-bar-wrapper */}
        </div>
      </header>

      {/* ── Tab description strip (hidden on home) ── */}
      {activeTab !== 'home' && (
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          padding: '7px 0',
          background: 'rgba(255,255,255,0.006)',
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
            {TABS.map(tab => (
              activeTab === tab.id && tab.desc && (
                <div key={tab.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: tab.color }} />
                  <span style={{
                    fontSize: 11, color: '#475569',
                    fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
                  }}>
                    {tab.desc}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* ── Home landing page ── */}
      {activeTab === 'home' && (
        <>
          <HeroSection onUnlockPro={() => setProModalOpen(true)} onNavigate={setActiveTab} pro={pro} proLoading={proLoading} />
          <FeatureShowcase onNavigate={setActiveTab} />
          <WhyGoPilot />
          <FAQ />
        </>
      )}

      {/* ── Training tools ── */}
      {activeTab !== 'home' && (
        <main style={{ position: 'relative', zIndex: 1 }}>
          {activeTab === 'atc'       && <ATCSimulator pro={pro} proLoading={proLoading} />}
          {activeTab === 'knowledge' && <AirmanKnowledge pro={pro} proLoading={proLoading} />}
          {activeTab === 'part107'   && <Part107Knowledge pro={pro} proLoading={proLoading} />}
          {activeTab === 'basics'    && <AviationBasics />}
          {activeTab === 'videos'    && <VideoLibrary pro={pro} proLoading={proLoading} />}
        </main>
      )}

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.03)',
        padding: '18px 20px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 11, color: '#1e3a5f', marginBottom: 10,
          fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
        }}>
          GoPilot · Based on FAA-CT-8080-2H · Private Pilot ACS
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <a href="/privacy" style={{
            fontSize: 11, color: '#1e3a5f', textDecoration: 'none',
            fontFamily: "'Inter', system-ui, sans-serif",
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#475569'}
            onMouseLeave={e => e.currentTarget.style.color = '#1e3a5f'}>
            Privacy Policy
          </a>
          <a href="/terms" style={{
            fontSize: 11, color: '#1e3a5f', textDecoration: 'none',
            fontFamily: "'Inter', system-ui, sans-serif",
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#475569'}
            onMouseLeave={e => e.currentTarget.style.color = '#1e3a5f'}>
            Terms of Service
          </a>
        </div>
      </footer>

      {/* ── Onboarding (first visit) ── */}
      <OnboardingModal />

      {/* ── Pro modal (hero CTA) ── */}
      {proModalOpen && <ProModal onClose={() => setProModalOpen(false)} />}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { VIDEO_TOPICS, TOTAL_VIDEOS } from '@/data/videoLibrary';
import ProModal from '@/components/ProModal';

const ACCENT = '#818cf8';
const FREE_VIDEOS_PER_TOPIC = 2;
const WATCHED_KEY = 'gopilot_watched_videos';
const UPSELL_AFTER_WATCHED = 3; // show post-watch banner after N free videos watched

const POPULAR_TOPICS = new Set([
  'weather-basics', 'airspace', 'navigation', 'aerodynamics-stalls', 'adm-human-factors',
]);

// ── localStorage helpers ───────────────────────────────────────────────────────

function loadWatched() {
  try { return new Set(JSON.parse(localStorage.getItem(WATCHED_KEY) || '[]')); }
  catch { return new Set(); }
}

function saveWatched(set) {
  try { localStorage.setItem(WATCHED_KEY, JSON.stringify([...set])); } catch {}
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function thumbUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function embedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

// IDs of all videos that are free (first FREE_VIDEOS_PER_TOPIC per topic)
const FREE_VIDEO_IDS = new Set(
  VIDEO_TOPICS.flatMap(t => t.videos.slice(0, FREE_VIDEOS_PER_TOPIC).map(v => v.id))
);

// ── Topic grid ────────────────────────────────────────────────────────────────

function TopicGrid({ watchedIds, onSelect }) {
  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 20px', animation: 'fadeSlide 0.4s ease' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: ACCENT, marginBottom: 8, opacity: 0.8 }}>
          ◈ VISUAL LEARNING LIBRARY ◈
        </div>
        <h2 style={{
          fontSize: 22, fontWeight: 900, letterSpacing: 3, color: '#f0f6ff',
          fontFamily: "'Courier New', monospace", margin: '0 0 12px',
        }}>
          VIDEO STUDY GUIDES
        </h2>
        <p style={{ color: '#6a8aa4', fontSize: 13, lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
          Curated short videos covering every topic on the FAA Private Pilot knowledge exam.{' '}
          <strong style={{ color: ACCENT }}>{TOTAL_VIDEOS} videos</strong> across{' '}
          <strong style={{ color: ACCENT }}>{VIDEO_TOPICS.length} topics</strong>.
        </p>
      </div>

      {/* Topic cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 14,
      }}>
        {VIDEO_TOPICS.map((topic, i) => (
          <TopicCard key={topic.id} topic={topic} watchedIds={watchedIds} onClick={() => onSelect(i)} />
        ))}
      </div>
    </div>
  );
}

function TopicCard({ topic, watchedIds, onClick }) {
  const [hovered, setHovered] = useState(false);
  const watchedCount = topic.videos.filter(v => watchedIds.has(v.id)).length;
  const isPopular = POPULAR_TOPICS.has(topic.id);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(129,140,248,0.09)' : 'rgba(129,140,248,0.04)',
        border: `1px solid ${hovered ? 'rgba(129,140,248,0.35)' : 'rgba(129,140,248,0.14)'}`,
        borderRadius: 12,
        padding: '20px 18px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.18s',
        fontFamily: "'Courier New', monospace",
        width: '100%',
        transform: hovered ? 'translateY(-2px)' : 'none',
        position: 'relative',
      }}
    >
      {isPopular && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(0,255,136,0.1)',
          border: '1px solid rgba(0,255,136,0.25)',
          borderRadius: 20, padding: '2px 8px',
          fontSize: 8.5, letterSpacing: 1.5, color: '#00ff88', fontWeight: 700,
        }}>
          ★ POPULAR
        </div>
      )}

      <div style={{ fontSize: 30, marginBottom: 10 }}>{topic.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: ACCENT, marginBottom: 6 }}>
        {topic.title.toUpperCase()}
      </div>
      <div style={{ fontSize: 11, color: '#6a8aa4', lineHeight: 1.65, marginBottom: 12 }}>
        {topic.desc}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(129,140,248,0.12)',
          border: '1px solid rgba(129,140,248,0.22)',
          borderRadius: 20, padding: '2px 10px',
          fontSize: 9.5, letterSpacing: 1.5, color: ACCENT,
        }}>
          {topic.videos.length} VIDEO{topic.videos.length > 1 ? 'S' : ''}
        </div>
        {watchedCount > 0 && (
          <div style={{ fontSize: 9, color: '#00ff88', letterSpacing: 1 }}>
            {watchedCount}/{topic.videos.length} WATCHED
          </div>
        )}
      </div>

      {/* Progress bar */}
      {watchedCount > 0 && (
        <div style={{ marginTop: 8, height: 2, background: 'rgba(129,140,248,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${(watchedCount / topic.videos.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00ff88, #818cf8)',
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }} />
        </div>
      )}
    </button>
  );
}

// ── Topic detail (list of videos) ─────────────────────────────────────────────

function TopicView({ topic, pro, proLoading, watchedIds, onBack, onPlay, onUnlock, upsellBanner }) {
  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 20px', animation: 'fadeSlide 0.3s ease' }}>

      {/* Back */}
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: ACCENT, fontSize: 11, letterSpacing: 2,
          fontFamily: "'Courier New', monospace",
          padding: '0 0 28px', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        ← ALL TOPICS
      </button>

      {/* Post-watch upsell banner */}
      {upsellBanner && !pro && (
        <div style={{
          background: 'rgba(129,140,248,0.08)',
          border: '1px solid rgba(129,140,248,0.28)',
          borderRadius: 10, padding: '14px 20px',
          marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
          animation: 'fadeSlide 0.3s ease',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#cfe2f7', marginBottom: 3 }}>
              KEEP LEARNING
            </div>
            <div style={{ fontSize: 11, color: '#4a6a84', letterSpacing: 1, lineHeight: 1.5 }}>
              You've watched {UPSELL_AFTER_WATCHED}+ free videos. Unlock all {TOTAL_VIDEOS} for $14.99.
            </div>
          </div>
          <button
            onClick={onUnlock}
            style={{
              background: 'rgba(129,140,248,0.18)',
              border: '1px solid rgba(129,140,248,0.45)',
              borderRadius: 7, padding: '8px 18px',
              color: ACCENT, fontSize: 10, letterSpacing: 1.5, fontWeight: 700,
              fontFamily: "'Courier New', monospace", cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            UNLOCK PRO →
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 38, marginBottom: 10 }}>{topic.icon}</div>
        <h2 style={{
          fontSize: 19, fontWeight: 900, letterSpacing: 2.5, color: '#f0f6ff',
          fontFamily: "'Courier New', monospace", margin: '0 0 8px',
        }}>
          {topic.title.toUpperCase()}
        </h2>
        <p style={{ color: '#6a8aa4', fontSize: 13, margin: 0 }}>{topic.desc}</p>
      </div>

      {/* Video cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 20,
      }}>
        {topic.videos.map((video, idx) => {
          const locked = idx >= FREE_VIDEOS_PER_TOPIC && !pro && !proLoading;
          return locked
            ? <LockedVideoCard key={video.id} video={video} onUnlock={onUnlock} />
            : <VideoCard key={video.id} video={video} watched={watchedIds.has(video.id)} onPlay={onPlay} />;
        })}
      </div>
    </div>
  );
}

// ── Video cards ───────────────────────────────────────────────────────────────

function VideoCard({ video, watched, onPlay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: 10, overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(129,140,248,0.4)' : 'rgba(129,140,248,0.14)'}`,
        background: 'rgba(7,11,18,0.7)',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Play: ${video.title}`}
        onClick={() => onPlay(video.id, video.title)}
        onKeyDown={e => e.key === 'Enter' && onPlay(video.id, video.title)}
        style={{
          position: 'relative', cursor: 'pointer',
          aspectRatio: '16 / 9', overflow: 'hidden', background: '#0a1520',
        }}
      >
        <img
          src={thumbUrl(video.id)}
          alt={video.title}
          onError={e => { e.target.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Watched badge */}
        {watched && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,255,136,0.85)', borderRadius: 20,
            padding: '2px 8px', fontSize: 8.5, letterSpacing: 1, color: '#000', fontWeight: 700,
            fontFamily: "'Courier New', monospace",
          }}>
            ✓ WATCHED
          </div>
        )}
        {/* Play overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: hovered ? ACCENT : 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
            boxShadow: hovered ? `0 0 18px ${ACCENT}55` : 'none',
          }}>
            <span style={{ color: '#fff', fontSize: 20, paddingLeft: 3 }}>▶</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{
          fontSize: 12.5, fontWeight: 600, color: '#cfe2f7',
          lineHeight: 1.45, marginBottom: 10,
        }}>
          {video.title}
        </div>
        <button
          onClick={() => onPlay(video.id, video.title)}
          style={{
            background: 'rgba(129,140,248,0.12)',
            border: '1px solid rgba(129,140,248,0.28)',
            borderRadius: 6,
            color: ACCENT, fontSize: 9.5, letterSpacing: 1.5,
            fontFamily: "'Courier New', monospace",
            padding: '5px 14px', cursor: 'pointer', fontWeight: 700,
          }}
        >
          ▶ WATCH
        </button>
      </div>
    </div>
  );
}

function LockedVideoCard({ video, onUnlock }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: 10, overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(129,140,248,0.28)' : 'rgba(129,140,248,0.08)'}`,
        background: 'rgba(7,11,18,0.7)',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Blurred thumbnail with lock */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#0a1520' }}>
        <img
          src={thumbUrl(video.id)}
          alt={video.title}
          onError={e => { e.target.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'blur(5px) brightness(0.3)' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <div style={{ fontSize: 28 }}>🔒</div>
          <div style={{
            fontSize: 9.5, letterSpacing: 2, color: '#cfe2f7', fontWeight: 700,
            fontFamily: "'Courier New', monospace",
          }}>
            PRO VIDEO
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <button
          onClick={onUnlock}
          style={{
            background: 'rgba(129,140,248,0.08)',
            border: '1px solid rgba(129,140,248,0.28)',
            borderRadius: 6,
            color: ACCENT, fontSize: 9.5, letterSpacing: 1.5,
            fontFamily: "'Courier New', monospace",
            padding: '5px 14px', cursor: 'pointer', fontWeight: 700,
            width: '100%',
          }}
        >
          🔒 UNLOCK PRO — $14.99
        </button>
      </div>
    </div>
  );
}

// ── Video player modal ────────────────────────────────────────────────────────

function PlayerModal({ videoId, videoTitle, pro, totalFreeWatched, onClose, onUnlock }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Playing: ${videoTitle}`}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeSlide 0.25s ease',
      }}
    >
      <div
        style={{ width: '100%', maxWidth: 820, position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Title + close */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <div style={{
            fontSize: 11.5, color: '#cfe2f7', letterSpacing: 1,
            fontFamily: "'Courier New', monospace",
            maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {videoTitle}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6,
              cursor: 'pointer', color: '#cfe2f7', fontSize: 10, letterSpacing: 1.5,
              fontFamily: "'Courier New', monospace", padding: '4px 12px',
            }}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Iframe */}
        <div style={{ aspectRatio: '16 / 9', borderRadius: 10, overflow: 'hidden', background: '#000' }}>
          <iframe
            src={embedUrl(videoId)}
            title={videoTitle}
            width="100%"
            height="100%"
            style={{ display: 'block', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Mid-watch upsell strip */}
        {!pro && (
          <div style={{
            marginTop: 10,
            background: 'rgba(129,140,248,0.06)',
            border: '1px solid rgba(129,140,248,0.16)',
            borderRadius: 8, padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: 11, color: '#4a6a84', letterSpacing: 1, lineHeight: 1.5 }}>
              {totalFreeWatched < UPSELL_AFTER_WATCHED
                ? `Enjoying this? Unlock all ${TOTAL_VIDEOS} videos · one-time $14.99`
                : `You've watched ${totalFreeWatched} free videos. Unlock the full library for $14.99.`}
            </div>
            <button
              onClick={e => { e.stopPropagation(); onUnlock(); }}
              style={{
                background: 'rgba(129,140,248,0.15)',
                border: '1px solid rgba(129,140,248,0.35)',
                borderRadius: 6, padding: '5px 14px',
                color: ACCENT, fontSize: 9.5, letterSpacing: 1.5, fontWeight: 700,
                fontFamily: "'Courier New', monospace", cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              UNLOCK PRO
            </button>
          </div>
        )}

        <div style={{
          marginTop: 8, fontSize: 9.5, color: '#3a5472', letterSpacing: 1.5,
          textAlign: 'center', fontFamily: "'Courier New', monospace",
        }}>
          CLICK OUTSIDE TO CLOSE · TAP ⛶ FOR FULL SCREEN
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function VideoLibrary({ pro = false, proLoading = false }) {
  const [topicIdx,     setTopicIdx]     = useState(null);
  const [playerVideo,  setPlayerVideo]  = useState(null); // { id, title }
  const [watchedIds,   setWatchedIds]   = useState(() => new Set());
  const [upsellBanner, setUpsellBanner] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);

  // Load watched from localStorage after mount
  useEffect(() => {
    setWatchedIds(loadWatched());
  }, []);

  const totalFreeWatched = [...watchedIds].filter(id => FREE_VIDEO_IDS.has(id)).length;

  const markWatched = (videoId) => {
    setWatchedIds(prev => {
      if (prev.has(videoId)) return prev;
      const next = new Set(prev);
      next.add(videoId);
      saveWatched(next);
      return next;
    });
  };

  const openPlayer = (id, title) => {
    markWatched(id);
    setPlayerVideo({ id, title });
    setUpsellBanner(false);
  };

  const closePlayer = () => {
    const wasFree = playerVideo && FREE_VIDEO_IDS.has(playerVideo.id);
    setPlayerVideo(null);
    // Show banner after watching enough free videos
    if (wasFree && !pro && totalFreeWatched + 1 >= UPSELL_AFTER_WATCHED) {
      setUpsellBanner(true);
    }
  };

  const openTopic = (i) => {
    setTopicIdx(i);
    setUpsellBanner(false);
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  const backToGrid = () => {
    setTopicIdx(null);
    setUpsellBanner(false);
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  const openProModal = () => setProModalOpen(true);

  return (
    <>
      {topicIdx === null
        ? <TopicGrid watchedIds={watchedIds} onSelect={openTopic} />
        : <TopicView
            topic={VIDEO_TOPICS[topicIdx]}
            pro={pro}
            proLoading={proLoading}
            watchedIds={watchedIds}
            onBack={backToGrid}
            onPlay={openPlayer}
            onUnlock={openProModal}
            upsellBanner={upsellBanner}
          />
      }

      {playerVideo && (
        <PlayerModal
          videoId={playerVideo.id}
          videoTitle={playerVideo.title}
          pro={pro}
          totalFreeWatched={totalFreeWatched}
          onClose={closePlayer}
          onUnlock={() => { setPlayerVideo(null); openProModal(); }}
        />
      )}

      {proModalOpen && (
        <ProModal onClose={() => setProModalOpen(false)} />
      )}
    </>
  );
}

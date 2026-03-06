'use client';

import { useState } from 'react';
import { VIDEO_TOPICS, TOTAL_VIDEOS } from '@/data/videoLibrary';

const ACCENT = '#818cf8'; // indigo — distinct from other tab colors

// ── Small helpers ─────────────────────────────────────────────────────────────

function thumbUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function embedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

// ── Topic grid ────────────────────────────────────────────────────────────────

function TopicGrid({ onSelect }) {
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
          <TopicCard key={topic.id} topic={topic} onClick={() => onSelect(i)} />
        ))}
      </div>
    </div>
  );
}

function TopicCard({ topic, onClick }) {
  const [hovered, setHovered] = useState(false);
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
      }}
    >
      <div style={{ fontSize: 30, marginBottom: 10 }}>{topic.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: ACCENT, marginBottom: 6 }}>
        {topic.title.toUpperCase()}
      </div>
      <div style={{ fontSize: 11, color: '#6a8aa4', lineHeight: 1.65, marginBottom: 12 }}>
        {topic.desc}
      </div>
      <div style={{
        display: 'inline-block',
        background: 'rgba(129,140,248,0.12)',
        border: '1px solid rgba(129,140,248,0.22)',
        borderRadius: 20, padding: '2px 10px',
        fontSize: 9.5, letterSpacing: 1.5, color: ACCENT,
      }}>
        {topic.videos.length} VIDEO{topic.videos.length > 1 ? 'S' : ''}
      </div>
    </button>
  );
}

// ── Topic detail (list of videos) ────────────────────────────────────────────

function TopicView({ topic, onBack, onPlay }) {
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
        {topic.videos.map(video => (
          <VideoCard key={video.id} video={video} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ video, onPlay }) {
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

// ── Video player modal ────────────────────────────────────────────────────────

function PlayerModal({ videoId, videoTitle, onClose }) {
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

export default function VideoLibrary() {
  const [topicIdx,    setTopicIdx]    = useState(null);  // null = grid
  const [playerVideo, setPlayerVideo] = useState(null);  // { id, title }

  const openPlayer  = (id, title) => setPlayerVideo({ id, title });
  const closePlayer = () => setPlayerVideo(null);
  const openTopic   = (i) => { setTopicIdx(i); window.scrollTo?.({ top: 0, behavior: 'smooth' }); };
  const backToGrid  = () => { setTopicIdx(null); window.scrollTo?.({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      {topicIdx === null
        ? <TopicGrid onSelect={openTopic} />
        : <TopicView
            topic={VIDEO_TOPICS[topicIdx]}
            onBack={backToGrid}
            onPlay={openPlayer}
          />
      }

      {playerVideo && (
        <PlayerModal
          videoId={playerVideo.id}
          videoTitle={playerVideo.title}
          onClose={closePlayer}
        />
      )}
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { aviationTopics } from '@/data/aviationLessons';

const TAB_COLOR    = '#34d399';
const LB_ZOOM_MIN  = 0.5;
const LB_ZOOM_MAX  = 4.0;
const LB_ZOOM_STEP = 0.5;

export default function AviationBasics() {
  const [topicIdx,     setTopicIdx]     = useState(null); // null = topic grid
  const [slideIdx,     setSlideIdx]     = useState(0);
  const [imgError,     setImgError]     = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1.0);

  const closeLightbox = () => { setLightboxOpen(false); setLightboxZoom(1.0); };

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { setLightboxOpen(false); setLightboxZoom(1.0); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  const enterTopic = (idx) => {
    setTopicIdx(idx);
    setSlideIdx(0);
    setImgError(false);
    closeLightbox();
  };

  const exitTopic = () => {
    setTopicIdx(null);
    setSlideIdx(0);
    setImgError(false);
    closeLightbox();
  };

  // ── Topic selection grid ────────────────────────────────────────────────────
  if (topicIdx === null) {
    return (
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px', animation: 'fadeSlide 0.4s ease' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: TAB_COLOR, marginBottom: 8, opacity: 0.8 }}>
            ◈ AVIATION FUNDAMENTALS ◈
          </div>
          <p style={{
            color: '#6a8aa4', fontSize: 13, lineHeight: 1.75,
            maxWidth: 520, margin: '14px auto 0',
          }}>
            New to aviation? Start here. Each topic is a short visual slideshow covering the core
            concepts behind the FAA knowledge test — no experience required.
          </p>
        </div>

        {/* Topic cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 14,
        }}>
          {aviationTopics.map((topic, i) => (
            <button
              key={topic.id}
              onClick={() => enterTopic(i)}
              style={{
                background: 'rgba(255,255,255,0.017)',
                border: `1px solid ${topic.color}28`,
                borderTop: `3px solid ${topic.color}`,
                borderRadius: 10,
                padding: '22px 18px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.16s',
                color: '#e2e8f0',
                fontFamily: "'Courier New', monospace",
                width: '100%',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${topic.color}0d`;
                e.currentTarget.style.borderLeftColor = `${topic.color}55`;
                e.currentTarget.style.borderRightColor = `${topic.color}55`;
                e.currentTarget.style.borderBottomColor = `${topic.color}55`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.017)';
                e.currentTarget.style.borderLeftColor = `${topic.color}28`;
                e.currentTarget.style.borderRightColor = `${topic.color}28`;
                e.currentTarget.style.borderBottomColor = `${topic.color}28`;
              }}
            >
              <div style={{ fontSize: 34, marginBottom: 13 }}>{topic.icon}</div>
              <div style={{
                fontSize: 11.5, fontWeight: 700, letterSpacing: 1.5,
                color: topic.color, marginBottom: 7, textTransform: 'uppercase',
              }}>
                {topic.title}
              </div>
              <div style={{ fontSize: 11.5, color: '#5a7a94', lineHeight: 1.65, marginBottom: 12 }}>
                {topic.description}
              </div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: `${topic.color}60` }}>
                {topic.slides.length} SLIDES ›
              </div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{ textAlign: 'center', marginTop: 36, fontSize: 9.5, color: '#2a4464', letterSpacing: 2.5 }}>
          SELECT A TOPIC ABOVE TO BEGIN · USE ← → TO NAVIGATE SLIDES
        </div>
      </div>
    );
  }

  // ── Slideshow ───────────────────────────────────────────────────────────────
  const topic   = aviationTopics[topicIdx];
  const slide   = topic.slides[slideIdx];
  const isFirst = slideIdx === 0;
  const isLast  = slideIdx === topic.slides.length - 1;

  const goNext = () => {
    if (!isLast) { setSlideIdx(i => i + 1); setImgError(false); closeLightbox(); }
  };
  const goPrev = () => {
    if (!isFirst) { setSlideIdx(i => i - 1); setImgError(false); closeLightbox(); }
  };

  const lbZoomIn  = () => setLightboxZoom(z => Math.min(parseFloat((z + LB_ZOOM_STEP).toFixed(1)), LB_ZOOM_MAX));
  const lbZoomOut = () => setLightboxZoom(z => Math.max(parseFloat((z - LB_ZOOM_STEP).toFixed(1)), LB_ZOOM_MIN));

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 20px 60px', animation: 'fadeSlide 0.3s ease' }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <button
          onClick={exitTopic}
          style={{
            background: 'none', border: '1px solid #1a2436', borderRadius: 6, color: '#6a8aa4',
            padding: '6px 13px', cursor: 'pointer', fontFamily: "'Courier New', monospace",
            fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
          }}
        >
          ← TOPICS
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{topic.icon}</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 10.5, letterSpacing: 2, color: topic.color, fontWeight: 700,
              fontFamily: "'Courier New', monospace", textTransform: 'uppercase',
            }}>
              {topic.title}
            </div>
            <div style={{ fontSize: 8.5, letterSpacing: 2, color: '#3a5870', fontFamily: "'Courier New', monospace" }}>
              SLIDE {slideIdx + 1} OF {topic.slides.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: '#0b1220', borderRadius: 2, marginBottom: 22, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2, background: topic.color, transition: 'width 0.4s ease',
          width: `${((slideIdx + 1) / topic.slides.length) * 100}%`,
        }} />
      </div>

      {/* Image — click to open lightbox */}
      {!imgError ? (
        <div style={{
          marginBottom: 22, borderRadius: 10, overflow: 'hidden',
          background: '#060c14', border: '1px solid #0d1a26',
        }}>
          <img
            src={slide.imageUrl}
            alt={slide.imageAlt}
            onError={() => setImgError(true)}
            onClick={() => setLightboxOpen(true)}
            style={{
              width: '100%', maxHeight: 380, objectFit: 'contain',
              display: 'block', cursor: 'zoom-in',
            }}
          />
          <div style={{
            padding: '7px 14px', background: 'rgba(0,0,0,0.55)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {slide.imageCaption && (
              <span style={{
                fontSize: 10.5, color: '#7090aa', fontStyle: 'italic', letterSpacing: 0.2,
                fontFamily: "'Courier New', monospace",
              }}>
                {slide.imageCaption}
              </span>
            )}
            <span style={{
              fontSize: 8, letterSpacing: 2, color: `${TAB_COLOR}50`,
              fontFamily: "'Courier New', monospace", flexShrink: 0, marginLeft: 8,
            }}>
              ↗ CLICK TO ENLARGE
            </span>
          </div>
        </div>
      ) : (
        /* Fallback when image fails to load */
        <div style={{
          marginBottom: 22, borderRadius: 10, height: 160,
          background: `${topic.color}0a`, border: `1px solid ${topic.color}18`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 46 }}>{topic.icon}</span>
          <span style={{
            fontSize: 8.5, letterSpacing: 3, color: topic.color,
            opacity: 0.5, fontFamily: "'Courier New', monospace",
          }}>
            {topic.title.toUpperCase()}
          </span>
        </div>
      )}

      {/* Slide title */}
      <h2 style={{
        fontSize: 18, fontWeight: 700, color: '#dce8f5',
        margin: '0 0 14px', fontFamily: "'Courier New', monospace",
        letterSpacing: 1, lineHeight: 1.35,
      }}>
        {slide.title}
      </h2>

      {/* Slide body */}
      <div style={{
        background: `${topic.color}07`,
        border: `1px solid ${topic.color}18`,
        borderRadius: 10, padding: '16px 19px', marginBottom: 26,
      }}>
        <p style={{
          margin: 0, fontSize: 13.5, lineHeight: 1.9,
          color: '#7a9ab4', whiteSpace: 'pre-line',
          fontFamily: "'Courier New', monospace",
        }}>
          {slide.body}
        </p>
      </div>

      {/* Bottom nav row: progress dots + prev/next buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>

        {/* Slide dots — clickable */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {topic.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setSlideIdx(i); setImgError(false); closeLightbox(); }}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === slideIdx ? 22 : 8,
                height: 8,
                borderRadius: 4,
                background: i === slideIdx ? topic.color : `${topic.color}28`,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={goPrev}
            disabled={isFirst}
            style={{
              background: 'none',
              border: `1px solid ${isFirst ? '#111c2a' : '#3a5870'}`,
              borderRadius: 6,
              color: isFirst ? '#111c2a' : '#6a8aa4',
              padding: '9px 19px',
              cursor: isFirst ? 'default' : 'pointer',
              fontFamily: "'Courier New', monospace",
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
          >
            ← PREV
          </button>
          <button
            onClick={isLast ? exitTopic : goNext}
            style={{
              background: `${topic.color}0e`,
              border: `1px solid ${topic.color}44`,
              color: topic.color,
              padding: '9px 21px',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: "'Courier New', monospace",
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${topic.color}1e`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${topic.color}0e`; }}
          >
            {isLast ? 'FINISH ✓' : 'NEXT →'}
          </button>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.94)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 12, padding: 20,
          }}
        >
          {/* Toolbar */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
            }}
          >
            <span style={{
              fontSize: 8, letterSpacing: 2, color: '#7a9ab4',
              marginRight: 4, fontFamily: "'Courier New', monospace",
            }}>
              ZOOM
            </span>
            <button
              onClick={lbZoomOut}
              disabled={lightboxZoom <= LB_ZOOM_MIN}
              aria-label="Zoom out"
              style={lbBtn(lightboxZoom <= LB_ZOOM_MIN)}
            >
              −
            </button>
            <span style={{
              fontSize: 10, fontFamily: "'Courier New', monospace",
              color: '#f59e0b', minWidth: 42, textAlign: 'center', letterSpacing: 1,
            }}>
              {Math.round(lightboxZoom * 100)}%
            </span>
            <button
              onClick={lbZoomIn}
              disabled={lightboxZoom >= LB_ZOOM_MAX}
              aria-label="Zoom in"
              style={lbBtn(lightboxZoom >= LB_ZOOM_MAX)}
            >
              +
            </button>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              style={{ ...lbBtn(false), fontSize: 9, letterSpacing: 1, padding: '5px 11px' }}
            >
              ✕ CLOSE
            </button>
          </div>

          {/* Scrollable image area */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              overflow: 'auto',
              maxWidth: '92vw',
              maxHeight: '78vh',
              display: 'flex',
              alignItems: lightboxZoom <= 1 ? 'center' : 'flex-start',
              justifyContent: lightboxZoom <= 1 ? 'center' : 'flex-start',
              borderRadius: 6,
              background: '#0a0f18',
            }}
          >
            <img
              src={slide.imageUrl}
              alt={slide.imageAlt}
              style={{
                display: 'block',
                maxWidth: lightboxZoom <= 1 ? '92vw' : 'none',
                maxHeight: lightboxZoom <= 1 ? '78vh' : 'none',
                width: lightboxZoom <= 1 ? 'auto' : `${lightboxZoom * 90}vw`,
                height: 'auto',
                objectFit: 'contain',
                userSelect: 'none',
              }}
            />
          </div>

          {/* Caption + dismiss hint */}
          {slide.imageCaption && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                fontSize: 10, color: '#5a7a94', fontStyle: 'italic',
                fontFamily: "'Courier New', monospace",
                textAlign: 'center', maxWidth: '80vw',
              }}
            >
              {slide.imageCaption} — ESC OR CLICK OUTSIDE TO CLOSE
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Style for lightbox toolbar buttons */
function lbBtn(disabled = false) {
  return {
    background: disabled ? 'transparent' : 'rgba(245,158,11,0.08)',
    border: `1px solid ${disabled ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.3)'}`,
    borderRadius: 5,
    color: disabled ? '#3a2800' : '#f59e0b',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: "'Courier New', monospace",
    fontSize: 14, fontWeight: 700,
    padding: '4px 9px', lineHeight: 1,
  };
}

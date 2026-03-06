'use client';

import { useState } from 'react';

const ZOOM_MIN  = 0.5;
const ZOOM_MAX  = 3.0;
const ZOOM_STEP = 0.25;
const AMBER     = '#f59e0b';

// Pre-rendered JPEG images (public/figures/page-{n}.jpg)
// All figures are portrait 1650×2150 px (rendered at 200 dpi)
const ASPECT = 2150 / 1650; // height / width

export default function PdfFigure({ pageNumber, figureNumbers, note }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom,       setZoom]       = useState(1.0);
  const [rotation,   setRotation]   = useState(0); // 0 | 90 | 180 | 270
  const [loadedSet,  setLoadedSet]  = useState({}); // { [pageNum]: true } once image loads

  const pages    = Array.isArray(pageNumber) ? pageNumber : [pageNumber];
  const figNums  = Array.isArray(figureNumbers) ? figureNumbers : [figureNumbers];
  const figLabel = figNums.map(n => `Figure ${n}`).join(' & ');

  const zoomIn    = () => setZoom(z => Math.min(parseFloat((z + ZOOM_STEP).toFixed(2)), ZOOM_MAX));
  const zoomOut   = () => setZoom(z => Math.max(parseFloat((z - ZOOM_STEP).toFixed(2)), ZOOM_MIN));
  const rotateCCW = () => setRotation(r => (r + 270) % 360);
  const rotateCW  = () => setRotation(r => (r + 90)  % 360);
  const reset     = () => { setZoom(1.0); setRotation(0); };

  const isRotated = rotation === 90 || rotation === 270;

  // Base display width: fills available space up to 680 px
  const baseWidth    = typeof window !== 'undefined' ? Math.min(window.innerWidth - 80, 680) : 640;
  const displayWidth = Math.round(baseWidth * zoom);

  // Container height hint:
  // - Not rotated: portrait height ≈ width × ASPECT
  // - Rotated 90/270: the landscape image's visual height ≈ original width
  const containerMinHeight = isRotated
    ? Math.round(displayWidth / ASPECT)
    : Math.round(displayWidth * ASPECT);

  return (
    <div style={{
      background: 'rgba(245,158,11,0.04)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 10,
      padding: '12px 14px',
      marginBottom: 18,
    }}>

      {/* ── Collapse / expand header ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: isExpanded ? 12 : 0, cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(v => !v)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: AMBER }}>◈ REFERENCE: {figLabel}</span>
          {note && (
            <span style={{ fontSize: 9, color: '#b45309', letterSpacing: 1 }}>— {note}</span>
          )}
        </div>
        <span style={{ fontSize: 10, color: '#92400e', letterSpacing: 2 }}>
          {isExpanded ? '▲ COLLAPSE' : '▼ VIEW FIGURE'}
        </span>
      </div>

      {isExpanded && (
        <div>
          {/* ── Controls toolbar ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 8,
            marginBottom: 10, padding: '7px 10px',
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: 7,
          }}>
            {/* Rotate controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 8, letterSpacing: 2, color: '#92400e', marginRight: 2 }}>ROTATE</span>
              {[
                { label: '↺', title: 'Rotate counter-clockwise', onClick: rotateCCW },
                { label: '↻', title: 'Rotate clockwise',         onClick: rotateCW  },
              ].map(({ label, title, onClick }) => (
                <button key={label} onClick={onClick} title={title} style={controlBtn()}>
                  {label}
                </button>
              ))}
              {rotation !== 0 && (
                <span style={{ fontSize: 9, color: '#b45309', marginLeft: 4, letterSpacing: 1 }}>
                  {rotation}°
                </span>
              )}
            </div>

            {/* Zoom controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 8, letterSpacing: 2, color: '#92400e', marginRight: 2 }}>ZOOM</span>
              <button onClick={zoomOut} disabled={zoom <= ZOOM_MIN} title="Zoom out" style={controlBtn(zoom <= ZOOM_MIN)}>−</button>
              <span style={{
                fontSize: 10, fontFamily: "'Courier New', monospace",
                color: AMBER, minWidth: 38, textAlign: 'center', letterSpacing: 1,
              }}>
                {Math.round(zoom * 100)}%
              </span>
              <button onClick={zoomIn} disabled={zoom >= ZOOM_MAX} title="Zoom in" style={controlBtn(zoom >= ZOOM_MAX)}>+</button>
            </div>

            {/* Reset */}
            <button
              onClick={reset}
              title="Reset zoom and rotation"
              style={{ ...controlBtn(zoom === 1.0 && rotation === 0), fontSize: 9, letterSpacing: 1, padding: '5px 10px' }}
            >
              RESET
            </button>
          </div>

          {/* ── Figure images ── */}
          {pages.map((pg, idx) => (
            <div key={pg} style={{ marginBottom: idx < pages.length - 1 ? 20 : 0 }}>
              {pages.length > 1 && (
                <div style={{ fontSize: 8, color: '#92400e', letterSpacing: 2, marginBottom: 6 }}>
                  {`FIGURE ${figNums[idx] ?? ''}`}
                </div>
              )}

              {/* Scrollable image wrapper */}
              <div style={{
                background: '#fff',
                borderRadius: 6,
                overflow: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                minHeight: containerMinHeight,
              }}>
                {/* Loading skeleton shown until image fully decodes */}
                {!loadedSet[pg] && (
                  <div style={{
                    position: 'absolute',
                    padding: '24px 16px',
                    color: '#92400e',
                    fontFamily: 'monospace',
                    fontSize: 11,
                    letterSpacing: 1,
                    animation: 'pulse 1.4s ease infinite',
                  }}>
                    Loading figure…
                  </div>
                )}

                <img
                  src={`/figures/page-${pg}.jpg`}
                  alt={pages.length > 1 ? `Figure ${figNums[idx]}` : figLabel}
                  draggable={false}
                  loading="eager"
                  decoding="async"
                  onLoad={() => setLoadedSet(s => ({ ...s, [pg]: true }))}
                  style={{
                    display: 'block',
                    // When rotated 90/270 the visible width equals the image's rendered height.
                    // Set image CSS width so that the visual span = displayWidth:
                    //   visual_width_when_rotated = css_width × ASPECT  →  css_width = displayWidth / ASPECT
                    width: isRotated ? Math.round(displayWidth / ASPECT) : displayWidth,
                    height: 'auto',
                    transform: rotation !== 0 ? `rotate(${rotation}deg)` : 'none',
                    transformOrigin: 'center top',
                    flexShrink: 0,
                    opacity: loadedSet[pg] ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Shared style for toolbar icon buttons */
function controlBtn(disabled = false) {
  return {
    background: disabled ? 'transparent' : 'rgba(245,158,11,0.08)',
    border: `1px solid ${disabled ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.3)'}`,
    borderRadius: 5,
    color: disabled ? '#3a2800' : '#f59e0b',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    fontWeight: 700,
    padding: '4px 9px',
    lineHeight: 1,
    transition: 'all 0.12s',
  };
}

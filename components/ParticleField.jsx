'use client';

// Seeded particles computed at module level — stable across SSR & client
function seeded(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const PARTICLES = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: seeded(i * 3) * 100,
  y: seeded(i * 3 + 1) * 100,
  size: seeded(i * 3 + 2) * 1.8 + 0.4,
  duration: seeded(i * 5) * 7 + 3,
  delay: -(seeded(i * 7) * 12),
  opacity: seeded(i * 11) * 0.5 + 0.08,
  color: seeded(i * 13) > 0.7 ? '#93c5fd' : seeded(i * 13) > 0.4 ? '#bfdbfe' : '#e0f2fe',
}));

/**
 * Renders an animated star-field fixed behind all content.
 */
export default function ParticleField() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}
    >
      {PARTICLES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            animation: `twinkle ${p.duration}s ${p.delay}s ease-in-out infinite`,
            willChange: 'opacity, transform',
          }}
        />
      ))}
    </div>
  );
}

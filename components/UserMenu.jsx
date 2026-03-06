'use client';

import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';

/**
 * User avatar button with dropdown in the app header.
 *
 * Props:
 *   user — { name, email, image } from NextAuth session
 */
export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const initial = user?.name ? user.name[0].toUpperCase() : '?';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
        style={{
          width: 34, height: 34, borderRadius: '50%',
          border: '2px solid rgba(0,255,136,0.3)',
          background: '#0d1a28',
          cursor: 'pointer',
          padding: 0, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.7)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'; }}
      >
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name ?? 'User'}
            width={34}
            height={34}
            style={{ borderRadius: '50%', display: 'block' }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span style={{
            fontSize: 13, fontWeight: 900, color: '#00ff88',
            fontFamily: "'Courier New', monospace",
          }}>
            {initial}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 42, right: 0, zIndex: 100,
          background: '#0d1a28',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: '14px 16px',
          minWidth: 220,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'fadeSlide 0.15s ease',
        }}>
          {/* User info */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: '#e2e8f0',
              fontFamily: "'Courier New', monospace",
              letterSpacing: 0.5,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.name}
            </div>
            <div style={{
              fontSize: 10, color: '#6a8aa4',
              fontFamily: "'Courier New', monospace",
              marginTop: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.email}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }} />

          {/* Sign out */}
          <button
            onClick={() => signOut()}
            style={{
              width: '100%', padding: '8px 12px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 6,
              color: '#f87171',
              fontFamily: "'Courier New', monospace",
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
              cursor: 'pointer',
              transition: 'all 0.15s',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.16)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
            }}
          >
            SIGN OUT
          </button>
        </div>
      )}
    </div>
  );
}

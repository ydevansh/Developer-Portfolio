/**
 * BackgroundSwitcher.jsx
 *
 * A compact, premium glassmorphism floating control that lets the user
 * switch between the professional background and the solar system.
 *
 * Design:
 *   - Pill-shaped container with glass blur + subtle border
 *   - Two icon buttons — active one has a glowing highlighted pill
 *   - Tooltip on hover (desktop)
 *   - Smooth sliding indicator
 *   - Positioned bottom-right (desktop/tablet) | bottom-center (mobile)
 *   - Safe bottom offset so it never overlaps content
 *   - No page reload, no layout shift
 */

import React, { useState, useCallback, useId } from 'react';
import { useBackground } from '../context/BackgroundContext';

/* ── Icons (inline SVG — no extra lib needed) ───────────────────── */

// Grid of connected nodes → represents professional/network background
function NetworkIcon({ size = 16, active }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Connection lines */}
      <line x1="3" y1="13" x2="8" y2="3"  stroke="currentColor" strokeWidth="1" strokeOpacity={active ? 0.7 : 0.45} />
      <line x1="8" y1="3"  x2="13" y2="9" stroke="currentColor" strokeWidth="1" strokeOpacity={active ? 0.7 : 0.45} />
      <line x1="3" y1="13" x2="13" y2="9" stroke="currentColor" strokeWidth="1" strokeOpacity={active ? 0.7 : 0.45} />
      <line x1="8" y1="3"  x2="6"  y2="9" stroke="currentColor" strokeWidth="1" strokeOpacity={active ? 0.5 : 0.3} />
      <line x1="6" y1="9"  x2="3"  y2="13"stroke="currentColor" strokeWidth="1" strokeOpacity={active ? 0.5 : 0.3} />
      {/* Nodes */}
      <circle cx="8"  cy="3"  r="1.8" fill="currentColor" />
      <circle cx="13" cy="9"  r="1.8" fill="currentColor" />
      <circle cx="3"  cy="13" r="1.8" fill="currentColor" />
      <circle cx="6"  cy="9"  r="1.3" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

// Sun / solar system icon
function SolarIcon({ size = 16, active }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Orbit rings */}
      <ellipse cx="8" cy="8" rx="6.5" ry="6.5" stroke="currentColor" strokeWidth="0.8"
        strokeOpacity={active ? 0.5 : 0.3} strokeDasharray="1.5 2" fill="none" />
      <ellipse cx="8" cy="8" rx="3.8" ry="3.8" stroke="currentColor" strokeWidth="0.8"
        strokeOpacity={active ? 0.5 : 0.3} strokeDasharray="1.5 2" fill="none" />
      {/* Sun */}
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      {/* Planet on outer orbit */}
      <circle cx="14.5" cy="8" r="1.1" fill="currentColor" fillOpacity="0.75" />
      {/* Planet on inner orbit */}
      <circle cx="8" cy="4.2" r="0.9" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

/* ── Switcher Component ──────────────────────────────────────────── */
const OPTIONS = [
  {
    key: 'professional',
    label: 'Cinematic',
    tooltip: 'Cinematic background',
    Icon: NetworkIcon,
  },
  {
    key: 'solar',
    label: 'Solar System',
    tooltip: 'Solar system background',
    Icon: SolarIcon,
  },
];

export default function BackgroundSwitcher() {
  const { activeBackground, setActiveBackground } = useBackground();
  const [hovered, setHovered] = useState(null);
  const uid = useId();

  const handleSelect = useCallback((key) => {
    setActiveBackground(key);
  }, [setActiveBackground]);

  const activeIndex = OPTIONS.findIndex(o => o.key === activeBackground);

  return (
    <>
      {/* ── Floating container ────────────────────────────────────── */}
      <div
        id="bg-switcher"
        role="group"
        aria-label="Background switcher"
        style={{
          position: 'fixed',
          // Desktop/tablet: bottom-right; handled via CSS below
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '5px',
          borderRadius: '999px',
          background: 'rgba(10, 15, 40, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(100, 140, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {OPTIONS.map((opt, idx) => {
          const isActive = activeBackground === opt.key;
          const isHov    = hovered === opt.key;
          const Icon     = opt.Icon;

          return (
            <div
              key={opt.key}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHovered(opt.key)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHov && (
                <div
                  role="tooltip"
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 10px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    background: 'rgba(8, 12, 32, 0.92)',
                    border: '1px solid rgba(100, 140, 255, 0.2)',
                    color: 'rgba(200, 220, 255, 0.9)',
                    fontSize: '11px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    animation: 'bgSwTooltipIn 0.15s ease both',
                  }}
                >
                  {opt.tooltip}
                </div>
              )}

              {/* Button */}
              <button
                id={`${uid}-${opt.key}`}
                type="button"
                aria-label={opt.tooltip}
                aria-pressed={isActive}
                onClick={() => handleSelect(opt.key)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(80, 120, 255, 0.35) 0%, rgba(100, 80, 255, 0.25) 100%)'
                    : 'transparent',
                  boxShadow: isActive
                    ? '0 0 0 1px rgba(100, 140, 255, 0.35), 0 2px 12px rgba(80, 120, 255, 0.25)'
                    : 'none',
                  color: isActive ? 'rgba(180, 210, 255, 1)' : 'rgba(120, 150, 210, 0.65)',
                  transition: 'background 0.35s ease, color 0.35s ease, box-shadow 0.35s ease, transform 0.15s ease',
                  transform: isHov && !isActive ? 'scale(1.08)' : 'scale(1)',
                  outline: 'none',
                }}
                onFocus={(e) => e.currentTarget.style.outline = '2px solid rgba(100, 160, 255, 0.6)'}
                onBlur={(e) => e.currentTarget.style.outline = 'none'}
              >
                <Icon size={15} active={isActive} />
              </button>
            </div>
          );
        })}

        {/* Active status dot */}
        <div
          aria-hidden="true"
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'rgba(100, 180, 255, 0.8)',
            boxShadow: '0 0 6px rgba(100, 180, 255, 0.9)',
            marginLeft: '2px',
            marginRight: '2px',
            flexShrink: 0,
            animation: 'bgSwPulse 2.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Styles ───────────────────────────────────────────────── */}
      <style>{`
        @keyframes bgSwTooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes bgSwPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.25); }
        }
        /* Mobile: center at bottom, above typical bottom-nav safe zone */
        @media (max-width: 640px) {
          #bg-switcher {
            right: 50% !important;
            bottom: 20px !important;
            transform: translateX(50%);
          }
        }
        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          #bg-switcher * {
            transition-duration: 0.01ms !important;
            animation-duration:  0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}


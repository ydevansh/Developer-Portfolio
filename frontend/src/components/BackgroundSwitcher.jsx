/**
 * BackgroundSwitcher.jsx
 *
 * 3-Way Toggle Switch UI for backgrounds:
 *   - Left Icon (Node/Network)  → Connected-dots / particle network
 *   - Middle Icon (Starry/Sun)  → 3D Solar system / starry background
 *   - Right Icon (Solid Dot)    → Digital Rain (Matrix binary falling code)
 *
 * Initial page load highlights the Right Icon (Digital Rain) by default.
 */

import React, { useState, useCallback, useId } from 'react';
import { useBackground } from '../context/BackgroundContext';

/* ── Icons ──────────────────────────────────────────────────────── */

// Left: Grid of connected nodes
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
      <line x1="3" y1="13" x2="8" y2="3" stroke="currentColor" strokeWidth="1.2" strokeOpacity={active ? 0.9 : 0.45} />
      <line x1="8" y1="3" x2="13" y2="9" stroke="currentColor" strokeWidth="1.2" strokeOpacity={active ? 0.9 : 0.45} />
      <line x1="3" y1="13" x2="13" y2="9" stroke="currentColor" strokeWidth="1.2" strokeOpacity={active ? 0.9 : 0.45} />
      <line x1="8" y1="3" x2="6" y2="9" stroke="currentColor" strokeWidth="1.2" strokeOpacity={active ? 0.7 : 0.3} />
      <line x1="6" y1="9" x2="3" y2="13" stroke="currentColor" strokeWidth="1.2" strokeOpacity={active ? 0.7 : 0.3} />
      <circle cx="8" cy="3" r="1.8" fill="currentColor" />
      <circle cx="13" cy="9" r="1.8" fill="currentColor" />
      <circle cx="3" cy="13" r="1.8" fill="currentColor" />
      <circle cx="6" cy="9" r="1.3" fill="currentColor" fillOpacity="0.8" />
    </svg>
  );
}

// Middle: Sun / Starry orbit icon
function StarryIcon({ size = 16, active }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <ellipse
        cx="8"
        cy="8"
        rx="6.5"
        ry="6.5"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity={active ? 0.6 : 0.3}
        strokeDasharray="1.5 2"
        fill="none"
      />
      <ellipse
        cx="8"
        cy="8"
        rx="3.8"
        ry="3.8"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity={active ? 0.6 : 0.3}
        strokeDasharray="1.5 2"
        fill="none"
      />
      <circle cx="8" cy="8" r="2.2" fill="currentColor" />
      <circle cx="14.5" cy="8" r="1.1" fill="currentColor" fillOpacity="0.8" />
      <circle cx="8" cy="4.2" r="0.9" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

// Right: Solid Dot icon
function SolidDotIcon({ size = 16, active }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <circle cx="8" cy="8" r="3.8" fill="currentColor" />
      {active && (
        <circle
          cx="8"
          cy="8"
          r="5.8"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeOpacity="0.5"
          fill="none"
        />
      )}
    </svg>
  );
}

/* ── Switcher Options ────────────────────────────────────────────── */
const OPTIONS = [
  {
    key: 'network',
    label: 'Connected Network',
    tooltip: 'Network / Connected Dots',
    Icon: NetworkIcon,
  },
  {
    key: 'solar',
    label: 'Solar System',
    tooltip: 'Starry / Solar System',
    Icon: StarryIcon,
  },
  {
    key: 'matrix',
    label: 'Digital Rain',
    tooltip: 'Digital Rain (Binary Matrix)',
    Icon: SolidDotIcon,
  },
];

export default function BackgroundSwitcher() {
  const { activeBackground, setActiveBackground } = useBackground();
  const [hovered, setHovered] = useState(null);
  const uid = useId();

  const handleSelect = useCallback(
    (key) => {
      setActiveBackground(key);
    },
    [setActiveBackground]
  );

  return (
    <>
      {/* ── Floating container ────────────────────────────────────── */}
      <div
        id="bg-switcher"
        role="group"
        aria-label="Background style switcher"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: '4px',
          borderRadius: '999px',
          background: 'rgba(5, 10, 20, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0, 229, 255, 0.1)',
        }}
      >
        {OPTIONS.map((opt) => {
          const isActive = activeBackground === opt.key;
          const isHov = hovered === opt.key;
          const Icon = opt.Icon;

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
                    background: 'rgba(5, 10, 20, 0.95)',
                    border: '1px solid rgba(0, 229, 255, 0.35)',
                    color: '#00E5FF',
                    fontSize: '11px',
                    fontFamily: "'JetBrains Mono', Consolas, monospace",
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 20px rgba(0, 229, 255, 0.15)',
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
                    ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.35) 0%, rgba(0, 160, 255, 0.2) 100%)'
                    : 'transparent',
                  boxShadow: isActive
                    ? '0 0 0 1px rgba(0, 229, 255, 0.5), 0 0 14px rgba(0, 229, 255, 0.35)'
                    : 'none',
                  color: isActive ? '#00E5FF' : 'rgba(160, 200, 240, 0.65)',
                  transition:
                    'background 0.35s ease, color 0.35s ease, box-shadow 0.35s ease, transform 0.15s ease',
                  transform: isHov && !isActive ? 'scale(1.08)' : 'scale(1)',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.outline = '2px solid #00E5FF')}
                onBlur={(e) => (e.currentTarget.style.outline = 'none')}
              >
                <Icon size={15} active={isActive} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Styles ───────────────────────────────────────────────── */}
      <style>{`
        @keyframes bgSwTooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @media (max-width: 640px) {
          #bg-switcher {
            right: 50% !important;
            bottom: 20px !important;
            transform: translateX(50%);
          }
        }
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

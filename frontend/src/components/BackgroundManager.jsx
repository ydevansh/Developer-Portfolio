/**
 * BackgroundManager.jsx
 *
 * Renders BOTH backgrounds in fixed stacked layers at z-index: 0.
 * Uses CSS opacity + transition for smooth crossfade — no re-mount,
 * no flicker, no blank frames.
 *
 * Layer stack (bottom → top):
 *   z-index 0  ← Solar System (AuroraBackground)   } always mounted
 *   z-index 1  ← Particle Network                  } always mounted
 *   z-index 2+ ← Portfolio content (Navbar, pages)
 *
 * When 'professional' is active:  particle layer opacity → 1, solar → 0
 * When 'solar' is active:         solar layer opacity → 1, particle → 0
 *
 * The inactive layer continues its animation loop but is invisible.
 * Switching is a pure CSS opacity change — zero JS-side cost.
 */

import React, { memo } from 'react';
import AuroraBackground from './AuroraBackground';
import ParticleNetworkBackground from './ParticleNetworkBackground';
import { useBackground } from '../context/BackgroundContext';

const FADE_DURATION = '700ms'; // crossfade duration

function BackgroundManager() {
  const { activeBackground } = useBackground();

  const isSolar = activeBackground === 'solar';

  return (
    <>
      {/* ── Layer 0: Solar System ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          opacity: isSolar ? 1 : 0,
          transition: `opacity ${FADE_DURATION} cubic-bezier(0.4, 0, 0.2, 1)`,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      >
        <AuroraBackground />
      </div>

      {/* ── Layer 1: Professional Particle Network ─────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          opacity: isSolar ? 0 : 1,
          transition: `opacity ${FADE_DURATION} cubic-bezier(0.4, 0, 0.2, 1)`,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      >
        <ParticleNetworkBackground />
      </div>
    </>
  );
}

export default memo(BackgroundManager);


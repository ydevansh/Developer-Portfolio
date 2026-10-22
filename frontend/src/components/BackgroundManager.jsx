/**
 * BackgroundManager.jsx
 *
 * Renders all three backgrounds in fixed stacked layers at z-index: 0.
 * Uses CSS opacity + transition for smooth crossfade between:
 *   - 'network' : Connected-dots particle network
 *   - 'solar'   : 3D Solar System Orrery
 *   - 'matrix'  : Digital Rain binary matrix background (default)
 */

import React, { memo } from 'react';
import AuroraBackground from './AuroraBackground';
import ParticleNetworkBackground from './ParticleNetworkBackground';
import DigitalRainBackground from './DigitalRainBackground';
import { useBackground } from '../context/BackgroundContext';

const FADE_DURATION = '700ms';

function BackgroundManager() {
  const { activeBackground } = useBackground();

  const isNetwork = activeBackground === 'network';
  const isSolar = activeBackground === 'solar';
  const isMatrix = activeBackground === 'matrix';

  return (
    <>
      {/* ── Layer 1: Connected-Dots / Network Background ───────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          opacity: isNetwork ? 1 : 0,
          transition: `opacity ${FADE_DURATION} cubic-bezier(0.4, 0, 0.2, 1)`,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      >
        <ParticleNetworkBackground />
      </div>

      {/* ── Layer 2: Solar System (AuroraBackground) ───────────────── */}
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

      {/* ── Layer 3: Digital Rain (Matrix) ─────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          opacity: isMatrix ? 1 : 0,
          transition: `opacity ${FADE_DURATION} cubic-bezier(0.4, 0, 0.2, 1)`,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      >
        <DigitalRainBackground />
      </div>
    </>
  );
}

export default memo(BackgroundManager);

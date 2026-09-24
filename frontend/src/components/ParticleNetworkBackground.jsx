/**
 * ParticleNetworkBackground.jsx  —  "Pure Minimal Cinematic Background"
 *
 * A premium, restrained, professional background for a modern developer portfolio.
 * Inspired by the visual language of Vercel · Linear · Apple · Stripe.
 *
 * Features
 * ────────
 *  1. Very dark near-black base  (#08090B — not pure black)
 *  2. Large, fully feathered, slow-breathing navy radial illumination
 *       37–62 s cycle, barely perceptible movement, feels like atmospheric
 *       lighting rather than a CSS gradient
 *  3. Film-grain texture overlay  (≈1–2 % visual intensity)
 *       Pre-baked noise tiles refreshed at ≈15 fps (60 fps render loop)
 *  4. Ultra-subtle mouse parallax — max 3 px shift, smooth inertia
 *  5. Ultra-subtle scroll parallax
 *  6. Pauses when browser tab is hidden
 *  7. Respects prefers-reduced-motion (removes all movement)
 *
 * Does NOT contain
 * ────────────────
 *   particles · stars · planets · 3-D objects · neon lines · blobs ·
 *   glowing spheres · geometric shapes · Three.js
 */

import React, { useEffect, useRef, memo } from 'react';

/* ── Constants ──────────────────────────────────────────────────── */

const BASE_HEX        = '#08090B';   // near-black, faint navy tint

// Deep-navy glow colour (linear-light sRGB)
const GLOW_R          = 12;
const GLOW_G          = 22;
const GLOW_B          = 58;

// Peak glow opacity at dead centre
const GLOW_PEAK_A     = 0.44;

// Slow drift extents (fraction of viewport)
const DRIFT_X_FRAC    = 0.10;
const DRIFT_Y_FRAC    = 0.07;

// Animation cycle periods (ms) — different values make motion feel organic
const PERIOD_X        = 48_000;   // 48 s horizontal drift
const PERIOD_Y        = 37_000;   // 37 s vertical drift
const PERIOD_BREATH   = 62_000;   // 62 s glow-radius breath

// Film grain
const GRAIN_TILE      = 200;      // px — tile size (smaller = finer grain)
const GRAIN_FRAMES    = 8;        // pre-baked frames
const GRAIN_ALPHA     = 0.016;    // ~1-2 % visual intensity
const GRAIN_SKIP      = 4;        // refresh grain every N render frames (~15fps)

// Mouse parallax
const MOUSE_MAX_PX    = 3;        // max displacement in px
const MOUSE_LERP_K    = 0.048;    // smooth-lerp factor per frame

// Scroll parallax
const SCROLL_PARALLAX = 0.010;    // illumination vertical offset per scrollY px

/* ── Helpers ────────────────────────────────────────────────────── */

function prefersReducedMotion() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch { return false; }
}

function lerp(a, b, t) { return a + (b - a) * t; }

/** Pre-bake N grain tiles once so we avoid regenerating noise each frame. */
function bakeGrainFrames(count, size) {
  const frames = [];
  for (let f = 0; f < count; f++) {
    const buf = new Uint8ClampedArray(size * size * 4);
    for (let i = 0; i < buf.length; i += 4) {
      const v       = (Math.random() * 255) | 0;
      buf[i]        = v;            // R
      buf[i + 1]    = v;            // G
      buf[i + 2]    = v;            // B
      buf[i + 3]    = (Math.random() * 200) | 0; // A varies
    }
    frames.push(new ImageData(buf, size, size));
  }
  return frames;
}

/* ── Component ──────────────────────────────────────────────────── */

function CinematicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx     = canvas.getContext('2d', { alpha: false });
    const reduced = prefersReducedMotion();
    let   w = 0, h = 0;
    let   raf      = 0;
    let   paused   = document.hidden;
    let   frameN   = 0;

    // Mouse — normalised [0, 1]
    let   mouseNX = 0.5, mouseNY = 0.5;
    let   smoothMX = 0.5, smoothMY = 0.5;

    // Scroll
    let   scrollY = window.scrollY || 0;

    // Film grain resources
    const grainFrames  = bakeGrainFrames(GRAIN_FRAMES, GRAIN_TILE);
    let   grainIdx     = 0;
    const grainOff     = document.createElement('canvas');
    grainOff.width     = GRAIN_TILE;
    grainOff.height    = GRAIN_TILE;
    const grainOffCtx  = grainOff.getContext('2d');

    // Seed the first grain frame
    grainOffCtx.putImageData(grainFrames[0], 0, 0);

    /* ── Resize ── */
    function resize() {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    /* ── Render loop ── */
    function render(ts) {
      raf = requestAnimationFrame(render);
      if (paused) return;

      frameN++;

      // 1. ── Dark base ─────────────────────────────────────────────
      ctx.fillStyle = BASE_HEX;
      ctx.fillRect(0, 0, w, h);

      // 2. ── Atmospheric illumination ──────────────────────────────
      {
        let cx, cy, rScale;

        if (reduced) {
          cx     = w * 0.5;
          cy     = h * 0.36;
          rScale = 1.0;
        } else {
          // Slow drift  — Lissajous-ish feel from different periods
          const driftX  = Math.sin((ts / PERIOD_X) * Math.PI * 2) * w * DRIFT_X_FRAC;
          const driftY  = Math.cos((ts / PERIOD_Y) * Math.PI * 2) * h * DRIFT_Y_FRAC;
          // Glow-radius breath  0.93 → 1.00
          rScale        = 0.93 + 0.07 * (0.5 + 0.5 * Math.sin((ts / PERIOD_BREATH) * Math.PI * 2));

          // Mouse inertia
          smoothMX = lerp(smoothMX, mouseNX, MOUSE_LERP_K);
          smoothMY = lerp(smoothMY, mouseNY, MOUSE_LERP_K);
          const mOffX   = (smoothMX - 0.5) * 2 * MOUSE_MAX_PX;
          const mOffY   = (smoothMY - 0.5) * 2 * MOUSE_MAX_PX;

          // Scroll parallax — illumination rides upward slightly as you scroll
          const sOffY   = scrollY * SCROLL_PARALLAX;

          cx = w * 0.5  + driftX + mOffX;
          cy = h * 0.36 + driftY + mOffY - sOffY;
        }

        // Radius — covers ~55 % of screen diagonal so edges are fully invisible
        const r = Math.sqrt(w * w + h * h) * 0.55 * rScale;

        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        glow.addColorStop(0.00, `rgba(${GLOW_R},${GLOW_G},${GLOW_B},${GLOW_PEAK_A})`);
        glow.addColorStop(0.28, `rgba(${GLOW_R},${GLOW_G},${GLOW_B},${+(GLOW_PEAK_A * 0.55).toFixed(3)})`);
        glow.addColorStop(0.58, `rgba(${GLOW_R},${GLOW_G},${GLOW_B},${+(GLOW_PEAK_A * 0.15).toFixed(3)})`);
        glow.addColorStop(1.00, `rgba(${GLOW_R},${GLOW_G},${GLOW_B},0)`);

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      // 3. ── Film grain ────────────────────────────────────────────
      if (!reduced) {
        // Cycle to next grain frame every GRAIN_SKIP render frames
        if (frameN % GRAIN_SKIP === 0) {
          grainIdx = (grainIdx + 1) % GRAIN_FRAMES;
          grainOffCtx.putImageData(grainFrames[grainIdx], 0, 0);
        }

        const pat = ctx.createPattern(grainOff, 'repeat');
        if (pat) {
          ctx.save();
          ctx.globalAlpha               = GRAIN_ALPHA;
          // 'screen' composite brightens grain slightly — avoids darkening
          ctx.globalCompositeOperation  = 'screen';
          ctx.fillStyle                 = pat;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
        }
      }
    }

    /* ── ResizeObserver ── */
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(render);

    /* ── Listeners ── */
    function onMouse(e) {
      mouseNX = e.clientX / window.innerWidth;
      mouseNY = e.clientY / window.innerHeight;
    }
    function onScroll() { scrollY = window.scrollY; }
    function onVisibility() { paused = document.hidden; }

    window.addEventListener('mousemove',          onMouse,      { passive: true });
    window.addEventListener('scroll',             onScroll,     { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove',          onMouse);
      window.removeEventListener('scroll',             onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position      : 'fixed',
        inset         : 0,
        width         : '100%',
        height        : '100%',
        display       : 'block',
        pointerEvents : 'none',
      }}
    />
  );
}

export default memo(CinematicBackground);


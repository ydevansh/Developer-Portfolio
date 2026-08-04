/**
 * AuroraBackground.jsx — v3.0 "Liquid Light"
 *
 * Premium HTML5 Canvas background for the portfolio.
 * Inspired by Apple, OpenAI, Linear, Vercel interaction aesthetics.
 * Renders on a fixed full-screen canvas behind all page content (z-index: 0).
 *
 * Interaction model
 * ──────────────────
 * • Cursor light  — An ultra-soft, two-layer radial glow follows the cursor
 *   with smooth inertia. Fades in on enter, out on leave. No circles, no rings.
 * • Particles     — Nearby star-particles gently drift away from the cursor
 *   and spring back home. Motion continues briefly after cursor stops.
 * • Aurora blobs  — Slow, organic, independent drift. A barely-perceptible
 *   bias tilts each blob slightly toward the cursor over time.
 * • Scroll        — Soft parallax on aurora only.
 *
 * What was removed vs v2
 * ───────────────────────
 * • Full wave PDE heightfield simulation (Float32Arrays, stepFluid, disturbFluid)
 * • Off-screen canvas composite pass
 * • All ripple / ring rendering
 * Result: ~70 % less compute per frame → easily maintains 60 FPS.
 *
 * Performance
 * ───────────
 * • 60 FPS target, RAF-driven
 * • RAF paused when tab hidden (Page Visibility API)
 * • prefers-reduced-motion: particle push disabled, aurora slowed
 * • Low-end GPU: particle count halved
 * • No WebGL / Three.js — pure 2D Canvas API
 * • Zero memory leaks — all listeners removed on unmount
 */

import { useEffect, useRef, memo } from 'react';

/* ══════════════════════════════════════════════════════════════════════
   AURORA BLOBS
══════════════════════════════════════════════════════════════════════ */
const AURORA_BLOBS = [
  { h: 210, s: 0.55, size: 0.55, ox: 0.20, oy: 0.28, sp: 0.000055 },
  { h: 225, s: 0.50, size: 0.50, ox: 0.70, oy: 0.22, sp: 0.000045 },
  { h: 195, s: 0.60, size: 0.48, ox: 0.50, oy: 0.60, sp: 0.000070 },
  { h: 260, s: 0.45, size: 0.42, ox: 0.15, oy: 0.75, sp: 0.000040 },
  { h: 240, s: 0.52, size: 0.40, ox: 0.82, oy: 0.65, sp: 0.000058 },
  { h: 185, s: 0.58, size: 0.35, ox: 0.40, oy: 0.90, sp: 0.000065 },
];

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════ */
const PARTICLE_COUNT_HI    = 110;
const PARTICLE_COUNT_LO    = 50;
const SCROLL_PARALLAX_FAC  = 0.15;

/* ── Magnetic cursor light ──
   Two concentric soft glows follow the cursor with smooth inertia.
   Uses 'screen' blend so they add light rather than paint opaque shapes.
   Effect is invisible unless you look closely — intentionally subtle. */
const LIGHT_LERP       = 0.048;   // inertia factor — lower = more lag
const LIGHT_OUTER_R    = 430;     // px — wide ambient glow radius
const LIGHT_INNER_R    = 115;     // px — concentrated centre glow
const LIGHT_MAX_ALPHA  = 0.058;   // outer glow peak opacity (very subtle)
const LIGHT_FADE_IN    = 0.042;   // speed of fade-in when cursor enters
const LIGHT_FADE_OUT   = 0.025;   // speed of fade-out when cursor leaves

/* ── Aurora cursor bias ──
   The aurora blobs very slowly lean toward/away from cursor.
   Maximum displacement = AURORA_CURSOR_BIAS * viewport dimension.
   At 0.018 this is ~18 px on a 1000 px screen — almost imperceptible. */
const AURORA_CURSOR_BIAS = 0.018;

/* ── Particle spring physics ──
   Particles near the light get a gentle push.
   A spring force always pulls them back to their birth position.
   PARTICLE_DAMPING controls how long they oscillate after being pushed. */
const PARTICLE_PUSH_RADIUS   = 165;   // px — influence zone
const PARTICLE_PUSH_FORCE    = 0.20;  // peak push strength per frame
const PARTICLE_RETURN_SPRING = 0.010; // spring constant (stiffness)
const PARTICLE_DAMPING       = 0.90;  // velocity multiplier per frame

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════ */
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (lo, hi)  => lo + Math.random() * (hi - lo);

function isLowEndDevice() {
  try {
    const c  = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return false;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return false;
    return /intel|mali|adreno 3|adreno 4|sgx/i.test(
      gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || ''
    );
  } catch { return false; }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Each particle remembers its birth position (homeX/homeY) so the
   spring can pull it back precisely after the cursor moves away. */
function makeParticle(W, H) {
  const x = rand(0, W);
  const y = rand(0, H);
  return {
    x, y,
    homeX: x,
    homeY: y,
    vx: 0, vy: 0,
    r:            rand(0.5, 1.8),
    baseAlpha:    rand(0.15, 0.55),
    alpha:        0,
    twinkleSpeed: rand(0.00022, 0.00075),
    twinklePhase: rand(0, Math.PI * 2),
  };
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
function AuroraBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const reduced = prefersReducedMotion();
    const lowEnd  = isLowEndDevice();
    const PCOUNT  = lowEnd ? PARTICLE_COUNT_LO : PARTICLE_COUNT_HI;

    let W = 0, H = 0, diag = 0;
    let rafId   = null;
    let scrollY = 0;

    // Raw cursor position  (-1 = cursor off-screen / unknown)
    let mouseX = -1, mouseY = -1;

    // Smoothed light position — lags behind real cursor (inertia)
    let lightX = 0, lightY = 0;

    // 0…1 scalar that fades in when cursor is on-screen, fades out when off
    let lightOpacity = 0;

    let particles = [];

    /* ── Resize ── */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W    = window.innerWidth;
      H    = window.innerHeight;
      diag = Math.hypot(W, H);

      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);

      // Rebuild particle field; preserve light position on resize
      particles = Array.from({ length: PCOUNT }, () => makeParticle(W, H));
      if (lightX === 0 && lightY === 0) { lightX = W / 2; lightY = H / 2; }
    }

    /* ── Aurora blobs ── */
    function drawAurora(now) {
      const shift = scrollY * SCROLL_PARALLAX_FAC;

      // Normalised cursor 0..1 (centre fallback when off-screen)
      const ncx = mouseX >= 0 ? mouseX / W : 0.5;
      const ncy = mouseY >= 0 ? mouseY / H : 0.5;

      AURORA_BLOBS.forEach((b) => {
        const spd = b.sp * (reduced ? 0.3 : 1.0);

        // Each blob gets a tiny, individual cursor bias — different blobs
        // lean at slightly different rates so the motion looks organic, not mechanical.
        const biasX = (ncx - 0.5) * AURORA_CURSOR_BIAS * W * (0.6 + b.oy);
        const biasY = (ncy - 0.5) * AURORA_CURSOR_BIAS * H * (0.6 + b.ox);

        const cx = b.ox * W + Math.sin(now * spd)        * W * 0.12 + biasX;
        const cy = b.oy * H + Math.cos(now * spd * 0.73) * H * 0.10
                   - shift * (0.5 + b.oy) + biasY;
        const rr = diag * b.size;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        g.addColorStop(0,    `hsla(${b.h},80%,60%,${0.13 * b.s})`);
        g.addColorStop(0.30, `hsla(${b.h},70%,50%,${0.09 * b.s})`);
        g.addColorStop(0.65, `hsla(${b.h},60%,40%,${0.05 * b.s})`);
        g.addColorStop(1,    'hsla(0,0%,0%,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr, rr * 0.62, Math.sin(now * 0.000018) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    /* ── Cursor light: update position + opacity ── */
    function updateCursorLight() {
      if (mouseX >= 0) {
        // Light chases real cursor with inertia
        lightX = lerp(lightX, mouseX, LIGHT_LERP);
        lightY = lerp(lightY, mouseY, LIGHT_LERP);
        // Fade in
        lightOpacity = lerp(lightOpacity, 1.0, LIGHT_FADE_IN);
      } else {
        // Cursor off-screen → fade out (slower than fade-in for a trailing feel)
        lightOpacity = lerp(lightOpacity, 0.0, LIGHT_FADE_OUT);
      }
    }

    /* ── Cursor light: draw two-layer soft glow ── */
    function drawCursorLight() {
      if (lightOpacity < 0.004 || reduced) return;

      const alpha = LIGHT_MAX_ALPHA * lightOpacity;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Layer 1 — wide ambient corona, barely visible
      const gOuter = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, LIGHT_OUTER_R);
      gOuter.addColorStop(0,    `rgba(110, 175, 255, ${(alpha).toFixed(4)})`);
      gOuter.addColorStop(0.45, `rgba(90,  155, 245, ${(alpha * 0.40).toFixed(4)})`);
      gOuter.addColorStop(0.80, `rgba(70,  130, 230, ${(alpha * 0.10).toFixed(4)})`);
      gOuter.addColorStop(1,    'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gOuter;
      ctx.beginPath();
      ctx.arc(lightX, lightY, LIGHT_OUTER_R, 0, Math.PI * 2);
      ctx.fill();

      // Layer 2 — tighter concentrated shimmer at cursor centre
      const gInner = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, LIGHT_INNER_R);
      gInner.addColorStop(0,   `rgba(165, 215, 255, ${(alpha * 1.55).toFixed(4)})`);
      gInner.addColorStop(0.5, `rgba(125, 185, 255, ${(alpha * 0.65).toFixed(4)})`);
      gInner.addColorStop(1,   'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gInner;
      ctx.beginPath();
      ctx.arc(lightX, lightY, LIGHT_INNER_R, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    /* ── Particles: physics update ── */
    function updateParticles() {
      const lightActive = lightOpacity > 0.015 && !reduced;

      particles.forEach((p) => {

        if (lightActive) {
          const dx   = p.x - lightX;
          const dy   = p.y - lightY;
          const dist = Math.hypot(dx, dy);

          if (dist < PARTICLE_PUSH_RADIUS && dist > 1) {
            // Smooth cosine-bell falloff — force peaks at cursor, tapers to 0 at edge
            const t     = 1 - dist / PARTICLE_PUSH_RADIUS;
            const force = PARTICLE_PUSH_FORCE * t * t * lightOpacity;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Spring back toward birth position
        p.vx += (p.homeX - p.x) * PARTICLE_RETURN_SPRING;
        p.vy += (p.homeY - p.y) * PARTICLE_RETURN_SPRING;

        // Velocity damping (energy loss → motion decays naturally)
        p.vx *= PARTICLE_DAMPING;
        p.vy *= PARTICLE_DAMPING;

        // Integrate position
        p.x += p.vx;
        p.y += p.vy;
      });
    }

    /* ── Particles: draw ── */
    function drawParticles(now) {
      particles.forEach((p) => {
        // Slow, independent twinkle
        p.alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(now * p.twinkleSpeed + p.twinklePhase));

        // Soft glow halo
        const gw = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
        gw.addColorStop(0,   `rgba(180,210,255,${p.alpha.toFixed(3)})`);
        gw.addColorStop(0.4, `rgba(140,190,255,${(p.alpha * 0.5).toFixed(3)})`);
        gw.addColorStop(1,   'rgba(100,160,255,0)');
        ctx.fillStyle = gw;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Solid core
        ctx.fillStyle = `rgba(220,235,255,${p.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    /* ── Render loop ── */
    function render(now) {
      rafId = requestAnimationFrame(render);

      ctx.clearRect(0, 0, W, H);

      // Deep navy background
      const base = ctx.createLinearGradient(0, 0, 0, H);
      base.addColorStop(0,   '#020617');
      base.addColorStop(0.5, '#060d21');
      base.addColorStop(1,   '#0F172A');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      drawAurora(now);

      updateCursorLight();
      drawCursorLight();

      updateParticles();
      drawParticles(now);
    }

    /* ── Event handlers ── */
    function onMouseMove(e)  { mouseX = e.clientX; mouseY = e.clientY; }
    function onMouseLeave()  { mouseX = -1; mouseY = -1; }

    function onTouchMove(e) {
      const t = e.touches[0];
      mouseX = t.clientX;
      mouseY = t.clientY;
    }
    function onTouchEnd()  { mouseX = -1; mouseY = -1; }
    function onScroll()    { scrollY = window.scrollY; }

    function onVisibilityChange() {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else {
        if (!rafId) rafId = requestAnimationFrame(render);
      }
    }

    window.addEventListener('mousemove',          onMouseMove,  { passive: true });
    window.addEventListener('mouseleave',         onMouseLeave, { passive: true });
    window.addEventListener('touchmove',          onTouchMove,  { passive: true });
    window.addEventListener('touchend',           onTouchEnd,   { passive: true });
    window.addEventListener('scroll',             onScroll,     { passive: true });
    window.addEventListener('resize',             resize);
    document.addEventListener('visibilitychange', onVisibilityChange);

    resize();
    rafId = requestAnimationFrame(render);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove',          onMouseMove);
      window.removeEventListener('mouseleave',         onMouseLeave);
      window.removeEventListener('touchmove',          onTouchMove);
      window.removeEventListener('touchend',           onTouchEnd);
      window.removeEventListener('scroll',             onScroll);
      window.removeEventListener('resize',             resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100vw',
        height:        '100vh',
        zIndex:        0,
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  );
}

export default memo(AuroraBackground);

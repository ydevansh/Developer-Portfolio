/**
 * AuroraBackground.jsx — v3.0 "Magnetic Liquid Light"
 *
 * Premium HTML5 Canvas background inspired by Apple, OpenAI, Linear & Vercel.
 * Renders on a fixed full-screen canvas behind all page content (z-index: 0).
 *
 * Design Principles
 * ──────────────────
 *  • Deep luxury navy (#020617 → #060D21 → #0F172A) base
 *  • Magnetic Aurora: Blobs organically distort & stretch toward cursor
 *  • Soft Follow Light: Ultra-subtle, wide ambient blue glow follows pointer with smooth inertia
 *  • Repelling Stars: Nearby star particles gently drift away from cursor & spring back smoothly
 *  • Parallax & Flow: Continuous independent aurora drift + slow scroll parallax
 *  • Zero WebGL / 60 FPS Canvas 2D API / GPU Accelerated rendering
 */

import { useEffect, useRef, memo } from 'react';

/* ══════════════════════════════════════════════════════════════════════
   AURORA BLOBS
   Initial normalized origins (ox, oy), hues (h), sizes, and base speeds
══════════════════════════════════════════════════════════════════════ */
const AURORA_BLOBS = [
  { h: 212, s: 0.55, size: 0.52, ox: 0.20, oy: 0.28, sp: 0.000045, magneticFactor: 0.07 },
  { h: 230, s: 0.48, size: 0.48, ox: 0.72, oy: 0.24, sp: 0.000035, magneticFactor: 0.09 },
  { h: 195, s: 0.58, size: 0.45, ox: 0.48, oy: 0.58, sp: 0.000050, magneticFactor: 0.11 },
  { h: 255, s: 0.42, size: 0.40, ox: 0.16, oy: 0.78, sp: 0.000030, magneticFactor: 0.06 },
  { h: 240, s: 0.50, size: 0.38, ox: 0.84, oy: 0.68, sp: 0.000042, magneticFactor: 0.08 },
  { h: 185, s: 0.54, size: 0.36, ox: 0.42, oy: 0.88, sp: 0.000048, magneticFactor: 0.10 },
];

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS & CONFIG
══════════════════════════════════════════════════════════════════════ */
const PARTICLE_COUNT_HI   = 110;
const PARTICLE_COUNT_LO   = 50;
const SCROLL_PARALLAX_FAC = 0.14;

// Physics / Easing tuning for magnetic liquid interaction
const LERP_FACTOR       = 0.045; // Smooth delay follow factor
const INERTIA_DECAY     = 0.94;  // Velocity inertia persistence
const REPEL_RADIUS      = 160;   // Particle magnetic reaction radius (px)
const REPEL_STRENGTH    = 18;    // Max distance particles push away
const SPRING_RETURN     = 0.05;  // Particle spring recovery speed

const lerp  = (a, b, t) => a + (b - a) * t;
const rand  = (lo, hi)  => lo + Math.random() * (hi - lo);

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

function makeParticle(W, H) {
  const x = rand(0, W);
  const y = rand(0, H);
  return {
    x, y,
    ox: x, oy: y, // origin trajectory
    r: rand(0.7, 1.8),
    baseAlpha: rand(0.18, 0.60),
    alpha: 0,
    twinkleSpeed: rand(0.0003, 0.0009),
    twinklePhase: rand(0, Math.PI * 2),
    vx: rand(-0.03, 0.03),
    vy: rand(-0.03, 0.03),
    pushX: 0,
    pushY: 0,
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

    // Real cursor state
    let targetX = -1, targetY = -1;

    // Smooth magnetic center with lerp & velocity inertia
    let currentX = -1, currentY = -1;
    let velX = 0, velY = 0;
    let glowAlpha = 0; // Soft spotlight fade in/out

    let particles = [];

    /* ── Resize Handler ── */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      diag = Math.hypot(W, H);

      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);

      particles = Array.from({ length: PCOUNT }, () => makeParticle(W, H));
    }

    /* ── 1. Draw Base Gradient Background ── */
    function drawBaseBackground() {
      const baseGrd = ctx.createLinearGradient(0, 0, 0, H);
      baseGrd.addColorStop(0,   '#020617');
      baseGrd.addColorStop(0.5, '#060d21');
      baseGrd.addColorStop(1,   '#0f172a');
      ctx.fillStyle = baseGrd;
      ctx.fillRect(0, 0, W, H);
    }

    /* ── 2. Draw Magnetic Aurora Blobs ── */
    function drawAurora(now) {
      const shiftY = scrollY * SCROLL_PARALLAX_FAC;
      const isPointerActive = currentX >= 0 && currentY >= 0;

      // Normalized pointer offset relative to center (-0.5 to +0.5)
      const normPointerX = isPointerActive ? (currentX / W - 0.5) : 0;
      const normPointerY = isPointerActive ? (currentY / H - 0.5) : 0;

      // Speed vector influence for liquid stretching
      const speedMag = Math.hypot(velX, velY);
      const stretch  = Math.min(0.25, speedMag * 0.008);

      AURORA_BLOBS.forEach((b) => {
        const spd = b.sp * (reduced ? 0.3 : 1.0);
        
        // Base organic movement
        let cx = b.ox * W + Math.sin(now * spd) * W * 0.14;
        let cy = b.oy * H + Math.cos(now * spd * 0.72) * H * 0.11 - shiftY * (0.5 + b.oy);

        // Magnetic bend: Blobs gently stretch & gravitate toward pointer
        if (isPointerActive) {
          cx += normPointerX * W * b.magneticFactor;
          cy += normPointerY * H * b.magneticFactor;
        }

        const baseRadius = diag * b.size;
        const radiusX    = baseRadius * (1 + stretch);
        const radiusY    = baseRadius * (1 - stretch * 0.5);

        // Radial gradient glow
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius);
        g.addColorStop(0,    `hsla(${b.h}, 75%, 60%, ${0.12 * b.s})`);
        g.addColorStop(0.35, `hsla(${b.h}, 65%, 50%, ${0.08 * b.s})`);
        g.addColorStop(0.70, `hsla(${b.h}, 55%, 40%, ${0.04 * b.s})`);
        g.addColorStop(1,    'hsla(0, 0%, 0%, 0)');

        ctx.fillStyle = g;
        ctx.beginPath();
        const angle = Math.sin(now * 0.00002) * 0.3 + (velX * 0.002);
        ctx.ellipse(cx, cy, radiusX, radiusY, angle, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    /* ── 3. Draw Soft Blue Follow Spotlight (Apple/Linear style) ── */
    function drawSoftSpotlight() {
      if (reduced) return;

      const targetAlpha = targetX >= 0 ? 1 : 0;
      glowAlpha = lerp(glowAlpha, targetAlpha, 0.05);

      if (glowAlpha < 0.001 || currentX < 0) return;

      const lightRadius = Math.min(W, H) * 0.42; // Very wide, ultra-soft diffusion
      const speedIntensity = Math.min(1, Math.hypot(velX, velY) * 0.1);

      const spotGrd = ctx.createRadialGradient(
        currentX, currentY, 0,
        currentX, currentY, lightRadius
      );

      const alphaPeak = (0.09 + speedIntensity * 0.04) * glowAlpha;
      spotGrd.addColorStop(0,    `rgba(56, 189, 248, ${alphaPeak.toFixed(3)})`);
      spotGrd.addColorStop(0.3,  `rgba(99, 102, 241, ${(alphaPeak * 0.5).toFixed(3)})`);
      spotGrd.addColorStop(0.65, `rgba(30, 58, 138, ${(alphaPeak * 0.2).toFixed(3)})`);
      spotGrd.addColorStop(1,    'rgba(2, 6, 23, 0)');

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = spotGrd;
      ctx.beginPath();
      ctx.arc(currentX, currentY, lightRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* ── 4. Particles: Ambient Drift + Magnetic Repulsion ── */
    function drawParticles(now) {
      const isPointerActive = currentX >= 0 && currentY >= 0;

      particles.forEach((p) => {
        // Natural twinkle
        p.alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(now * p.twinkleSpeed + p.twinklePhase));

        // Ambient movement
        p.ox += p.vx;
        p.oy += p.vy;

        if (p.ox < -6)     p.ox = W + 6;
        if (p.ox > W + 6)  p.ox = -6;
        if (p.oy < -6)     p.oy = H + 6;
        if (p.oy > H + 6)  p.oy = -6;

        // Magnetic repulsion from cursor
        if (isPointerActive && !reduced) {
          const dx = p.ox - currentX;
          const dy = p.oy - currentY;
          const dist = Math.hypot(dx, dy);

          if (dist < REPEL_RADIUS && dist > 1) {
            const factor = (1 - dist / REPEL_RADIUS);
            const force  = factor * factor * REPEL_STRENGTH;
            const targetPushX = (dx / dist) * force;
            const targetPushY = (dy / dist) * force;

            p.pushX = lerp(p.pushX, targetPushX, 0.1);
            p.pushY = lerp(p.pushY, targetPushY, 0.1);
          } else {
            p.pushX = lerp(p.pushX, 0, SPRING_RETURN);
            p.pushY = lerp(p.pushY, 0, SPRING_RETURN);
          }
        } else {
          p.pushX = lerp(p.pushX, 0, SPRING_RETURN);
          p.pushY = lerp(p.pushY, 0, SPRING_RETURN);
        }

        const renderX = p.ox + p.pushX;
        const renderY = p.oy + p.pushY;

        // Glow halo around star particle
        const haloRadius = p.r * 3.2;
        const gw = ctx.createRadialGradient(renderX, renderY, 0, renderX, renderY, haloRadius);
        gw.addColorStop(0,   `rgba(190, 220, 255, ${p.alpha})`);
        gw.addColorStop(0.4, `rgba(130, 185, 255, ${p.alpha * 0.4})`);
        gw.addColorStop(1,   'rgba(100, 160, 255, 0)');

        ctx.fillStyle = gw;
        ctx.beginPath();
        ctx.arc(renderX, renderY, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core star point
        ctx.fillStyle = `rgba(230, 242, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    /* ── Update Smooth Inertia Physics ── */
    function updatePhysics() {
      if (targetX >= 0) {
        if (currentX < 0) {
          currentX = targetX;
          currentY = targetY;
        }

        const prevX = currentX;
        const prevY = currentY;

        // Exponential smooth lerp
        currentX = lerp(currentX, targetX, LERP_FACTOR);
        currentY = lerp(currentY, targetY, LERP_FACTOR);

        // Velocity tracking with inertia decay
        velX = lerp(velX, currentX - prevX, 0.15);
        velY = lerp(velY, currentY - prevY, 0.15);
      } else {
        // Natural inertia continuation after pointer leaves
        velX *= INERTIA_DECAY;
        velY *= INERTIA_DECAY;
        currentX += velX;
        currentY += velY;

        if (Math.hypot(velX, velY) < 0.05) {
          currentX = -1;
          currentY = -1;
        }
      }
    }

    /* ── Main Render Loop ── */
    function render(now) {
      rafId = requestAnimationFrame(render);

      updatePhysics();

      ctx.clearRect(0, 0, W, H);
      drawBaseBackground();
      drawAurora(now);
      drawSoftSpotlight();
      drawParticles(now);
    }

    /* ── Event Handlers ── */
    function onMouseMove(e)  { targetX = e.clientX; targetY = e.clientY; }
    function onMouseLeave()  { targetX = -1; targetY = -1; }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
      }
    }

    function onTouchEnd()  { targetX = -1; targetY = -1; }
    function onScroll()    { scrollY = window.scrollY; }

    function onVisibilityChange() {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else {
        if (!rafId) rafId = requestAnimationFrame(render);
      }
    }

    window.addEventListener('mousemove',          onMouseMove,        { passive: true });
    window.addEventListener('mouseleave',         onMouseLeave,       { passive: true });
    window.addEventListener('touchmove',          onTouchMove,        { passive: true });
    window.addEventListener('touchend',           onTouchEnd,         { passive: true });
    window.addEventListener('scroll',             onScroll,           { passive: true });
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
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}

export default memo(AuroraBackground);

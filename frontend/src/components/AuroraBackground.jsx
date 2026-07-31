/**
 * AuroraBackground.jsx — v1.2 "Calm Water"
 *
 * Premium HTML5 Canvas background for the portfolio.
 * Renders on a fixed full-screen canvas behind all page content (z-index: 0).
 *
 * Features
 * ─────────
 *  • Deep navy (#020617 → #0F172A) base
 *  • Soft aurora blobs (blue / cyan / violet) — slow organic drift
 *  • Tiny glowing star-particles with twinkling & gentle drift
 *  • Subtle water-touch ripples — soft, concentric, fade naturally
 *  • Scroll parallax on aurora blobs
 *  • Performance:
 *      – 60 FPS target; low-end halves particle count
 *      – RAF paused when tab is hidden (Page Visibility API)
 *      – prefers-reduced-motion: ripples disabled, slower aurora
 *  • Zero Three.js / WebGL — pure 2D Canvas API
 *  • No memory leaks: all listeners removed on unmount
 */

import { useEffect, useRef, memo } from 'react';

/* ══════════════════════════════════════════════════════════════════════
   AURORA BLOBS
══════════════════════════════════════════════════════════════════════ */
const AURORA_BLOBS = [
  { h: 210, s: 0.55, size: 0.55, ox: 0.20, oy: 0.28, sp: 0.00013 },
  { h: 225, s: 0.50, size: 0.50, ox: 0.70, oy: 0.22, sp: 0.00011 },
  { h: 195, s: 0.60, size: 0.48, ox: 0.50, oy: 0.60, sp: 0.00017 },
  { h: 260, s: 0.45, size: 0.42, ox: 0.15, oy: 0.75, sp: 0.00010 },
  { h: 240, s: 0.52, size: 0.40, ox: 0.82, oy: 0.65, sp: 0.00014 },
  { h: 185, s: 0.58, size: 0.35, ox: 0.40, oy: 0.90, sp: 0.00016 },
];

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════ */
const PARTICLE_COUNT_HI   = 120;
const PARTICLE_COUNT_LO   = 55;
const SCROLL_PARALLAX_FAC = 0.18;

// Ripple tuning
const RIPPLE_LIFETIME  = 2600;   // ms a ripple lives
const RIPPLE_MAX_R     = 180;    // final outer radius in px
const RIPPLE_SPAWN_GAP = 90;     // min ms between spawns
const RIPPLE_MIN_SPEED = 3;      // px movement needed to spawn
const RIPPLE_POOL      = 14;     // max concurrent ripples

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

function makeParticle(W, H) {
  return {
    x: rand(0, W), y: rand(0, H),
    r: rand(0.6, 2.0),
    baseAlpha: rand(0.20, 0.65),
    alpha: 0,
    twinkleSpeed: rand(0.0004, 0.0014),
    twinklePhase: rand(0, Math.PI * 2),
    vx: rand(-0.07, 0.07),
    vy: rand(-0.07, 0.07),
  };
}

/* ══════════════════════════════════════════════════════════════════════
   RIPPLE
   Each ripple has:
     x, y    — spawn point
     born    — timestamp
     strength — 0..1 (scales with cursor speed at spawn)
══════════════════════════════════════════════════════════════════════ */
function makeRipple(x, y, speed) {
  const s = Math.min(1, (speed - RIPPLE_MIN_SPEED) / 25); // 0..1
  return { x, y, born: performance.now(), strength: 0.35 + s * 0.45 };
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
    let rafId    = null;
    let lastTime = performance.now();
    let scrollY  = 0;

    // Cursor state
    let mouseX = -999, mouseY = -999;
    let prevX  = -999, prevY  = -999;
    let lastSpawn = 0;

    // Inertia glow trail (lags behind real cursor)
    let trailX = -999, trailY = -999;

    let particles = [];
    const ripples = [];

    /* ── Resize ── */
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

    /* ── Aurora blobs ── */
    function drawAurora(now) {
      const shift = scrollY * SCROLL_PARALLAX_FAC;
      AURORA_BLOBS.forEach((b) => {
        const spd = b.sp * (reduced ? 0.3 : 1.0);
        const cx  = b.ox * W + Math.sin(now * spd)        * W * 0.22;
        const cy  = b.oy * H + Math.cos(now * spd * 0.73) * H * 0.18
                    - shift * (0.5 + b.oy);
        const rr  = diag * b.size;
        const g   = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        g.addColorStop(0,    `hsla(${b.h},80%,60%,${0.13 * b.s})`);
        g.addColorStop(0.30, `hsla(${b.h},70%,50%,${0.09 * b.s})`);
        g.addColorStop(0.65, `hsla(${b.h},60%,40%,${0.05 * b.s})`);
        g.addColorStop(1,    'hsla(0,0%,0%,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr, rr * 0.62, Math.sin(now * 0.00005) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    /* ── Ripples ──────────────────────────────────────────────────────
       Each ripple renders three concentric soft rings with slight phase
       offsets so they look like natural water harmonics, not circles.

       Easing: ease-out cubic for radius (fast start, slow end)
       Opacity: rises briefly then falls — mimics real water energy decay
    ──────────────────────────────────────────────────────────────────── */
    function drawRipples(now) {
      if (reduced) return;

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp  = ripples[i];
        const age = now - rp.born;
        if (age >= RIPPLE_LIFETIME) { ripples.splice(i, 1); continue; }

        const t = age / RIPPLE_LIFETIME;           // 0 → 1 linear lifetime

        // Ease-out cubic: radius grows quickly at start, slow at end
        const eased = 1 - Math.pow(1 - t, 3);
        const R     = eased * RIPPLE_MAX_R;

        // Opacity: brief peak ~15% of life, then smooth fade
        const fade  = Math.pow(1 - t, 1.8) * Math.min(1, t / 0.06);
        const alpha = rp.strength * fade;

        if (alpha < 0.003 || R < 1) continue;

        // ── Ring 1 — primary wave front ──
        const lw1 = lerp(1.6, 0.3, t);
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, R, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(140,200,255,${alpha * 0.55})`;
        ctx.lineWidth   = lw1;
        ctx.stroke();

        // ── Ring 2 — inner harmonic (60% radius, slight phase lag) ──
        if (R > 14) {
          const R2  = R * 0.60;
          const lw2 = lerp(1.1, 0.2, t);
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, R2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(160,215,255,${alpha * 0.35})`;
          ctx.lineWidth   = lw2;
          ctx.stroke();
        }

        // ── Ring 3 — tertiary echo (30% radius) ──
        if (R > 32) {
          const R3  = R * 0.30;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, R3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(180,225,255,${alpha * 0.18})`;
          ctx.lineWidth   = lerp(0.8, 0.1, t);
          ctx.stroke();
        }

        // ── Soft inner fill — displaced water surface glow ──
        const fillR = R * 0.22;
        if (fillR > 3) {
          const gf = ctx.createRadialGradient(rp.x, rp.y, 0, rp.x, rp.y, fillR);
          gf.addColorStop(0,   `rgba(160,220,255,${alpha * 0.12})`);
          gf.addColorStop(1,   'rgba(120,190,255,0)');
          ctx.fillStyle = gf;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, fillR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    /* ── Cursor trail glow (inertia-lagged) ──
       A very soft ambient glow that follows the cursor with a slight
       delay. Adds depth and the "lens on water" feel.
    ── */
    function drawTrail() {
      if (mouseX < -900) return;

      // Seed trail on first move
      if (trailX < -900) { trailX = mouseX; trailY = mouseY; }

      // Lerp trail toward actual cursor (8% per frame ≈ ~150ms lag at 60fps)
      trailX = lerp(trailX, mouseX, 0.08);
      trailY = lerp(trailY, mouseY, 0.08);

      const gr = ctx.createRadialGradient(trailX, trailY, 0, trailX, trailY, 72);
      gr.addColorStop(0,   'rgba(120,195,255,0.07)');
      gr.addColorStop(0.5, 'rgba(100,175,255,0.03)');
      gr.addColorStop(1,   'rgba(80,150,255,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(trailX, trailY, 72, 0, Math.PI * 2);
      ctx.fill();
    }

    /* ── Particles ── */
    function drawParticles(now) {
      particles.forEach((p) => {
        p.alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(now * p.twinkleSpeed + p.twinklePhase));
        p.x += p.vx; p.y += p.vy;
        if (p.x < -4)    p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        if (p.y < -4)    p.y = H + 4;
        if (p.y > H + 4) p.y = -4;

        const gw = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
        gw.addColorStop(0,   `rgba(180,210,255,${p.alpha})`);
        gw.addColorStop(0.4, `rgba(140,190,255,${p.alpha * 0.5})`);
        gw.addColorStop(1,   'rgba(100,160,255,0)');
        ctx.fillStyle = gw;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(220,235,255,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    /* ── Render loop ── */
    function render(now) {
      rafId = requestAnimationFrame(render);
      lastTime = now;

      ctx.clearRect(0, 0, W, H);

      // Base gradient
      const base = ctx.createLinearGradient(0, 0, 0, H);
      base.addColorStop(0,   '#020617');
      base.addColorStop(0.5, '#060d21');
      base.addColorStop(1,   '#0F172A');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      drawAurora(now);
      drawRipples(now);
      drawTrail();
      drawParticles(now);
    }

    /* ── Events ── */
    function onMouseMove(e) {
      const now = performance.now();
      const cx  = e.clientX, cy = e.clientY;

      // Compute speed from last recorded position
      const speed = (prevX < -900)
        ? 0
        : Math.hypot(cx - prevX, cy - prevY);

      mouseX = cx; mouseY = cy;

      // Spawn ripple if cursor moved enough and cooldown passed
      if (!reduced && speed > RIPPLE_MIN_SPEED && now - lastSpawn > RIPPLE_SPAWN_GAP) {
        ripples.push(makeRipple(cx, cy, speed));
        if (ripples.length > RIPPLE_POOL) ripples.shift();
        lastSpawn = now;
      }

      prevX = cx; prevY = cy;
    }

    function onMouseLeave() { mouseX = -999; mouseY = -999; }

    function onTouchMove(e) {
      const t   = e.touches[0];
      const now = performance.now();
      const speed = (prevX < -900)
        ? 0
        : Math.hypot(t.clientX - prevX, t.clientY - prevY);

      mouseX = t.clientX; mouseY = t.clientY;

      if (!reduced && speed > RIPPLE_MIN_SPEED && now - lastSpawn > RIPPLE_SPAWN_GAP + 30) {
        ripples.push(makeRipple(t.clientX, t.clientY, speed));
        if (ripples.length > RIPPLE_POOL) ripples.shift();
        lastSpawn = now;
      }
      prevX = t.clientX; prevY = t.clientY;
    }

    function onTouchEnd() { mouseX = -999; mouseY = -999; }
    function onScroll()   { scrollY = window.scrollY; }

    function onVisibilityChange() {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else {
        lastTime = performance.now();
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

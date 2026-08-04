/**
 * AuroraBackground.jsx — v2.0 "Fluid Water"
 *
 * Premium HTML5 Canvas background for the portfolio.
 * Renders on a fixed full-screen canvas behind all page content (z-index: 0).
 *
 * Features
 * ─────────
 *  • Deep navy (#020617 → #0F172A) base
 *  • Soft aurora blobs (blue / cyan / violet) — slow organic drift
 *  • Tiny glowing star-particles with twinkling & gentle drift
 *  • Realistic fluid water simulation — heightfield-based displacement
 *    – Cursor "pushes" the water surface like a finger dragging across it
 *    – Waves stretch & blend directionally behind cursor motion
 *    – Natural inertia: water keeps moving after cursor stops
 *    – No circles, no rings — pure fluid distortion
 *  • Scroll parallax on aurora blobs
 *  • Performance:
 *      – 60 FPS target; low-end halves particle count & grid resolution
 *      – RAF paused when tab is hidden (Page Visibility API)
 *      – prefers-reduced-motion: fluid disabled, slower aurora
 *  • Zero Three.js / WebGL — pure 2D Canvas API
 *  • No memory leaks: all listeners removed on unmount
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
const PARTICLE_COUNT_HI   = 120;
const PARTICLE_COUNT_LO   = 55;
const SCROLL_PARALLAX_FAC = 0.18;

/* ── Fluid simulation grid ──
   A coarse heightfield grid — each cell stores a water height value.
   The wave PDE propagates these values organically across neighbours.
   Rendered with overlapping soft radial gradients → smooth fluid look.
*/
const GRID_COLS_HI = 80;
const GRID_COLS_LO = 40;

// Wave physics — balanced "smooth & gentle" feel
const WAVE_DAMPING  = 0.982;  // per-step energy retention
const WAVE_SPEED    = 0.07;   // propagation speed — calm but visible
const PUSH_RADIUS   = 0.042;  // cursor influence radius (fraction of diag-cells)
const PUSH_STRENGTH = 0.07;   // gentle but noticeable push
const INERTIA_LERP  = 0.014;  // trail lags smoothly behind cursor

// Render
const FLUID_OPACITY = 0.25;   // balanced water effect blend

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════ */
const lerp  = (a, b, t) => a + (b - a) * t;
const rand  = (lo, hi)  => lo + Math.random() * (hi - lo);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

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
    twinkleSpeed: rand(0.0002, 0.0007),
    twinklePhase: rand(0, Math.PI * 2),
    vx: rand(-0.025, 0.025),
    vy: rand(-0.025, 0.025),
  };
}

/* ══════════════════════════════════════════════════════════════════════
   FLUID GRID — 2D wave equation
══════════════════════════════════════════════════════════════════════ */
function makeFluidGrid(cols, rows) {
  const n = cols * rows;
  return {
    cols, rows,
    cur:  new Float32Array(n),
    prev: new Float32Array(n),
  };
}

/**
 * stepFluid — advance the wave equation one tick.
 * 2D wave PDE:  next[i] = (2*cur[i] - prev[i]) + c² * Laplacian(cur[i])
 * Damping simulates viscosity/energy loss.
 */
function stepFluid(g) {
  const { cols, rows, cur, prev } = g;
  const c2 = WAVE_SPEED * WAVE_SPEED * 4;
  const next = prev; // reuse prev buffer

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const i   = r * cols + c;
      const lap = cur[i - 1] + cur[i + 1] + cur[i - cols] + cur[i + cols] - 4 * cur[i];
      next[i] = clamp((2 * cur[i] - prev[i] + c2 * lap) * WAVE_DAMPING, -1, 1);
    }
  }

  // Absorb at edges (Dirichlet: height = 0)
  for (let c = 0; c < cols; c++) {
    next[c] = 0;
    next[(rows - 1) * cols + c] = 0;
  }
  for (let r = 0; r < rows; r++) {
    next[r * cols] = 0;
    next[r * cols + cols - 1] = 0;
  }

  g.prev = g.cur;
  g.cur  = next;
}

/**
 * disturbFluid — apply directional cursor wake to the grid.
 * The wake is an elongated ellipse in the direction of travel so it
 * looks like a finger dragging through water, not a circle stamp.
 */
function disturbFluid(g, nx, ny, vx, vy, speed) {
  const { cols, rows, cur } = g;
  const cx = nx * (cols - 1);
  const cy = ny * (rows - 1);

  const baseR  = Math.max(cols, rows) * PUSH_RADIUS;
  const aspect = 1 + speed * 3.5; // elongate along motion direction

  const mag = Math.hypot(vx, vy) || 1;
  const ux = vx / mag, uy = vy / mag;
  const px = -uy, py = ux; // perpendicular

  const radiusSq = baseR * baseR;
  const searchR  = Math.ceil(baseR * (1 + aspect));
  const ci = Math.round(cx), ri = Math.round(cy);

  for (let r = Math.max(1, ri - searchR); r < Math.min(rows - 1, ri + searchR); r++) {
    for (let c = Math.max(1, ci - searchR); c < Math.min(cols - 1, ci + searchR); c++) {
      const dx = c - cx, dy = r - cy;

      // Project onto wake axes
      const along = dx * ux + dy * uy;
      const perp  = dx * px + dy * py;

      // Elliptical gaussian: wide along motion, narrow across
      const distSq = (along * along) / (aspect * aspect) + (perp * perp);
      if (distSq > radiusSq) continue;

      const t = 1 - distSq / radiusSq;
      const influence = t * t * (3 - 2 * t); // smoothstep
      const force = -PUSH_STRENGTH * influence * speed;
      cur[r * cols + c] = clamp(cur[r * cols + c] + force, -1, 1);
    }
  }
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
    const GCOLS   = lowEnd ? GRID_COLS_LO : GRID_COLS_HI;

    let W = 0, H = 0, diag = 0;
    let rafId  = null;
    let scrollY = 0;

    // Cursor state (screen pixels, -1 = off-screen)
    let mouseX = -1, mouseY = -1;

    // Inertia trail — lags behind real cursor for continuous disturbance
    let trailX = -1, trailY = -1;
    let tvx = 0, tvy = 0;

    let particles = [];
    let grid = null;

    // Off-screen canvas for fluid rendering
    let offCanvas = null;
    let offCtx    = null;

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

      const rows = Math.max(4, Math.round(GCOLS * (H / W)));
      grid = makeFluidGrid(GCOLS, rows);

      offCanvas = document.createElement('canvas');
      offCanvas.width  = W;
      offCanvas.height = H;
      offCtx = offCanvas.getContext('2d');
    }

    /* ── Aurora blobs ── */
    function drawAurora(now) {
      const shift = scrollY * SCROLL_PARALLAX_FAC;
      AURORA_BLOBS.forEach((b) => {
        const spd = b.sp * (reduced ? 0.3 : 1.0);
        const cx  = b.ox * W + Math.sin(now * spd)        * W * 0.12;
        const cy  = b.oy * H + Math.cos(now * spd * 0.73) * H * 0.10
                    - shift * (0.5 + b.oy);
        const rr  = diag * b.size;
        const g   = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
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

    /* ── Update fluid physics + cursor force ── */
    function updateFluid() {
      if (reduced || !grid) return;

      stepFluid(grid);

      if (mouseX >= 0) {
        if (trailX < 0) { trailX = mouseX; trailY = mouseY; }

        const oldTX = trailX, oldTY = trailY;
        trailX = lerp(trailX, mouseX, INERTIA_LERP);
        trailY = lerp(trailY, mouseY, INERTIA_LERP);

        tvx = (trailX - oldTX) / W;
        tvy = (trailY - oldTY) / H;
        const speed = Math.hypot(tvx, tvy) * 60;

        if (speed > 0.001) {
          const nx = trailX / W;
          const ny = trailY / H;
          disturbFluid(grid, nx, ny, tvx, tvy, Math.min(0.7, speed * 2.5));
        }
      } else {
        tvx *= 0.96;
        tvy *= 0.96;
        if (trailX >= 0) {
          // Slowly decay trail position off-screen
          trailX += tvx * W;
          trailY += tvy * H;
          if (trailX < 0 || trailX > W || trailY < 0 || trailY > H) {
            trailX = -1;
            trailY = -1;
          }
        }
      }
    }

    /* ── Render fluid heightfield ──
       Each active grid cell is drawn as a soft, large radial gradient.
       Crests → cool blue highlight; Troughs → deeper blue-violet shadow.
       Gradients overlap → smooth organic surface with no visible grid.
       Composited with 'screen' so it blends naturally with aurora. ── */
    function drawFluid() {
      if (reduced || !grid || !offCtx) return;

      const { cols, rows, cur } = grid;
      const cw = W / (cols - 1);
      const ch = H / (rows - 1);

      offCtx.clearRect(0, 0, W, H);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const h = cur[r * cols + c];
          if (Math.abs(h) < 0.008) continue;

          const px = c * cw;
          const py = r * ch;
          const radius = Math.max(cw, ch) * 1.6;
          const intensity = Math.abs(h);

          let r0, g0, b0, a0;
          if (h > 0) {
            // Crest — bright blue-white highlight
            r0 = Math.round(140 + intensity * 80);
            g0 = Math.round(200 + intensity * 40);
            b0 = 255;
            a0 = intensity * 0.30;
          } else {
            // Trough — deeper blue-violet shadow
            r0 = Math.round(Math.max(0, 60  - intensity * 20));
            g0 = Math.round(100 + intensity * 30);
            b0 = Math.round(200 + intensity * 40);
            a0 = intensity * 0.22;
          }

          const grd = offCtx.createRadialGradient(px, py, 0, px, py, radius);
          grd.addColorStop(0,   `rgba(${r0},${g0},${b0},${a0.toFixed(3)})`);
          grd.addColorStop(0.5, `rgba(${Math.round(r0 * 0.7)},${Math.round(g0 * 0.7)},${b0},${(a0 * 0.4).toFixed(3)})`);
          grd.addColorStop(1,   'rgba(0,0,0,0)');
          offCtx.fillStyle = grd;
          offCtx.beginPath();
          offCtx.arc(px, py, radius, 0, Math.PI * 2);
          offCtx.fill();
        }
      }

      ctx.save();
      ctx.globalAlpha = FLUID_OPACITY;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(offCanvas, 0, 0);
      ctx.restore();
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

      ctx.clearRect(0, 0, W, H);

      const base = ctx.createLinearGradient(0, 0, 0, H);
      base.addColorStop(0,   '#020617');
      base.addColorStop(0.5, '#060d21');
      base.addColorStop(1,   '#0F172A');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      drawAurora(now);
      updateFluid();
      drawFluid();
      drawParticles(now);
    }

    /* ── Events ── */
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

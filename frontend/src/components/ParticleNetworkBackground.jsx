/**
 * ParticleNetworkBackground.jsx
 *
 * A premium, professional-grade Canvas 2D background:
 *   - Animated floating particles connected by gradient lines
 *   - Subtle mouse parallax effect
 *   - Deep dark base with cool-blue tinted particles
 *   - Smooth radial gradient overlay for depth
 *   - Fully respects prefers-reduced-motion
 *   - 60 FPS target with requestAnimationFrame
 *   - Auto-resizes with ResizeObserver
 *   - Zero external dependencies beyond React
 */

import React, { useEffect, useRef, memo } from 'react';

/* ── Configuration ──────────────────────────────────────────────── */
const CONFIG = {
  particleCount: 90,        // Desktop particle count
  particleCountMobile: 45,  // Mobile (< 768px)
  maxRadius: 2.2,           // Max dot size px
  minRadius: 0.6,
  speed: 0.28,              // Base speed multiplier
  connectionRadius: 160,    // Max distance to draw a line (px)
  connectionRadiusMobile: 110,
  lineOpacityMax: 0.18,     // Line alpha at closest distance
  particleOpacityMin: 0.25,
  particleOpacityMax: 0.75,
  mouseInfluenceRadius: 180, // px — how far mouse pulls particles
  mouseInfluenceStrength: 0.04,
  // Color palette (cool-blue / indigo / slate)
  colors: [
    [100, 160, 255],   // sky blue
    [130, 120, 255],   // indigo
    [160, 200, 255],   // light blue
    [80,  140, 220],   // ocean blue
    [200, 220, 255],   // very pale blue
  ],
};

function isMobile() {
  return window.innerWidth < 768;
}

function prefersReduced() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch { return false; }
}

function randomBetween(a, b) { return a + Math.random() * (b - a); }

/* ── Particle class ─────────────────────────────────────────────── */
class Particle {
  constructor(w, h, reduced) {
    this.reset(w, h, reduced);
  }

  reset(w, h, reduced) {
    this.x   = randomBetween(0, w);
    this.y   = randomBetween(0, h);
    const angle = randomBetween(0, Math.PI * 2);
    const spd   = reduced ? 0 : randomBetween(0.08, 1) * CONFIG.speed;
    this.vx  = Math.cos(angle) * spd;
    this.vy  = Math.sin(angle) * spd;
    this.r   = randomBetween(CONFIG.minRadius, CONFIG.maxRadius);
    this.op  = randomBetween(CONFIG.particleOpacityMin, CONFIG.particleOpacityMax);
    const col = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    this.color = col;
    // Twinkle
    this.twinkleSpeed = randomBetween(0.003, 0.012);
    this.twinklePhase = randomBetween(0, Math.PI * 2);
    // Mouse pull offset
    this.ox = 0;
    this.oy = 0;
  }

  update(w, h, t, mouseX, mouseY, reduced) {
    if (!reduced) {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse influence — gentle pull
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseInfluenceRadius && dist > 1) {
        const factor = (1 - dist / CONFIG.mouseInfluenceRadius) * CONFIG.mouseInfluenceStrength;
        this.x += dx * factor;
        this.y += dy * factor;
      }

      // Wrap edges
      if (this.x < -5)  this.x = w + 5;
      if (this.x > w + 5) this.x = -5;
      if (this.y < -5)  this.y = h + 5;
      if (this.y > h + 5) this.y = -5;
    }

    // Twinkle opacity
    this.currentOp = this.op * (0.7 + 0.3 * Math.sin(t * this.twinkleSpeed + this.twinklePhase));
  }

  draw(ctx) {
    const [r, g, b] = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${this.currentOp.toFixed(3)})`;
    ctx.fill();
  }
}

/* ── Component ──────────────────────────────────────────────────── */
function ParticleNetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduced = prefersReduced();
    let w = 0, h = 0;
    let particles = [];
    let raf = 0;
    let t = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    /* ── Init / Resize ── */
    function init() {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;

      const count = isMobile() ? CONFIG.particleCountMobile : CONFIG.particleCount;
      particles = Array.from({ length: count }, () => new Particle(w, h, reduced));
    }

    /* ── Draw Frame ── */
    function drawFrame(timestamp) {
      raf = requestAnimationFrame(drawFrame);
      t = timestamp;

      ctx.clearRect(0, 0, w, h);

      /* Background gradient */
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
      bg.addColorStop(0,   'rgba(8, 14, 35, 1)');
      bg.addColorStop(0.5, 'rgba(4, 9, 22, 1)');
      bg.addColorStop(1,   'rgba(2, 6, 15, 1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      /* Subtle radial accent (mouse-following) */
      if (!reduced && mouseX > -1000) {
        const accent = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 320);
        accent.addColorStop(0,   'rgba(60, 100, 200, 0.06)');
        accent.addColorStop(1,   'rgba(60, 100, 200, 0)');
        ctx.fillStyle = accent;
        ctx.fillRect(0, 0, w, h);
      }

      /* Update & draw particles */
      const connR = isMobile() ? CONFIG.connectionRadiusMobile : CONFIG.connectionRadius;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(w, h, t, mouseX, mouseY, reduced);
      }

      /* Draw connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < connR) {
            const alpha = CONFIG.lineOpacityMax * (1 - d / connR);
            // Gradient line — blends both particle colors
            const [ar, ag, ab] = a.color;
            const [br, bg2, bb] = b.color;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(${ar},${ag},${ab},${alpha.toFixed(3)})`);
            grad.addColorStop(1, `rgba(${br},${bg2},${bb},${alpha.toFixed(3)})`);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        particles[i].draw(ctx);
      }
    }

    /* ── Resize observer ── */
    const ro = new ResizeObserver(() => { init(); });
    ro.observe(canvas);
    init();
    raf = requestAnimationFrame(drawFrame);

    /* ── Mouse tracking ── */
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    function onMouseLeave() { mouseX = -9999; mouseY = -9999; }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}

export default memo(ParticleNetworkBackground);


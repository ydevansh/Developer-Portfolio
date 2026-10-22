/**
 * ParticleNetworkBackground.jsx
 *
 * Connected-Dots / Network Background:
 *   - Animated floating nodes connected by glowing lines
 *   - Gentle mouse interactivity and floating drift
 *   - High-performance HTML5 Canvas with smooth 60 FPS requestAnimationFrame
 *   - Auto-resizes and respects visibility change
 */

import React, { useEffect, useRef, memo } from 'react';

const CONFIG = {
  particleCount: 75,
  particleCountMobile: 35,
  maxRadius: 1.8,
  minRadius: 0.7,
  speed: 0.25,
  connectionRadius: 140,
  connectionRadiusMobile: 85,
  lineOpacityMax: 0.12,        // Sleek, minimal line brightness
  mouseInfluenceRadius: 90,    // Compact radius
  mouseInfluenceStrength: 0.005, // Ultra-gentle drift (never clumps dots together)
  colors: [
    [0, 229, 255],   // cyan
    [0, 180, 216],   // deep cyan
    [100, 160, 255], // sky blue
    [180, 240, 255], // light pale cyan
  ],
};

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

class Particle {
  constructor(w, h) {
    this.reset(w, h);
  }

  reset(w, h) {
    this.x = randomBetween(0, w);
    this.y = randomBetween(0, h);
    const angle = randomBetween(0, Math.PI * 2);
    const spd = randomBetween(0.1, 1) * CONFIG.speed;
    this.vx = Math.cos(angle) * spd;
    this.vy = Math.sin(angle) * spd;
    this.r = randomBetween(CONFIG.minRadius, CONFIG.maxRadius);
    this.op = randomBetween(0.18, 0.5);
    this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    this.twinkleSpeed = randomBetween(0.004, 0.012);
    this.twinklePhase = randomBetween(0, Math.PI * 2);
    this.currentOp = this.op;
  }

  update(w, h, t, mouseX, mouseY) {
    this.x += this.vx;
    this.y += this.vy;

    // Mouse influence
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CONFIG.mouseInfluenceRadius && dist > 1) {
      const factor = (1 - dist / CONFIG.mouseInfluenceRadius) * CONFIG.mouseInfluenceStrength;
      this.x += dx * factor;
      this.y += dy * factor;
    }

    // Wrap around screen
    if (this.x < -10) this.x = w + 10;
    if (this.x > w + 10) this.x = -10;
    if (this.y < -10) this.y = h + 10;
    if (this.y > h + 10) this.y = -10;

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

function ParticleNetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let particles = [];
    let raf = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    function init() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = isMobile() ? CONFIG.particleCountMobile : CONFIG.particleCount;
      particles = Array.from({ length: count }, () => new Particle(w, h));
    }

    function drawFrame(timestamp) {
      raf = requestAnimationFrame(drawFrame);

      ctx.clearRect(0, 0, w, h);

      // Deep dark cyber background
      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, w, h);

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(w, h, timestamp, mouseX, mouseY);
      }

      // Draw connection lines
      const connR = isMobile() ? CONFIG.connectionRadiusMobile : CONFIG.connectionRadius;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < connR) {
            const alpha = CONFIG.lineOpacityMax * (1 - d / connR);
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

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    init();
    raf = requestAnimationFrame(drawFrame);

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onMouseLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    function onVisibilityChange() {
      if (document.hidden) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      } else if (!raf) {
        raf = requestAnimationFrame(drawFrame);
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
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
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}

export default memo(ParticleNetworkBackground);

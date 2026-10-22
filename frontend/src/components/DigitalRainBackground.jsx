/**
 * DigitalRainBackground.jsx
 *
 * Highly performant, atmospheric Matrix-style Digital Rain.
 * Tuned to be subtle, elegant, and non-distracting so portfolio content
 * remains razor-sharp and effortlessly readable in the foreground.
 */

import React, { useEffect, useRef, memo } from 'react';

function DigitalRainBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Slightly wider column spacing for a cleaner, non-cluttered rain
    const fontSize = 16;
    const colStep = 22; // px per column
    let columns = Math.floor(width / colStep);
    let drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -60));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / colStep);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -60));
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener('resize', handleResize);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    let lastTime = 0;
    const fpsInterval = 35; // ~28-30 FPS: cinematic tempo + extremely lightweight

    const draw = (currentTime) => {
      animId = requestAnimationFrame(draw);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      // Clean, controlled fading trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", Consolas, monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Only run subset of active columns at any one time to prevent a solid curtain
        const text = Math.random() > 0.5 ? '1' : '0';
        const x = i * colStep;
        const y = drops[i] * fontSize;

        if (y >= 0 && y <= height + fontSize) {
          // Subtle, atmospheric cyan tones (not blinding full-white)
          if (Math.random() > 0.88) {
            ctx.fillStyle = 'rgba(200, 245, 255, 0.7)'; // soft glowing head
          } else {
            ctx.fillStyle = 'rgba(0, 229, 255, 0.38)'; // muted cyber cyan body
          }

          ctx.fillText(text, x, y);
        }

        // Reset drop with staggered random delay once off-screen
        if (y > height && Math.random() > 0.98) {
          drops[i] = Math.floor(Math.random() * -20);
        }

        drops[i]++;
      }
    };

    animId = requestAnimationFrame(draw);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      } else if (!animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(draw);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
        opacity: 0.42, // Balanced ambient level: clearly visible yet never overpowers text
      }}
    />
  );
}

export default memo(DigitalRainBackground);

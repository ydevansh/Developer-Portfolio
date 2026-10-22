/**
 * DigitalRainBackground.jsx
 *
 * Highly performant Matrix-style Digital Rain Canvas background
 * featuring vertical columns of falling binary numbers (0s and 1s)
 * with fading luminous cyan trails.
 *
 * Performance Optimizations:
 *   - Pure HTML5 Canvas 2D
 *   - RAF with FPS throttle (~33 FPS) to conserve GPU/CPU cycles
 *   - Pauses completely when document is hidden (tab switch)
 *   - Fixed full-screen viewport with pointer-events: none
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

    const fontSize = 15;
    let columns = Math.floor(width / fontSize);
    let drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    // Resize handling
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
      // Re-fill dark base on resize
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener('resize', handleResize);

    // Initial background fill
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    let lastTime = 0;
    const fpsInterval = 33; // ~30 FPS for authentic digital rain pacing & low CPU

    const draw = (currentTime) => {
      animId = requestAnimationFrame(draw);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      // Fading translucent black veil creates the fading trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.085)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", Consolas, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '1' : '0';
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the drop (bright white/cyan glow)
        if (Math.random() > 0.7) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#00E5FF';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = '#00E5FF';
          ctx.shadowColor = '#00E5FF';
          ctx.shadowBlur = 3;
        }

        ctx.fillText(text, x, y);

        // Reset shadow for next operations
        ctx.shadowBlur = 0;

        // Reset drop to top with randomized delay once it falls off screen
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animId = requestAnimationFrame(draw);

    // Pause when tab is hidden
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
      }}
    />
  );
}

export default memo(DigitalRainBackground);

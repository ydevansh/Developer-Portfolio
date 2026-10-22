/**
 * DigitalRainBackground.jsx
 *
 * Dark Stealth Binary Background (as shown in reference image):
 *   - Matte pure black background
 *   - Generously spaced vertical columns of binary numbers (0s and 1s)
 *   - Monochromatic subtle silver/white watermark opacity (0.04 – 0.12)
 *   - Calm, organic vertical fall with individual column speeds
 *   - Zero neon glare, ensuring 100% crystal-clear readability for all portfolio content
 *   - Extremely lightweight HTML5 Canvas with RAF pause on hidden tab
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

    const fontSize = 16;
    const colStep = 32; // Generous horizontal spacing between columns

    const createColumns = () => {
      const count = Math.floor(width / colStep);
      return Array.from({ length: count }, () => ({
        y: Math.random() * -100,
        speed: 0.35 + Math.random() * 0.45, // Individual calm falling speed
        chars: Array.from({ length: 30 }, () => (Math.random() > 0.5 ? '1' : '0')),
      }));
    };

    let columns = createColumns();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = createColumns();
      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener('resize', handleResize);

    // Initial base fill — sleek charcoal dark mode
    ctx.fillStyle = '#08090d';
    ctx.fillRect(0, 0, width, height);

    let lastTime = performance.now();

    const draw = (currentTime) => {
      animId = requestAnimationFrame(draw);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Soft fading veil matching the lighter charcoal tone
      ctx.fillStyle = 'rgba(8, 9, 13, 0.13)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", Consolas, "Courier New", monospace`;
      ctx.textBaseline = 'top';

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const x = i * colStep + 8;

        // Advance drop position
        col.y += col.speed * 42 * delta;

        // Occasional character morph (0 <-> 1)
        if (Math.random() > 0.96) {
          const randIdx = Math.floor(Math.random() * col.chars.length);
          col.chars[randIdx] = col.chars[randIdx] === '0' ? '1' : '0';
        }

        // Draw the vertical column of binary digits
        for (let j = 0; j < col.chars.length; j++) {
          const charY = col.y - j * fontSize * 1.3;

          if (charY > -fontSize && charY < height + fontSize) {
            // Slightly brighter, crisp silver-white tones for clear visibility
            if (j === 0) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.28)'; // Noticeable soft lead
            } else if (j < 5) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            } else if (j < 15) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.095)';
            } else {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.055)'; // Legible subtle trail
            }

            ctx.fillText(col.chars[j], x, charY);
          }
        }

        // Reset column to top once trailing end moves off screen
        const tailY = col.y - col.chars.length * fontSize * 1.3;
        if (tailY > height) {
          col.y = Math.random() * -60;
          col.speed = 0.35 + Math.random() * 0.45;
        }
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
      }}
    />
  );
}

export default memo(DigitalRainBackground);

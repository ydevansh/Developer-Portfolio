import React, { useEffect, useRef, useState } from 'react';

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const tickingRef = useRef(false);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }

      const nextProgress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));

      if (Math.abs(nextProgress - lastProgressRef.current) >= 0.1) {
        lastProgressRef.current = nextProgress;
        setProgress(nextProgress);
      }
    };

    const requestProgressUpdate = () => {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        tickingRef.current = false;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener('scroll', requestProgressUpdate, { passive: true });
    window.addEventListener('resize', requestProgressUpdate);

    return () => {
      window.removeEventListener('scroll', requestProgressUpdate);
      window.removeEventListener('resize', requestProgressUpdate);
    };
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-1 bg-transparent">
      <div
        className="h-full origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_18px_rgba(56,189,248,0.65)] will-change-transform"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}

/**
 * LoadingScreen.jsx — Advanced GSAP & Canvas 5-Phase Cinematic Sequence
 *
 * Sequence:
 *  Phase 1: The Bouncing Dot (Physics Simulation)
 *           Solid #000000 background, single white dot drops and bounces like a heavy rubber ball.
 *  Phase 2: The Name Shatter/Reveal
 *           On final impact, dot shatters into tumbled, rotating letters spelling "DEVANSH YADAV" (GSAP stagger).
 *  Phase 3: The 'PORTFOLIO' Text & Subtitle
 *           Name dissolves; massive 3D metallic/silver text "PORTFOLIO" scales in with subtitle.
 *  Phase 4: Particle Space Background & Dot-Matrix Portrait
 *           Canvas transitions into celestial starfield; behind "PORTFOLIO", a dot-matrix halftone portrait
 *           of Devansh Yadav (sampled from profile.jpg) fades into the scene.
 *  Phase 5: Navbar Entrance & Scroll Unlock
 *           Top navigation links fade in from the top right; unlocks body scroll for the rest of the website.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import profileImage from "../assets/profile.jpg";

const NAME = "DEVANSH YADAV";

export default function LoadingScreen({ onLoadingComplete }) {
  const containerRef = useRef(null);
  const dotRef = useRef(null);
  const nameWrapperRef = useRef(null);
  const portfolioTextRef = useRef(null);
  const subtitleRef = useRef(null);
  const navHeaderRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const doneCallbackRef = useRef(onLoadingComplete);
  useEffect(() => {
    doneCallbackRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

  // Clean unlock & complete handler
  const handleSequenceFinish = useCallback(() => {
    if (isCompleted) return;
    setIsCompleted(true);
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        doneCallbackRef.current?.();
      },
    });
  }, [isCompleted]);

  // Keyboard escape shortcut
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleSequenceFinish();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSequenceFinish]);

  useEffect(() => {
    // 1. Lock window scrolling during intro
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // 2. Setup Canvas: Starry Space & Dot-Matrix Portrait
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Celestial space particles
    const starCount = 140;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.75 + 0.2,
      vy: Math.random() * 0.35 + 0.12,
    }));

    // Dot-Matrix Portrait sampling
    let matrixDots = [];
    const img = new Image();
    img.src = profileImage;

    img.onload = () => {
      const offscreen = document.createElement("canvas");
      const sampleDim = 160;
      offscreen.width = sampleDim;
      offscreen.height = sampleDim;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, sampleDim, sampleDim);
      const imgData = offCtx.getImageData(0, 0, sampleDim, sampleDim);
      const data = imgData.data;

      const dots = [];
      const step = 3; // Grid density

      for (let y = 0; y < sampleDim; y += step) {
        for (let x = 0; x < sampleDim; x += step) {
          const idx = (y * sampleDim + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Subject mask (ignoring outer gradient corners)
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const isCorner =
            (x < 25 && y < 45) ||
            (x > sampleDim - 25 && y < 45) ||
            y < 8 ||
            y > sampleDim - 8;

          if (!isCorner && (lum > 0.18 || (r < 60 && g < 60 && b < 60))) {
            const isHighlight = lum > 0.65;
            dots.push({
              normX: (x - sampleDim / 2) / (sampleDim / 2),
              normY: (y - sampleDim / 2) / (sampleDim / 2),
              radius: Math.max(0.7, lum * 2.4),
              isHighlight,
              alpha: Math.min(0.95, Math.max(0.35, lum * 1.15)),
              driftOffset: Math.random() * Math.PI * 2,
            });
          }
        }
      }
      matrixDots = dots;
    };

    // Canvas alpha tweened by GSAP in Phase 4
    const canvasFade = { alpha: 0, time: 0 };

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      if (canvasFade.alpha <= 0) return;
      canvasFade.time += 0.02;

      // ── Starry Space Background ──
      ctx.fillStyle = "#ffffff";
      for (let s of stars) {
        s.y -= s.vy;
        if (s.y < 0) s.y = height;
        ctx.globalAlpha = s.alpha * canvasFade.alpha * 0.45;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }

      // ── Dot-Matrix Portrait ──
      const isMobile = width < 768;
      const portraitScale = isMobile
        ? Math.min(width, height) * 0.36
        : Math.min(width, height) * 0.28;
      const centerX = width / 2;
      const centerY = height * 0.46;

      for (let dot of matrixDots) {
        const floatY = Math.sin(canvasFade.time + dot.driftOffset) * 2;
        const px = centerX + dot.normX * portraitScale;
        const py = centerY + dot.normY * portraitScale + floatY;

        ctx.globalAlpha = dot.alpha * canvasFade.alpha;
        ctx.fillStyle = dot.isHighlight ? "#ffffff" : "#94a3b8";

        ctx.beginPath();
        ctx.arc(px, py, dot.radius * (isMobile ? 0.85 : 1), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    animId = requestAnimationFrame(render);

    // ── 3. Master GSAP Animation Timeline ──
    const tl = gsap.timeline();

    const letters = nameWrapperRef.current?.querySelectorAll(".tumble-letter");
    const targetFloor = window.innerHeight * 0.5;

    // Phase 1: The Bouncing Dot (Physics Simulation)
    tl.set(dotRef.current, { y: -80, opacity: 1, scale: 1 })
      // Drop 1 (gravity acceleration)
      .to(dotRef.current, {
        y: targetFloor,
        duration: 0.65,
        ease: "power2.in",
      })
      // Squish & First Rebound
      .to(dotRef.current, {
        scaleX: 1.45,
        scaleY: 0.65,
        duration: 0.08,
        ease: "power1.out",
      })
      .to(dotRef.current, {
        y: targetFloor - 130,
        scaleX: 0.9,
        scaleY: 1.1,
        duration: 0.36,
        ease: "power1.out",
      })
      // Drop 2
      .to(dotRef.current, {
        y: targetFloor,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 0.34,
        ease: "power2.in",
      })
      // Second smaller bounce
      .to(dotRef.current, {
        scaleX: 1.25,
        scaleY: 0.75,
        duration: 0.06,
        ease: "power1.out",
      })
      .to(dotRef.current, {
        y: targetFloor - 45,
        duration: 0.22,
        ease: "power1.out",
      })
      .to(dotRef.current, {
        y: targetFloor,
        duration: 0.2,
        ease: "power2.in",
      })

      // Phase 2: Name Shatter/Reveal on final impact
      .to(dotRef.current, {
        scale: 3.2,
        opacity: 0,
        duration: 0.12,
        ease: "power3.out",
      })
      .fromTo(
        letters,
        {
          opacity: 0,
          scale: 0.15,
          y: (i) => (Math.random() - 0.5) * 110,
          x: (i) => (Math.random() - 0.5) * 70,
          rotation: (i) => (Math.random() - 0.5) * 75,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          x: 0,
          rotation: 0,
          duration: 0.75,
          stagger: 0.035,
          ease: "back.out(2.0)",
        },
        "-=0.08"
      )

      // Phase 3: Developer Name fades out -> Massive 3D Metallic "PORTFOLIO" + Subtitle
      .to(letters, {
        opacity: 0,
        y: -35,
        scale: 0.8,
        duration: 0.45,
        stagger: 0.02,
        delay: 0.55,
        ease: "power2.in",
      })
      .fromTo(
        portfolioTextRef.current,
        {
          opacity: 0,
          scale: 0.5,
          letterSpacing: "0.05em",
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          scale: 1,
          letterSpacing: "0.18em",
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power3.out",
        },
        "-=0.15"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
        "-=0.3"
      )

      // Phase 4: Particle Space Background & Dot-Matrix Portrait
      .to(
        canvasFade,
        {
          alpha: 1,
          duration: 1.25,
          ease: "power2.inOut",
        },
        "-=0.45"
      )

      // Phase 5: Minimal Top Navigation Header & Scroll Unlock
      .fromTo(
        navHeaderRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      )
      // Hold scene for user enjoyment, then transition smoothly into website
      .to({}, { duration: 1.8 })
      .call(() => {
        handleSequenceFinish();
      });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      tl.kill();
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
    };
  }, [handleSequenceFinish]);

  const nameChars = NAME.split("");

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#000000] overflow-hidden select-none"
    >
      {/* HTML5 Canvas for Starry Space & Dot-Matrix Halftone Portrait */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Phase 5: Top Navigation Links */}
      <nav
        ref={navHeaderRef}
        className="absolute top-0 right-0 p-6 sm:p-8 z-30 opacity-0 flex items-center gap-6 sm:gap-9 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
      >
        <button
          onClick={handleSequenceFinish}
          className="hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit uppercase font-inherit tracking-inherit"
        >
          Home
        </button>
        <button
          onClick={handleSequenceFinish}
          className="hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit uppercase font-inherit tracking-inherit"
        >
          About
        </button>
        <button
          onClick={handleSequenceFinish}
          className="hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit uppercase font-inherit tracking-inherit"
        >
          Projects
        </button>
        <button
          onClick={handleSequenceFinish}
          className="hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit uppercase font-inherit tracking-inherit"
        >
          Contact
        </button>
      </nav>

      {/* Phase 1: Heavy Rubber Bouncing Dot */}
      <div
        ref={dotRef}
        className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_22px_rgba(255,255,255,1),0_0_40px_rgba(34,211,238,0.5)] opacity-0 z-20 pointer-events-none"
      />

      {/* Phase 2: Name Shatter/Tumble Letters */}
      <div
        ref={nameWrapperRef}
        className="absolute z-20 flex items-center justify-center pointer-events-none px-4"
      >
        {nameChars.map((char, i) => (
          <span
            key={i}
            className="tumble-letter text-white font-extrabold text-3xl sm:text-5xl lg:text-7xl font-['Outfit',sans-serif] tracking-wider opacity-0 inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          >
            {char === " " ? "\u00A0\u00A0" : char}
          </span>
        ))}
      </div>

      {/* Phase 3 & 4: 3D Metallic "PORTFOLIO" Text & Subtitle */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center pointer-events-none px-4">
        <h1
          ref={portfolioTextRef}
          className="opacity-0 font-['Outfit',sans-serif] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase metallic-3d-text leading-tight"
        >
          PORTFOLIO
        </h1>

        <p
          ref={subtitleRef}
          className="opacity-0 mt-3 sm:mt-5 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.38em] text-cyan-300 drop-shadow-[0_0_14px_rgba(34,211,238,0.7)]"
        >
          Full Stack & Python Developer
        </p>
      </div>

      {/* Discreet Skip Button (Upper Left) */}
      <button
        type="button"
        onClick={handleSequenceFinish}
        aria-label="Skip intro animation"
        className="absolute top-6 left-6 z-30 bg-white/5 border border-white/10 hover:border-white/30 backdrop-blur-md text-slate-300 hover:text-white font-['Inter',sans-serif] text-[10px] font-semibold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full transition-all duration-200"
      >
        Skip [ESC]
      </button>

      {/* 3D Metallic Typography Styling */}
      <style>{`
        .metallic-3d-text {
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #e2e8f0 20%,
            #94a3b8 45%,
            #ffffff 60%,
            #64748b 80%,
            #cbd5e1 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.9))
                  drop-shadow(0 15px 40px rgba(255, 255, 255, 0.15));
          text-shadow: 
            0 1px 0 #cbd5e1,
            0 2px 0 #94a3b8,
            0 3px 0 #64748b,
            0 4px 0 #475569,
            0 6px 1px rgba(0, 0, 0, 0.6),
            0 12px 25px rgba(0, 0, 0, 0.9);
        }
      `}</style>
    </div>
  );
}

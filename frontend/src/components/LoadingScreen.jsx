/**
 * LoadingScreen.jsx — Cinematic Particle Portrait & Progressive Reveal
 *
 * Implements the bespoke opening scene that seamlessly matches the portfolio theme:
 *  - 100% transparent container — directly exposes the live "Pure Minimal + Grain" background
 *  - Palette: Crisp white, soft gray (#cbd5e1), and subtle desaturated navy/slate blue accents
 *  - Stage 1: Progressive reveal of "DEVANSH YADAV" with bold, clean, highly readable typography
 *  - Stage 2: Text scatter effect — particles disperse outward with organic physics
 *  - Stage 3: Particle Portrait reveal — particles reassemble to form Devansh Yadav's portrait
 *  - Stage 4: Seamless transition — particles gently fade into the live homepage without any flash
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import profileImg from "../assets/profile.jpg";

// Animation timing configuration (ms)
const STAGE_REVEAL_DUR   = 1600; // Progressive text reveal
const STAGE_SCATTER_DUR  = 1000; // Text scatter into particles
const STAGE_PORTRAIT_DUR = 2200; // Portrait reassembly & reveal
const TOTAL_LOADER_TIME  = STAGE_REVEAL_DUR + STAGE_SCATTER_DUR + STAGE_PORTRAIT_DUR; // ~4.8s
const EXIT_DURATION_S    = 0.9;

const NAME = "DEVANSH YADAV";

export default function LoadingScreen({ onLoadingComplete }) {
  const [stage, setStage] = useState("reveal"); // "reveal" | "scatter" | "portrait" | "exit" | "done"
  const [revealedChars, setRevealedChars] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const canvasRef = useRef(null);
  const doneCallbackRef = useRef(onLoadingComplete);
  useEffect(() => {
    doneCallbackRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

  // Handle manual skip (keyboard ESC or click)
  const handleComplete = useCallback(() => {
    if (stage === "exit" || stage === "done") return;
    setStage("exit");
    setTimeout(() => {
      setIsDone(true);
      doneCallbackRef.current?.();
    }, EXIT_DURATION_S * 1000);
  }, [stage]);

  // Stage 1: Progressive character reveal
  useEffect(() => {
    if (stage !== "reveal") return;
    const interval = STAGE_REVEAL_DUR / (NAME.length + 2);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setRevealedChars(count);
      if (count >= NAME.length) {
        clearInterval(timer);
        setTimeout(() => setStage("scatter"), 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stage]);

  // Stage 2 & 3: Scatter & Portrait Transitions
  useEffect(() => {
    if (stage === "scatter") {
      const timer = setTimeout(() => {
        setStage("portrait");
      }, STAGE_SCATTER_DUR);
      return () => clearTimeout(timer);
    }
    if (stage === "portrait") {
      const timer = setTimeout(() => {
        handleComplete();
      }, STAGE_PORTRAIT_DUR);
      return () => clearTimeout(timer);
    }
  }, [stage, handleComplete]);

  // Keydown listener for quick skip
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleComplete();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleComplete]);

  // Canvas particle engine: scatter & portrait reassembly
  useEffect(() => {
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

    // Particle system state
    let particles = [];
    const NUM_PARTICLES = window.innerWidth < 768 ? 1100 : 1800;

    // Load and sample the portrait image
    const img = new Image();
    img.src = profileImg;

    let portraitTargets = [];

    img.onload = () => {
      const offCanvas = document.createElement("canvas");
      const sampleDim = 150;
      offCanvas.width = sampleDim;
      offCanvas.height = sampleDim;
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, sampleDim, sampleDim);
      const imgData = offCtx.getImageData(0, 0, sampleDim, sampleDim);
      const data = imgData.data;

      const candidates = [];
      const cx = sampleDim / 2;
      const cy = sampleDim / 2;
      const maxR = sampleDim * 0.48;

      for (let y = 0; y < sampleDim; y += 2) {
        for (let x = 0; x < sampleDim; x += 2) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > maxR) continue;

          const idx = (y * sampleDim + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

          // Subtle edge rejection and contrast emphasis
          if (brightness > 0.16) {
            candidates.push({
              normX: (x - cx) / (sampleDim * 0.5),
              normY: (y - cy) / (sampleDim * 0.5),
              brightness,
            });
          }
        }
      }

      // Distribute candidates into portraitTargets
      if (candidates.length > 0) {
        for (let i = 0; i < NUM_PARTICLES; i++) {
          portraitTargets.push(candidates[i % candidates.length]);
        }
      }
    };

    // Initialize particles around text center
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 220;
      particles.push({
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        scatterVx: (Math.random() - 0.5) * 16,
        scatterVy: (Math.random() - 0.5) * 16,
        baseSize: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.5 + 0.25,
        targetX: width / 2,
        targetY: height / 2,
        hasScattered: false,
      });
    }

    let startTime = performance.now();

    const render = (now) => {
      animId = requestAnimationFrame(render);
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      const isScattering = stage === "scatter";
      const isPortrait = stage === "portrait";
      const isExiting = stage === "exit";

      // Portrait display radius
      const portraitRadius = Math.min(width, height) * (width < 768 ? 0.28 : 0.21);
      const centerX = width / 2;
      const centerY = height / 2 - (isPortrait ? 25 : 0);

      // Render subtle circular accent ring during portrait stage
      if (isPortrait && !isExiting) {
        const ringProgress = Math.min(1, (elapsed - (STAGE_REVEAL_DUR + STAGE_SCATTER_DUR)) / 700);
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, portraitRadius + 14, 0, Math.PI * 2 * ringProgress);
        ctx.strokeStyle = "rgba(100, 150, 210, 0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, portraitRadius + 22, -Math.PI / 2, -Math.PI / 2 + Math.PI * ringProgress);
        ctx.strokeStyle = "rgba(148, 184, 219, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const target = portraitTargets[i];

        if (stage === "reveal") {
          // Micro gentle floating orbit around text
          p.x += p.vx * 0.4;
          p.y += p.vy * 0.4;
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          if (Math.hypot(dx, dy) > 280) {
            p.x = centerX + (Math.random() - 0.5) * 300;
            p.y = centerY + (Math.random() - 0.5) * 80;
          }

          ctx.fillStyle = `rgba(180, 210, 255, ${p.alpha * 0.45})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseSize * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else if (isScattering) {
          // Text burst outward
          if (!p.hasScattered) {
            p.vx = p.scatterVx;
            p.vy = p.scatterVy;
            p.hasScattered = true;
          }
          p.vx *= 0.92;
          p.vy *= 0.92;
          p.x += p.vx;
          p.y += p.vy;

          ctx.fillStyle = `rgba(200, 225, 255, ${p.alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseSize, 0, Math.PI * 2);
          ctx.fill();
        } else if (isPortrait || isExiting) {
          // Reassemble to portrait targets
          if (target) {
            const tx = centerX + target.normX * portraitRadius;
            const ty = centerY + target.normY * portraitRadius;

            // Spring physics toward target coordinate
            const dx = tx - p.x;
            const dy = ty - p.y;
            p.vx = (p.vx + dx * 0.08) * 0.82;
            p.vy = (p.vy + dy * 0.08) * 0.82;
            p.x += p.vx;
            p.y += p.vy;

            // Exit expansion
            if (isExiting) {
              p.x += (p.x - centerX) * 0.04;
              p.y += (p.y - centerY) * 0.04;
            }

            // High-fidelity monochromatic + cool navy palette matching portfolio theme
            const b = target.brightness;
            let rCol = 220, gCol = 230, bCol = 245, alpha = 0.65;

            if (b > 0.75) {
              // Crisp highlight: pure luminous white
              rCol = 255; gCol = 255; bCol = 255; alpha = 0.88;
            } else if (b > 0.45) {
              // Midtone: soft cool gray
              rCol = 203; gCol = 213; bCol = 225; alpha = 0.68;
            } else {
              // Shadow / accent: subtle desaturated blue
              rCol = 100; gCol = 145; bCol = 195; alpha = 0.42;
            }

            if (isExiting) alpha *= 0.5;

            ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha})`;
            ctx.beginPath();
            const ptSize = p.baseSize * (b > 0.6 ? 1.15 : 0.85);
            ctx.arc(p.x, p.y, ptSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [stage]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
          key="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_DURATION_S, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent", // Direct pass-through to existing portfolio background
            pointerEvents: stage === "exit" ? "none" : "auto",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          {/* Active Canvas Layer for Scatter & Portrait Particles */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Center Stage: Progressive Bold Typography */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            {/* Stage 1: Progressive Text Reveal */}
            <AnimatePresence>
              {stage === "reveal" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.08, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {/* Subtle initial symbol badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#38b6ff",
                        boxShadow: "0 0 10px rgba(56, 182, 255, 0.8)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "clamp(10px, 1.3vw, 12px)",
                        fontWeight: 600,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        color: "rgba(148, 184, 219, 0.85)",
                      }}
                    >
                      INITIALIZING
                    </span>
                  </div>

                  {/* Progressive Bold Name */}
                  <h1
                    style={{
                      margin: 0,
                      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
                      fontSize: "clamp(32px, 6.2vw, 72px)",
                      fontWeight: 800,
                      letterSpacing: "0.22em",
                      lineHeight: 1.15,
                      color: "#ffffff",
                      textShadow:
                        "0 0 20px rgba(148, 184, 219, 0.4), 0 0 40px rgba(56, 182, 255, 0.18)",
                    }}
                  >
                    {NAME.slice(0, revealedChars)}
                    {revealedChars < NAME.length && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "3px",
                          height: "0.85em",
                          marginLeft: "6px",
                          background: "#94b8db",
                          borderRadius: "1px",
                          verticalAlign: "middle",
                          boxShadow: "0 0 10px rgba(148, 184, 219, 0.8)",
                          animation: "pulseCursor 0.6s infinite alternate",
                        }}
                      />
                    )}
                  </h1>

                  {/* Clean desaturated underline */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: revealedChars / NAME.length }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{
                      width: "clamp(120px, 18vw, 220px)",
                      height: "1.5px",
                      background:
                        "linear-gradient(90deg, transparent, rgba(148, 184, 219, 0.8) 50%, transparent)",
                      marginTop: "4px",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage 3: Particle Portrait Label */}
            <AnimatePresence>
              {stage === "portrait" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    position: "absolute",
                    top: "calc(50% + clamp(110px, 18vw, 170px))",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    pointerEvents: "none",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "'Outfit', 'Inter', sans-serif",
                      fontSize: "clamp(15px, 2.2vw, 22px)",
                      fontWeight: 700,
                      letterSpacing: "0.26em",
                      color: "#ffffff",
                      textShadow: "0 0 16px rgba(148, 184, 219, 0.35)",
                    }}
                  >
                    DEVANSH YADAV
                  </p>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(10px, 1.2vw, 12px)",
                      fontWeight: 500,
                      letterSpacing: "0.35em",
                      color: "rgba(148, 184, 219, 0.75)",
                      textTransform: "uppercase",
                    }}
                  >
                    PORTFOLIO &bull; 2026
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Discreet Skip Button (Upper Right) */}
          <button
            type="button"
            onClick={handleComplete}
            aria-label="Skip intro animation"
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              zIndex: 10,
              background: "rgba(15, 23, 42, 0.5)",
              border: "1px solid rgba(148, 184, 219, 0.2)",
              backdropFilter: "blur(8px)",
              color: "rgba(203, 213, 225, 0.8)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: "999px",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "rgba(148, 184, 219, 0.5)";
              e.currentTarget.style.background = "rgba(20, 32, 58, 0.75)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(203, 213, 225, 0.8)";
              e.currentTarget.style.borderColor = "rgba(148, 184, 219, 0.2)";
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.5)";
            }}
          >
            SKIP [ESC]
          </button>

          <style>{`
            @keyframes pulseCursor {
              0% { opacity: 0.2; transform: scaleY(0.9); }
              100% { opacity: 1; transform: scaleY(1.05); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

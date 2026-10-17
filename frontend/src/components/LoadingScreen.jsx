/**
 * LoadingScreen.jsx — Cinematic Text Scatter & Real Particle Portrait
 *
 * Requirements fulfilled:
 *  1. Separate full-screen overlay (#08090B) with subtle monochrome grain.
 *  2. Underlying portfolio and backgrounds completely hidden while active.
 *  3. Full name: "DEVANSH YADAV" rendered in bold cinematic typography.
 *  4. Typography disintegration: particles originate directly from actual rendered letter shapes.
 *  5. Real particle portrait: particles reassemble into Devansh Yadav's real portrait (from profile.jpg).
 *  6. Full head, hair, face, collar, and suit shoulders visible (no semicircle cropping).
 *  7. Smooth graceful particle transition into the live portfolio homepage.
 *  8. Body scroll locked while active, restored upon completion.
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTRAIT_PARTICLES } from "../data/portraitParticleData";

const NAME = "DEVANSH YADAV";

// Timing configuration (milliseconds)
const DURATION_NAME_REVEAL = 1300; // Progressive letter reveal
const DURATION_NAME_HOLD   = 600;  // Full name held clearly for reading
const DURATION_SCATTER     = 900;  // Text disintegration into digital dust
const DURATION_PORTRAIT    = 1600; // Portrait reassembly and reveal
const DURATION_EXIT        = 800;  // Smooth fade into portfolio homepage

export default function LoadingScreen({ onLoadingComplete }) {
  // Stages: "reveal" -> "hold" -> "scatter" -> "portrait" -> "transition" -> "done"
  const [stage, setStage] = useState("reveal");
  const [revealedChars, setRevealedChars] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const doneRef = useRef(onLoadingComplete);
  useEffect(() => {
    doneRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

  // Lock body scroll while loader is active
  useEffect(() => {
    const origOverflowHtml = document.documentElement.style.overflow;
    const origOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = origOverflowHtml;
      document.body.style.overflow = origOverflowBody;
    };
  }, []);

  // Graceful completion handler
  const handleComplete = useCallback(() => {
    if (stage === "transition" || stage === "done") return;
    setStage("transition");
    setTimeout(() => {
      setIsDone(true);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      doneRef.current?.();
    }, DURATION_EXIT);
  }, [stage]);

  // Handle ESC key for immediate accessibility skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleComplete();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleComplete]);

  // Stage 1: Progressive character reveal
  useEffect(() => {
    if (stage !== "reveal") return;
    const charTime = DURATION_NAME_REVEAL / NAME.length;
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      setRevealedChars(idx);
      if (idx >= NAME.length) {
        clearInterval(timer);
        setTimeout(() => setStage("hold"), 100);
      }
    }, charTime);

    return () => clearInterval(timer);
  }, [stage]);

  // Stage 2: Hold full name, then trigger scatter
  useEffect(() => {
    if (stage === "hold") {
      const timer = setTimeout(() => {
        setStage("scatter");
      }, DURATION_NAME_HOLD);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Stage 3 & 4: Scatter to portrait, then transition to homepage
  useEffect(() => {
    if (stage === "scatter") {
      const timer = setTimeout(() => {
        setStage("portrait");
      }, DURATION_SCATTER);
      return () => clearTimeout(timer);
    }
    if (stage === "portrait") {
      const timer = setTimeout(() => {
        handleComplete();
      }, DURATION_PORTRAIT);
      return () => clearTimeout(timer);
    }
  }, [stage, handleComplete]);

  // Canvas particle engine: letter-origin particles + portrait reassembly
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
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

    const isMobile = width < 768;
    const NUM_PARTICLES = isMobile ? 1200 : 1800;
    const portraitData = PORTRAIT_PARTICLES.slice(0, NUM_PARTICLES);

    // ── Generate particles directly from rendered letter shapes ──
    const offCanvas = document.createElement("canvas");
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext("2d");

    const fontSize = isMobile ? Math.min(width * 0.088, 38) : Math.min(width * 0.062, 64);
    offCtx.font = `800 ${fontSize}px 'Outfit', 'Inter', sans-serif`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillStyle = "#ffffff";
    offCtx.fillText(NAME, width / 2, height / 2);

    const textImgData = offCtx.getImageData(0, 0, width, height).data;
    const letterPixels = [];

    // Sample letter coordinates with step
    const sampleStep = isMobile ? 3 : 2;
    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        const alpha = textImgData[(y * width + x) * 4 + 3];
        if (alpha > 128) {
          letterPixels.push({ x, y });
        }
      }
    }

    // Initialize particles originating directly on letter shapes
    const particles = [];
    const numLetterPix = letterPixels.length;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      let initX = width / 2;
      let initY = height / 2;

      if (numLetterPix > 0) {
        const lp = letterPixels[i % numLetterPix];
        initX = lp.x + (Math.random() - 0.5) * 1.5;
        initY = lp.y + (Math.random() - 0.5) * 1.5;
      }

      // Scatter velocity: varied directions, speeds, and distances
      const scatterAngle = Math.random() * Math.PI * 2;
      const scatterSpeed = Math.random() * 14 + 4;

      const pData = portraitData[i % portraitData.length] || [0, 0, 0.7];

      particles.push({
        x: initX,
        y: initY,
        originX: initX,
        originY: initY,
        vx: 0,
        vy: 0,
        scatterVx: Math.cos(scatterAngle) * scatterSpeed,
        scatterVy: Math.sin(scatterAngle) * scatterSpeed,
        normX: pData[0],
        normY: pData[1],
        brightness: pData[2],
        size: Math.random() * 1.4 + 1.0,
        hasScattered: false,
      });
    }

    // Pre-bake subtle film grain overlay
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = 160;
    grainCanvas.height = 160;
    const grainCtx = grainCanvas.getContext("2d");
    if (grainCtx) {
      const gData = grainCtx.createImageData(160, 160);
      for (let i = 0; i < gData.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        gData.data[i] = v;
        gData.data[i + 1] = v;
        gData.data[i + 2] = v;
        gData.data[i + 3] = (Math.random() * 18) | 0;
      }
      grainCtx.putImageData(gData, 0, 0);
    }
    const grainPattern = ctx.createPattern(grainCanvas, "repeat");

    // Animation Loop
    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // 1. Solid loader background (#08090B)
      ctx.fillStyle = "#08090B";
      ctx.fillRect(0, 0, width, height);

      // 2. Extremely subtle film grain texture
      if (grainPattern) {
        ctx.save();
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // If still in name reveal or hold stage, particles remain dormant on letters
      if (stage === "reveal" || stage === "hold") {
        return;
      }

      const isScattering = stage === "scatter";
      const isPortrait = stage === "portrait";
      const isTransition = stage === "transition";

      // Portrait dimensions: maintain natural aspect ratio, full head & shoulders visible
      const portraitScale = isMobile
        ? Math.min(width, height) * 0.40
        : Math.min(width, height) * 0.33;
      const portraitCenterX = width / 2;
      const portraitCenterY = height / 2 - (isMobile ? 15 : 25);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isScattering) {
          // Disintegrate text: particles burst outward with drag
          if (!p.hasScattered) {
            p.vx = p.scatterVx;
            p.vy = p.scatterVy;
            p.hasScattered = true;
          }
          p.vx *= 0.93;
          p.vy *= 0.93;
          p.x += p.vx;
          p.y += p.vy;

          ctx.fillStyle = `rgba(220, 230, 245, ${0.75})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (isPortrait || isTransition) {
          // Reassemble to real portrait coordinates
          const targetX = portraitCenterX + p.normX * portraitScale;
          const targetY = portraitCenterY + p.normY * portraitScale;

          const dx = targetX - p.x;
          const dy = targetY - p.y;

          // Spring damping physics towards target
          p.vx = (p.vx + dx * 0.075) * 0.83;
          p.vy = (p.vy + dy * 0.075) * 0.83;
          p.x += p.vx;
          p.y += p.vy;

          if (isTransition) {
            // Gentle expansion / dispersal into homepage reveal
            p.x += (p.x - portraitCenterX) * 0.035;
            p.y += (p.y - portraitCenterY) * 0.035;
          }

          // Shading: Pure white highlights, soft-gray midtones, subtle slate shadows
          const b = p.brightness;
          let r = 203, g = 213, bl = 225, a = 0.70;

          if (b >= 0.85) {
            // Crisp highlights (face highlights, white collar)
            r = 255; g = 255; bl = 255; a = 0.95;
          } else if (b >= 0.60) {
            // Midtones (face contour, cheeks, nose, hair texture)
            r = 218; g = 228; bl = 240; a = 0.78;
          } else {
            // Shadows (suit shoulders, tie, dark hair)
            r = 140; g = 160; bl = 185; a = 0.45;
          }

          if (isTransition) a *= 0.6;

          ctx.fillStyle = `rgba(${r}, ${g}, ${bl}, ${a})`;
          ctx.beginPath();
          const rad = p.size * (b >= 0.8 ? 1.15 : 0.9);
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.fill();
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
          ref={containerRef}
          key="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION_EXIT / 1000, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            minHeight: "100dvh",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#08090B", // Dedicated isolated near-black background
            pointerEvents: stage === "transition" ? "none" : "auto",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          {/* Active Canvas Layer for Disintegration & Real Portrait Assembly */}
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

          {/* Central Typography: Bold, Crisp "DEVANSH YADAV" */}
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
              padding: "0 20px",
              maxWidth: "100vw",
              boxSizing: "border-box",
            }}
          >
            {/* Stage 1 & 2: Progressive Reveal & Hold */}
            {(stage === "reveal" || stage === "hold") && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
                    fontSize: "clamp(26px, 5.8vw, 64px)",
                    fontWeight: 800,
                    letterSpacing: "0.22em",
                    lineHeight: 1.2,
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                    textShadow:
                      "0 0 20px rgba(255, 255, 255, 0.28), 0 0 45px rgba(100, 160, 240, 0.15)",
                  }}
                >
                  {NAME.slice(0, revealedChars)}
                  {revealedChars < NAME.length && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "3px",
                        height: "0.82em",
                        marginLeft: "6px",
                        background: "#cbd5e1",
                        borderRadius: "1px",
                        verticalAlign: "middle",
                        boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
                        animation: "cursorBlink 0.6s infinite alternate",
                      }}
                    />
                  )}
                </h1>
              </motion.div>
            )}

            {/* Stage 4: Portrait Label below the assembled portrait */}
            {stage === "portrait" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  position: "absolute",
                  top: "calc(50% + clamp(140px, 24vw, 210px))",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Outfit', 'Inter', sans-serif",
                    fontSize: "clamp(15px, 2.4vw, 22px)",
                    fontWeight: 700,
                    letterSpacing: "0.26em",
                    color: "#ffffff",
                    textShadow: "0 0 16px rgba(255, 255, 255, 0.3)",
                  }}
                >
                  DEVANSH YADAV
                </p>
              </motion.div>
            )}
          </div>

          {/* Discreet Skip Button (Upper Right) */}
          <button
            type="button"
            onClick={handleComplete}
            aria-label="Skip loader animation"
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              zIndex: 10,
              background: "rgba(18, 22, 30, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(10px)",
              color: "rgba(203, 213, 225, 0.75)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: "999px",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
              e.currentTarget.style.background = "rgba(28, 36, 50, 0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(203, 213, 225, 0.75)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.background = "rgba(18, 22, 30, 0.7)";
            }}
          >
            SKIP [ESC]
          </button>

          <style>{`
            @keyframes cursorBlink {
              0% { opacity: 0.2; }
              100% { opacity: 1; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

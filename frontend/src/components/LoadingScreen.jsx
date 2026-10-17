/**
 * LoadingScreen.jsx — Cinematic Text Scatter & Particle Portrait Merge
 *
 * Choreography:
 *  1. Full-screen near-black (#08090B) loader appears.
 *  2. Full name "DEVANSH YADAV" animates progressively with bold, clean typography (no overlap).
 *  3. Full name holds clearly for reading.
 *  4. Text disintegrates into digital dust particles originating from the actual letter glyphs.
 *  5. Particles assemble into the centered real monochrome portrait of Devansh Yadav (no overlapping text).
 *  6. Particles travel smoothly toward the exact position and circular shape of the hero profile image.
 *  7. Crossfades seamlessly into the real portfolio hero image.
 *  8. Loader fades out, revealing the portfolio homepage and Pure Minimal background.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTRAIT_PARTICLES } from "../data/portraitParticleData";

const NAME = "DEVANSH YADAV";

// Timing configuration (milliseconds)
const TIME_NAME_REVEAL = 1200; // Progressive character reveal
const TIME_NAME_HOLD   = 550;  // Full name hold for readability
const TIME_SCATTER     = 850;  // Text disintegration into dust
const TIME_PORTRAIT    = 1300; // Centered portrait assembly & hold
const TIME_MERGE       = 1100; // Travel & merge into hero profile image
const TIME_EXIT        = 700;  // Fade out into portfolio

export default function LoadingScreen({ onLoadingComplete, onMergeStart }) {
  // Stages: "reveal" -> "hold" -> "scatter" -> "portrait" -> "merge" -> "exit" -> "done"
  const [stage, setStage] = useState("reveal");
  const [revealedChars, setRevealedChars] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const doneRef = useRef(onLoadingComplete);
  const mergeRef = useRef(onMergeStart);
  useEffect(() => { doneRef.current = onLoadingComplete; }, [onLoadingComplete]);
  useEffect(() => { mergeRef.current = onMergeStart; }, [onMergeStart]);

  // Lock scrolling while loader is active
  useEffect(() => {
    const origHtml = document.documentElement.style.overflow;
    const origBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = origHtml;
      document.body.style.overflow = origBody;
    };
  }, []);

  // Completion trigger
  const handleComplete = useCallback(() => {
    if (stage === "exit" || stage === "done") return;
    setStage("exit");
    setTimeout(() => {
      setIsDone(true);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      doneRef.current?.();
    }, TIME_EXIT);
  }, [stage]);

  // ESC key for immediate skip
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
    const charInterval = TIME_NAME_REVEAL / NAME.length;
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      setRevealedChars(idx);
      if (idx >= NAME.length) {
        clearInterval(timer);
        setTimeout(() => setStage("hold"), 80);
      }
    }, charInterval);

    return () => clearInterval(timer);
  }, [stage]);

  // Stage 2: Hold full name
  useEffect(() => {
    if (stage === "hold") {
      const timer = setTimeout(() => {
        setStage("scatter");
      }, TIME_NAME_HOLD);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Stage 3: Scatter text into particles
  useEffect(() => {
    if (stage === "scatter") {
      const timer = setTimeout(() => {
        setStage("portrait");
      }, TIME_SCATTER);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Stage 4: Centered Portrait assembly, then trigger merge
  useEffect(() => {
    if (stage === "portrait") {
      const timer = setTimeout(() => {
        setStage("merge");
        mergeRef.current?.();
      }, TIME_PORTRAIT);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Stage 5: Merge into hero profile image, then exit
  useEffect(() => {
    if (stage === "merge") {
      const timer = setTimeout(() => {
        handleComplete();
      }, TIME_MERGE);
      return () => clearTimeout(timer);
    }
  }, [stage, handleComplete]);

  // ── Particle Engine ──
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

    // ── Generate particles from the exact rendered letter shapes ──
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
    const sampleStep = isMobile ? 3 : 2;

    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        const alpha = textImgData[(y * width + x) * 4 + 3];
        if (alpha > 128) {
          letterPixels.push({ x, y });
        }
      }
    }

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

      const scatterAngle = Math.random() * Math.PI * 2;
      const scatterSpeed = Math.random() * 14 + 4;
      const pData = portraitData[i % portraitData.length] || [0, 0, 0.7];

      particles.push({
        x: initX,
        y: initY,
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

    // Helper: compute destination profile image bounds in hero section
    const getHeroImageDestination = () => {
      let destX = width / 2;
      let destY = height * 0.44;
      let destRadius = Math.min(width, height) * 0.22;

      // Query tracking attribute set on hero image
      const allHeroImgs = document.querySelectorAll('[data-hero-portrait="true"]');
      for (const el of allHeroImgs) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          destX = rect.left + rect.width / 2;
          destY = rect.top + rect.height / 2;
          destRadius = rect.width / 2;
          return { destX, destY, destRadius };
        }
      }

      // Responsive fallback if element not measured
      if (width >= 1024) {
        const maxW = Math.min(width, 1280);
        destX = (width - maxW) / 2 + maxW * 0.76;
        destY = height * 0.42;
        destRadius = Math.min(maxW * 0.16, 192);
      } else {
        destX = width / 2;
        destY = height * 0.40;
        destRadius = Math.min(width * 0.26, 104);
      }
      return { destX, destY, destRadius };
    };

    let mergeStartTime = 0;

    // Render loop
    const render = (now) => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Solid loader background (#08090B)
      ctx.fillStyle = "#08090B";
      ctx.fillRect(0, 0, width, height);

      // Film grain texture
      if (grainPattern) {
        ctx.save();
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      if (stage === "reveal" || stage === "hold") {
        return;
      }

      const isScattering = stage === "scatter";
      const isPortrait = stage === "portrait";
      const isMerge = stage === "merge";
      const isExit = stage === "exit";

      if (isMerge && !mergeStartTime) {
        mergeStartTime = now;
      }

      // Initial centered portrait dimensions
      const centeredScale = isMobile
        ? Math.min(width, height) * 0.40
        : Math.min(width, height) * 0.33;
      const centeredCenterX = width / 2;
      const centeredCenterY = height / 2;

      // Destination in hero section
      const { destX, destY, destRadius } = getHeroImageDestination();

      // Merge progress (0.0 to 1.0)
      let mergeProgress = 0;
      if (isMerge) {
        const elapsed = now - mergeStartTime;
        mergeProgress = Math.min(1, elapsed / (TIME_MERGE * 0.85));
      } else if (isExit) {
        mergeProgress = 1;
      }

      // Smooth cubic ease for travel
      const easeTravel = mergeProgress * mergeProgress * (3 - 2 * mergeProgress);

      const currentCenterX = centeredCenterX + (destX - centeredCenterX) * easeTravel;
      const currentCenterY = centeredCenterY + (destY - centeredCenterY) * easeTravel;
      const currentScale = centeredScale + (destRadius * 1.05 - centeredScale) * easeTravel;

      // Render glowing circular aura around merging destination
      if (isMerge || isExit) {
        const auraAlpha = (isExit ? 0.3 : 0.65) * easeTravel;
        ctx.save();
        ctx.beginPath();
        ctx.arc(currentCenterX, currentCenterY, destRadius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${auraAlpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(currentCenterX, currentCenterY, destRadius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${auraAlpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isScattering) {
          // Disintegrate text into digital dust
          if (!p.hasScattered) {
            p.vx = p.scatterVx;
            p.vy = p.scatterVy;
            p.hasScattered = true;
          }
          p.vx *= 0.93;
          p.vy *= 0.93;
          p.x += p.vx;
          p.y += p.vy;

          ctx.fillStyle = "rgba(220, 230, 245, 0.75)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (isPortrait || isMerge || isExit) {
          // Target coordinate calculation:
          let targetX = currentCenterX + p.normX * currentScale;
          let targetY = currentCenterY + p.normY * currentScale;

          // When merging into the circular hero avatar, clamp to circular radius
          if (mergeProgress > 0) {
            const distFromCenter = Math.hypot(p.normX * currentScale, p.normY * currentScale);
            if (distFromCenter > destRadius * 0.98) {
              const angle = Math.atan2(p.normY, p.normX);
              targetX = currentCenterX + Math.cos(angle) * destRadius * 0.95;
              targetY = currentCenterY + Math.sin(angle) * destRadius * 0.95;
            }
          }

          const dx = targetX - p.x;
          const dy = targetY - p.y;

          // Responsive spring-lerp physics
          const springK = isMerge ? 0.095 : 0.075;
          const damp = isMerge ? 0.81 : 0.83;

          p.vx = (p.vx + dx * springK) * damp;
          p.vy = (p.vy + dy * springK) * damp;
          p.x += p.vx;
          p.y += p.vy;

          // Shading: Pure white highlights, soft-gray midtones, slate shadows
          const b = p.brightness;
          let r = 203, g = 213, bl = 225, a = 0.72;

          if (b >= 0.85) {
            r = 255; g = 255; bl = 255; a = 0.95;
          } else if (b >= 0.60) {
            r = 218; g = 228; bl = 240; a = 0.80;
          } else {
            r = 140; g = 160; bl = 185; a = 0.48;
          }

          // Crossfade smoothly as merge finishes
          if (isMerge) {
            a *= Math.max(0.15, 1 - easeTravel * 0.55);
          } else if (isExit) {
            a *= 0.2;
          }

          ctx.fillStyle = `rgba(${r}, ${g}, ${bl}, ${a})`;
          ctx.beginPath();
          const rad = p.size * (b >= 0.8 ? 1.15 : 0.9) * (isMerge ? Math.max(0.65, 1 - easeTravel * 0.2) : 1);
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
          transition={{ duration: TIME_EXIT / 1000, ease: [0.4, 0, 0.2, 1] }}
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
            background: stage === "merge" || stage === "exit"
              ? "rgba(8, 9, 11, 0.88)"
              : "#08090B",
            transition: "background 0.6s ease",
            pointerEvents: stage === "exit" || stage === "merge" ? "none" : "auto",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          {/* Active Canvas Layer */}
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

          {/* Central Typography: ONLY shown during reveal & hold stages */}
          {/* When portrait forms, the name is hidden so there is ZERO overlap! */}
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
              padding: "0 24px",
              maxWidth: "100vw",
              boxSizing: "border-box",
            }}
          >
            {(stage === "reveal" || stage === "hold") && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  maxWidth: "100%",
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
                    fontSize: "clamp(24px, 5.5vw, 62px)",
                    fontWeight: 800,
                    letterSpacing: "0.22em",
                    lineHeight: 1.25,
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

/**
 * LoadingScreen — Cinematic Edition
 *
 * Animation flow:
 *  1. Full-screen dark overlay (matches portfolio bg #020617)
 *  2. "DY" logo fades in — soft blue glow, gentle floating
 *  3. After 800 ms → typewriter "Devansh" with blinking cursor
 *  4. Typing done → 600 ms hold → glow intensifies
 *  5. Portfolio emerges (scale + opacity + blur removal)
 *     while logo + text cross-fade out
 *  6. Overlay self-removes; site becomes interactive immediately
 *
 * STRICTLY NO: spinner, progress bar, percentage, fake logs, cheap effects
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── tunables ─────────────────────────────────────────────────────────────────
const NAME      = "Devansh";
const LOGO_HOLD = 800;   // ms before typing starts
const CHAR_MS   = 110;   // ms per character base
const JITTER_MS = 20;    // ± random jitter per character
const POST_TYPE = 600;   // ms pause after typing completes
const EXIT_S    = 1.0;   // overlay exit duration (s)

// ─── component ────────────────────────────────────────────────────────────────
export default function LoadingScreen({ onLoadingComplete }) {
  const [phase,  setPhase]  = useState("logo"); // logo|typing|hold|exit|done
  const [nChars, setNChars] = useState(0);
  // `show` is the ONLY thing that controls AnimatePresence mounting.
  // Setting it false removes the child from the tree → exit animation fires.
  const [show,   setShow]   = useState(true);
  const doneRef = useRef(onLoadingComplete);
  useEffect(() => { doneRef.current = onLoadingComplete; }, [onLoadingComplete]);

  // Phase: logo → typing
  useEffect(() => {
    if (phase !== "logo") return;
    const t = setTimeout(() => setPhase("typing"), LOGO_HOLD);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase: typing
  useEffect(() => {
    if (phase !== "typing") return;
    if (nChars >= NAME.length) {
      const t = setTimeout(() => setPhase("hold"), 50);
      return () => clearTimeout(t);
    }
    const delay = CHAR_MS + (Math.random() * JITTER_MS * 2 - JITTER_MS);
    const t = setTimeout(() => setNChars(n => n + 1), delay);
    return () => clearTimeout(t);
  }, [phase, nChars]);

  // Phase: hold → exit
  // Setting show=false triggers AnimatePresence to play the exit animation.
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => {
      setPhase("exit");
      setShow(false); // ← this is what actually starts the exit animation
    }, POST_TYPE);
    return () => clearTimeout(t);
  }, [phase]);

  // Called by AnimatePresence once the exit animation fully completes.
  const handleExitComplete = useCallback(() => {
    doneRef.current?.();
    setPhase("done");
  }, []);

  if (phase === "done") return null;

  const isExiting  = phase === "exit";
  const showText   = phase !== "logo";
  const intensify  = phase === "hold" || phase === "exit";
  const showCursor = phase === "typing";

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          key="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_S, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position:       "fixed",
            inset:          0,
            zIndex:         9999,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            background:     "#020617",
            pointerEvents:  isExiting ? "none" : "all",
            willChange:     "opacity",
          }}
        >
          {/* ── Ambient radial glow behind everything ─────────────────── */}
          <motion.div
            animate={{ opacity: intensify ? 0.20 : 0.10 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              position:      "absolute",
              inset:         0,
              background:    "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(56,182,255,0.20) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* ── Content stack ─────────────────────────────────────────── */}
          <div
            style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              gap:            "clamp(22px, 3.5vw, 34px)",
              pointerEvents:  "none",
              userSelect:     "none",
            }}
          >
            {/* ── DY Logo ────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Floating — no spinning, no scaling pulse */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration:  4.2,
                  repeat:    Infinity,
                  ease:      "easeInOut",
                }}
              >
                <LogoMark intensify={intensify} />
              </motion.div>
            </motion.div>

            {/* ── Typewriter "Devansh" ───────────────────────────────── */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  key="typewriter-row"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "2px",
                    height:     "1.2em",
                  }}
                >
                  {/* Typed name */}
                  <span
                    style={{
                      fontFamily:    "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize:      "clamp(26px, 4.5vw, 50px)",
                      fontWeight:    300,
                      letterSpacing: "0.22em",
                      lineHeight:    1,
                      color:         "#ddeeff",
                      filter:        intensify
                        ? "drop-shadow(0 0 18px rgba(56,182,255,0.7)) drop-shadow(0 0 48px rgba(56,182,255,0.28))"
                        : "drop-shadow(0 0 11px rgba(56,182,255,0.48)) drop-shadow(0 0 30px rgba(56,182,255,0.16))",
                      transition:    "filter 0.9s ease",
                      // Reserve width so layout doesn't shift during typing
                      minWidth:      `${NAME.length * 0.62}em`,
                    }}
                  >
                    {NAME.slice(0, nChars)}
                  </span>

                  {/* Blinking cursor — disappears when typing finishes */}
                  {showCursor && (
                    <span
                      style={{
                        display:       "inline-block",
                        width:         "2px",
                        height:        "1.0em",
                        background:    "rgba(56,182,255,0.9)",
                        borderRadius:  "1px",
                        marginLeft:    "2px",
                        boxShadow:     "0 0 8px rgba(56,182,255,0.7)",
                        animation:     "dy-cursor-blink 0.85s step-end infinite",
                        alignSelf:     "center",
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cursor keyframe */}
          <style>{`
            @keyframes dy-cursor-blink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// ─── DY Logo Mark ─────────────────────────────────────────────────────────────
function LogoMark({ intensify }) {
  const size = "clamp(76px, 13vw, 112px)";

  return (
    <div
      style={{
        position:       "relative",
        width:          size,
        height:         size,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}
    >
      {/* Diffuse glow halo */}
      <motion.div
        animate={{
          opacity: intensify ? 0.60 : 0.28,
          scale:   intensify ? 1.12 : 1.00,
        }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        style={{
          position:      "absolute",
          inset:         "-16px",
          borderRadius:  "50%",
          background:    "radial-gradient(circle, rgba(56,182,255,0.25) 0%, transparent 70%)",
          filter:        "blur(14px)",
          pointerEvents: "none",
        }}
      />

      {/* Thin border ring */}
      <motion.div
        animate={{
          opacity:     intensify ? 0.50 : 0.20,
        }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        style={{
          position:      "absolute",
          inset:         0,
          borderRadius:  "50%",
          border:        "1px solid rgba(56,182,255,0.35)",
          pointerEvents: "none",
        }}
      />

      {/* DY mark */}
      <span
        style={{
          fontFamily:           "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize:             "clamp(24px, 4vw, 40px)",
          fontWeight:           700,
          letterSpacing:        "-0.01em",
          lineHeight:           1,
          background:           "linear-gradient(135deg, #38b6ff 0%, #0074D9 55%, #38b6ff 100%)",
          backgroundClip:       "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
          color:                "transparent",
          filter:               intensify
            ? "drop-shadow(0 0 16px rgba(56,182,255,0.75)) drop-shadow(0 0 40px rgba(56,182,255,0.3))"
            : "drop-shadow(0 0 10px rgba(56,182,255,0.55)) drop-shadow(0 0 26px rgba(56,182,255,0.2))",
          transition:    "filter 0.9s ease",
          pointerEvents: "none",
        }}
      >
        DY
      </span>
    </div>
  );
}


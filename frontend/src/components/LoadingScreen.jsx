/**
 * LoadingScreen — Premium Cinematic Edition v2
 *
 * Flow: logo → type "Devansh" → type "Yadav" → hold → exit → done
 *
 * New vs v1:
 *  • 38 floating glowing particles
 *  • Subtle HUD grid overlay
 *  • Horizontal scan-line sweep (one-shot)
 *  • Corner bracket decorations
 *  • 3 orbital SVG rings (cw + ccw + inner-dashed)
 *  • Live progress arc tied to total typing progress
 *  • "Yadav" second-line typewriter (lighter weight)
 *  • "Developer · Designer · Creator" subtitle on hold
 *  • Animated divider line between name + subtitle
 *  • Exit: scale + blur collapse instead of plain fade
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── tunables ─────────────────────────────────────────────────────────────────
const NAME1        = "Devansh";
const NAME2        = "Yadav";
const LOGO_HOLD    = 900;   // ms before typing starts
const CHAR_MS      = 105;   // ms per character
const JITTER_MS    = 22;    // ± jitter
const INTER_PAUSE  = 280;   // ms gap between NAME1 done → NAME2 start
const POST_TYPE    = 750;   // ms hold after fully typed
const EXIT_S       = 1.1;   // exit duration (s)
const N_PARTICLES  = 38;

// ─── stable particle seed ────────────────────────────────────────────────────
function useParticles() {
  return useMemo(() =>
    Array.from({ length: N_PARTICLES }, (_, i) => ({
      id:     i,
      x:      Math.random() * 100,
      y:      20 + Math.random() * 72,
      size:   1.2 + Math.random() * 2.8,
      baseOp: 0.12 + Math.random() * 0.40,
      dur:    7 + Math.random() * 11,
      delay:  Math.random() * 6,
      driftX: (Math.random() - 0.5) * 8,
      riseVh: 10 + Math.random() * 20,
    })),
  []);
}

// ─── main component ───────────────────────────────────────────────────────────
export default function LoadingScreen({ onLoadingComplete }) {
  const [phase, setPhase] = useState("logo");
  const [n1,    setN1]    = useState(0);
  const [n2,    setN2]    = useState(0);
  const [show,  setShow]  = useState(true);
  const particles = useParticles();
  const doneRef = useRef(onLoadingComplete);
  useEffect(() => { doneRef.current = onLoadingComplete; }, [onLoadingComplete]);

  // logo → typing1
  useEffect(() => {
    if (phase !== "logo") return;
    const t = setTimeout(() => setPhase("typing1"), LOGO_HOLD);
    return () => clearTimeout(t);
  }, [phase]);

  // typing1: fill NAME1 char by char
  useEffect(() => {
    if (phase !== "typing1") return;
    if (n1 >= NAME1.length) {
      const t = setTimeout(() => setPhase("typing2"), INTER_PAUSE);
      return () => clearTimeout(t);
    }
    const d = CHAR_MS + (Math.random() * JITTER_MS * 2 - JITTER_MS);
    const t = setTimeout(() => setN1(n => n + 1), d);
    return () => clearTimeout(t);
  }, [phase, n1]);

  // typing2: fill NAME2 char by char
  useEffect(() => {
    if (phase !== "typing2") return;
    if (n2 >= NAME2.length) {
      const t = setTimeout(() => setPhase("hold"), 60);
      return () => clearTimeout(t);
    }
    const d = CHAR_MS + (Math.random() * JITTER_MS * 2 - JITTER_MS);
    const t = setTimeout(() => setN2(n => n + 1), d);
    return () => clearTimeout(t);
  }, [phase, n2]);

  // hold → exit
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => { setPhase("exit"); setShow(false); }, POST_TYPE);
    return () => clearTimeout(t);
  }, [phase]);

  const handleExitComplete = useCallback(() => {
    doneRef.current?.();
    setPhase("done");
  }, []);

  if (phase === "done") return null;

  const isExiting   = phase === "exit";
  const showText    = phase !== "logo";
  const intensify   = phase === "hold" || phase === "exit";
  const showCursor1 = phase === "typing1";
  const showCursor2 = phase === "typing2";
  const showName2   = phase === "typing2" || phase === "hold" || phase === "exit";
  const progress    = (n1 + n2) / (NAME1.length + NAME2.length);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          key="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
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
            overflow:       "hidden",
            pointerEvents:  isExiting ? "none" : "all",
          }}
        >
          {/* ── Background glow layers ──────────────────────────────── */}
          <motion.div
            animate={{ opacity: intensify ? 1.0 : 0.65 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 72% 55% at 50% 50%, rgba(56,182,255,0.13) 0%, transparent 68%)",
            }}
          />
          <motion.div
            animate={{ opacity: intensify ? 0.70 : 0.30 }}
            transition={{ duration: 1.5 }}
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 38% 32% at 28% 72%, rgba(99,102,241,0.09) 0%, transparent 62%)",
            }}
          />
          <motion.div
            animate={{ opacity: intensify ? 0.60 : 0.25 }}
            transition={{ duration: 1.5 }}
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 36% 28% at 72% 28%, rgba(56,182,255,0.08) 0%, transparent 60%)",
            }}
          />

          {/* ── HUD grid overlay ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: intensify ? 0.038 : 0.020 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: `
                linear-gradient(rgba(56,182,255,0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(56,182,255,0.6) 1px, transparent 1px)
              `,
              backgroundSize: "64px 64px",
            }}
          />

          {/* ── Scan-line sweep ─────────────────────────────────────── */}
          <motion.div
            initial={{ top: "-3px" }}
            animate={{ top: "104%" }}
            transition={{ duration: 1.5, ease: "linear", delay: 0.05 }}
            style={{
              position:   "absolute",
              left:       0,
              right:      0,
              height:     "2px",
              background: "linear-gradient(90deg, transparent 0%, rgba(56,182,255,0.5) 15%, rgba(56,182,255,0.95) 50%, rgba(56,182,255,0.5) 85%, transparent 100%)",
              boxShadow:  "0 0 24px rgba(56,182,255,0.55), 0 0 70px rgba(56,182,255,0.22)",
              pointerEvents: "none",
              zIndex:     10,
            }}
          />

          {/* ── Corner HUD brackets ─────────────────────────────────── */}
          {[
            { style: { top: 24, left: 24 },   rotate: 0   },
            { style: { top: 24, right: 24 },   rotate: 90  },
            { style: { bottom: 24, right: 24 },rotate: 180 },
            { style: { bottom: 24, left: 24 }, rotate: 270 },
          ].map(({ style: pos, rotate }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: intensify ? 0.60 : 0.28 }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.07 }}
              style={{
                position:     "absolute",
                ...pos,
                width:        28,
                height:       28,
                transform:    `rotate(${rotate}deg)`,
                borderTop:    "1.5px solid rgba(56,182,255,0.70)",
                borderLeft:   "1.5px solid rgba(56,182,255,0.70)",
                borderRadius: "2px 0 0 0",
                boxShadow:    "0 0 8px rgba(56,182,255,0.28)",
                pointerEvents:"none",
              }}
            />
          ))}

          {/* ── Floating particles ──────────────────────────────────── */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              animate={{
                opacity: [0, p.baseOp, p.baseOp * 0.55, 0],
                top:     [`${p.y}vh`,              `${p.y - p.riseVh}vh`],
                left:    [`${p.x}vw`,              `${p.x + p.driftX}vw`],
              }}
              transition={{
                duration: p.dur,
                delay:    p.delay,
                repeat:   Infinity,
                ease:     "easeInOut",
              }}
              style={{
                position:     "absolute",
                width:        p.size,
                height:       p.size,
                borderRadius: "50%",
                background:   `rgba(56,182,255,${p.baseOp * 1.4})`,
                boxShadow:    `0 0 ${p.size * 3.5}px rgba(56,182,255,0.7)`,
                pointerEvents:"none",
              }}
            />
          ))}

          {/* ── Central content ─────────────────────────────────────── */}
          <div
            style={{
              position:       "relative",
              zIndex:         5,
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              gap:            "clamp(26px, 4vw, 40px)",
              pointerEvents:  "none",
              userSelect:     "none",
            }}
          >
            {/* ── Logo + orbital rings ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.84 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <LogoMark intensify={intensify} progress={progress} />
              </motion.div>
            </motion.div>

            {/* ── Name block ──────────────────────────────────────── */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  key="name-block"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "center",
                    gap:           "4px",
                  }}
                >
                  {/* Line 1 — Devansh */}
                  <div style={{ display: "flex", alignItems: "center", height: "1.25em" }}>
                    <span style={{
                      fontFamily:    "'Outfit', 'Inter', -apple-system, sans-serif",
                      fontSize:      "clamp(30px, 5.2vw, 60px)",
                      fontWeight:    300,
                      letterSpacing: "0.22em",
                      lineHeight:    1,
                      color:         "#ddeeff",
                      filter:        intensify
                        ? "drop-shadow(0 0 22px rgba(56,182,255,0.85)) drop-shadow(0 0 55px rgba(56,182,255,0.32))"
                        : "drop-shadow(0 0 13px rgba(56,182,255,0.52)) drop-shadow(0 0 34px rgba(56,182,255,0.18))",
                      transition: "filter 0.9s ease",
                    }}>
                      {NAME1.slice(0, n1)}
                    </span>
                    {showCursor1 && <Cursor />}
                  </div>

                  {/* Line 2 — Yadav */}
                  <AnimatePresence>
                    {showName2 && (
                      <motion.div
                        key="name2-line"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.38, ease: "easeOut" }}
                        style={{ display: "flex", alignItems: "center", height: "1.1em" }}
                      >
                        <span style={{
                          fontFamily:    "'Outfit', 'Inter', sans-serif",
                          fontSize:      "clamp(16px, 2.8vw, 34px)",
                          fontWeight:    200,
                          letterSpacing: "0.50em",
                          lineHeight:    1,
                          color:         "rgba(56,182,255,0.78)",
                          filter:        intensify
                            ? "drop-shadow(0 0 16px rgba(56,182,255,0.65))"
                            : "drop-shadow(0 0 8px rgba(56,182,255,0.30))",
                          transition: "filter 0.9s ease",
                        }}>
                          {NAME2.slice(0, n2)}
                        </span>
                        {showCursor2 && <Cursor small />}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Divider */}
                  <AnimatePresence>
                    {intensify && (
                      <motion.div
                        key="divider"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                        style={{
                          width:           "140px",
                          height:          "1px",
                          margin:          "10px 0 6px",
                          background:      "linear-gradient(90deg, transparent 0%, rgba(56,182,255,0.55) 50%, transparent 100%)",
                          transformOrigin: "center",
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Subtitle */}
                  <AnimatePresence>
                    {intensify && (
                      <motion.p
                        key="subtitle"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.65, delay: 0.12 }}
                        style={{
                          margin:        0,
                          fontFamily:    "'Outfit', 'Inter', sans-serif",
                          fontSize:      "clamp(9px, 1.3vw, 12px)",
                          fontWeight:    400,
                          letterSpacing: "0.40em",
                          textTransform: "uppercase",
                          color:         "rgba(148,163,184,0.65)",
                        }}
                      >
                        Developer &nbsp;&middot;&nbsp; Designer &nbsp;&middot;&nbsp; Creator
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── CSS keyframes ───────────────────────────────────────── */}
          <style>{`
            @keyframes dy-cursor-blink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0; }
            }
            @keyframes dy-ring-cw  { to { transform: rotate(360deg);  } }
            @keyframes dy-ring-ccw { to { transform: rotate(-360deg); } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Blinking cursor ──────────────────────────────────────────────────────────
function Cursor({ small = false }) {
  return (
    <span style={{
      display:       "inline-block",
      width:         small ? "1.5px" : "2px",
      height:        small ? "0.82em" : "1.0em",
      background:    "rgba(56,182,255,0.92)",
      borderRadius:  "1px",
      marginLeft:    "4px",
      boxShadow:     "0 0 10px rgba(56,182,255,0.85), 0 0 20px rgba(56,182,255,0.40)",
      animation:     "dy-cursor-blink 0.85s step-end infinite",
      alignSelf:     "center",
      flexShrink:    0,
    }} />
  );
}

// ─── LogoMark with orbital rings + progress arc ───────────────────────────────
function LogoMark({ intensify, progress }) {
  const LOGO_D = 100;
  const R_OUTER = 58;
  const R_MID   = 50;
  const R_INNER = 43;
  const R_ARC   = 70;
  const PAD     = 16;
  const SVG     = (R_ARC + PAD) * 2;
  const C       = SVG / 2;

  const arcCirc   = 2 * Math.PI * R_ARC;
  const arcOffset = arcCirc * (1 - progress);
  const tipAngle  = 2 * Math.PI * progress - Math.PI / 2;

  return (
    <div style={{ position: "relative", width: SVG, height: SVG }}>
      {/* SVG rings + arc */}
      <svg
        width={SVG}
        height={SVG}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="rgba(56,182,255,0.0)" />
            <stop offset="50%"  stopColor="rgba(56,182,255,0.7)" />
            <stop offset="100%" stopColor="rgba(56,182,255,0.0)" />
          </linearGradient>
          <linearGradient id="arcG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#38b6ff" stopOpacity="0.1" />
            <stop offset="60%"  stopColor="#38b6ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#60efff" stopOpacity="1"    />
          </linearGradient>
          <filter id="glowF" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring — clockwise 8s */}
        <g style={{ transformOrigin: `${C}px ${C}px`, animation: "dy-ring-cw 8s linear infinite" }}>
          <circle cx={C} cy={C} r={R_OUTER}
            fill="none" stroke="rgba(56,182,255,0.12)" strokeWidth="1" />
          <circle cx={C} cy={C} r={R_OUTER}
            fill="none" stroke="url(#rg1)" strokeWidth="1.5"
            strokeDasharray={`${R_OUTER * 1.2} ${2 * Math.PI * R_OUTER - R_OUTER * 1.2}`}
          />
        </g>

        {/* Mid ring — counter-clockwise 14s */}
        <g style={{ transformOrigin: `${C}px ${C}px`, animation: "dy-ring-ccw 14s linear infinite" }}>
          <circle cx={C} cy={C} r={R_MID}
            fill="none" stroke="rgba(56,182,255,0.10)" strokeWidth="1" />
          <circle cx={C} cy={C} r={R_MID}
            fill="none" stroke="rgba(56,182,255,0.50)" strokeWidth="1"
            strokeDasharray={`${R_MID * 0.6} ${2 * Math.PI * R_MID - R_MID * 0.6}`}
          />
        </g>

        {/* Inner dashed ring — clockwise 22s */}
        <g style={{ transformOrigin: `${C}px ${C}px`, animation: "dy-ring-cw 22s linear infinite" }}>
          <circle cx={C} cy={C} r={R_INNER}
            fill="none" stroke="rgba(56,182,255,0.16)" strokeWidth="0.75"
            strokeDasharray="3 8"
          />
        </g>

        {/* Progress arc track */}
        <circle cx={C} cy={C} r={R_ARC}
          fill="none" stroke="rgba(56,182,255,0.07)" strokeWidth="1.5" />

        {/* Progress arc fill */}
        {progress > 0 && (
          <circle
            cx={C} cy={C} r={R_ARC}
            fill="none"
            stroke="url(#arcG)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={arcCirc}
            strokeDashoffset={arcOffset}
            style={{
              transformOrigin: `${C}px ${C}px`,
              transform:       "rotate(-90deg)",
              filter:          "url(#glowF)",
              transition:      "stroke-dashoffset 0.12s ease",
            }}
          />
        )}

        {/* Arc tip glowing dot */}
        {progress > 0.02 && (
          <circle
            cx={C + R_ARC * Math.cos(tipAngle)}
            cy={C + R_ARC * Math.sin(tipAngle)}
            r={3.5}
            fill="#60efff"
            style={{ filter: "url(#softGlow)" }}
          />
        )}
      </svg>

      {/* Center logo */}
      <div style={{
        position:       "absolute",
        inset:          0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}>
        {/* Diffuse halo */}
        <motion.div
          animate={{ opacity: intensify ? 0.70 : 0.32, scale: intensify ? 1.18 : 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position:     "absolute",
            width:        LOGO_D + 20,
            height:       LOGO_D + 20,
            borderRadius: "50%",
            background:   "radial-gradient(circle, rgba(56,182,255,0.30) 0%, transparent 70%)",
            filter:       "blur(18px)",
          }}
        />
        {/* Glass disc */}
        <motion.div
          animate={{
            boxShadow: intensify
              ? "0 0 40px rgba(56,182,255,0.30), inset 0 0 24px rgba(56,182,255,0.07), 0 0 0 1px rgba(56,182,255,0.28)"
              : "0 0 18px rgba(56,182,255,0.12), inset 0 0 12px rgba(56,182,255,0.04), 0 0 0 1px rgba(56,182,255,0.15)",
          }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          style={{
            position:     "absolute",
            width:        LOGO_D * 0.74,
            height:       LOGO_D * 0.74,
            borderRadius: "50%",
            background:   "radial-gradient(circle at 38% 38%, rgba(56,182,255,0.08) 0%, rgba(2,6,23,0.92) 100%)",
          }}
        />
        {/* DY text */}
        <span style={{
          position:             "relative",
          fontFamily:           "'Outfit', 'Inter', -apple-system, sans-serif",
          fontSize:             "clamp(22px, 3.8vw, 36px)",
          fontWeight:           700,
          letterSpacing:        "-0.01em",
          lineHeight:           1,
          background:           "linear-gradient(135deg, #60efff 0%, #38b6ff 45%, #1a8fff 100%)",
          backgroundClip:       "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
          color:                "transparent",
          filter:               intensify
            ? "drop-shadow(0 0 20px rgba(56,182,255,0.90)) drop-shadow(0 0 50px rgba(56,182,255,0.38))"
            : "drop-shadow(0 0 12px rgba(56,182,255,0.65)) drop-shadow(0 0 30px rgba(56,182,255,0.24))",
          transition:           "filter 0.9s ease",
        }}>
          DY
        </span>
      </div>
    </div>
  );
}




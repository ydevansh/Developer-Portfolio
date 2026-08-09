/**
 * LoadingScreen — Premium Cinematic Edition v2 (smooth)
 *
 * Smoothness improvements:
 *  - Particles: static left/top + pixel-only y-translate (no vw/vh string animation)
 *  - Typing jitter: reduced to ±8ms for more consistent feel
 *  - Progress arc: easeOut transition for natural fill
 *  - Exit: no blur (avoids GPU layer creation mid-fade)
 *  - willChange on all composited layers
 *  - Spring physics on logo + name entrance
 *  - Scan line: easeOut curve instead of linear
 *  - Particle opacity uses times[] for precise keyframe timing
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

const NAME1       = "Devansh";
const NAME2       = "Yadav";
const LOGO_HOLD   = 800;
const CHAR_MS     = 95;
const JITTER_MS   = 8;    // tight jitter — steady typewriter feel
const INTER_PAUSE = 260;
const POST_TYPE   = 900;
const EXIT_S      = 1.2;
const N_PARTICLES = 28;   // fewer = smoother on mid-range GPUs

function useParticles() {
  return useMemo(() =>
    Array.from({ length: N_PARTICLES }, (_, i) => ({
      id:     i,
      left:   `${5 + Math.random() * 90}%`,   // static — never animated
      top:    `${8 + Math.random() * 84}%`,    // static — never animated
      riseY:  -(60 + Math.random() * 120),     // pixels upward (negative = up)
      size:   1.0 + Math.random() * 2.4,
      op:     0.18 + Math.random() * 0.42,
      dur:    9 + Math.random() * 9,
      delay:  Math.random() * 8,
    })),
  []);
}

export default function LoadingScreen({ onLoadingComplete }) {
  const [phase, setPhase] = useState("logo");
  const [n1,    setN1]    = useState(0);
  const [n2,    setN2]    = useState(0);
  const [show,  setShow]  = useState(true);
  const particles = useParticles();
  const doneRef = useRef(onLoadingComplete);
  useEffect(() => { doneRef.current = onLoadingComplete; }, [onLoadingComplete]);

  // Smooth spring for the progress arc value
  const rawProgress = (n1 + n2) / (NAME1.length + NAME2.length);
  const springProgress = useSpring(rawProgress, { stiffness: 60, damping: 18 });
  const [smoothProgress, setSmoothProgress] = useState(0);
  useEffect(() => {
    const unsub = springProgress.on("change", v => setSmoothProgress(Math.min(v, 1)));
    return unsub;
  }, [springProgress]);
  useEffect(() => { springProgress.set(rawProgress); }, [rawProgress, springProgress]);

  useEffect(() => {
    if (phase !== "logo") return;
    const t = setTimeout(() => setPhase("typing1"), LOGO_HOLD);
    return () => clearTimeout(t);
  }, [phase]);

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
  const showCursor1 = phase === "typing1" && n1 < NAME1.length;
  const showCursor2 = phase === "typing2" && n2 < NAME2.length;
  const showName2   = phase === "typing2" || phase === "hold" || phase === "exit";

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          key="loader-root"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
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
            willChange:     "opacity, transform",
          }}
        >
          {/* Background glows */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <motion.div
              animate={{ opacity: intensify ? 1 : 0.62 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse 72% 55% at 50% 50%, rgba(56,182,255,0.14) 0%, transparent 68%)",
              }}
            />
            <motion.div
              animate={{ opacity: intensify ? 0.68 : 0.26 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse 40% 35% at 25% 75%, rgba(99,102,241,0.09) 0%, transparent 62%)",
              }}
            />
          </div>

          {/* HUD grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: intensify ? 0.038 : 0.016 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "linear-gradient(rgba(56,182,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,182,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Scan-line sweep */}
          <motion.div
            initial={{ y: "-2px" }}
            animate={{ y: "102vh" }}
            transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
            style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "2px",
              background: "linear-gradient(90deg, transparent 0%, rgba(56,182,255,0.45) 15%, rgba(56,182,255,0.95) 50%, rgba(56,182,255,0.45) 85%, transparent 100%)",
              boxShadow: "0 0 20px rgba(56,182,255,0.55), 0 0 55px rgba(56,182,255,0.18)",
              pointerEvents: "none", zIndex: 8,
              willChange: "transform",
            }}
          />

          {/* Corner brackets */}
          <CornerBrackets intensify={intensify} />

          {/* Particles — position is static CSS, only y-translate animates */}
          {particles.map(p => <Particle key={p.id} p={p} />)}

          {/* Central content */}
          <div style={{
            position: "relative", zIndex: 5,
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "clamp(24px, 3.8vw, 38px)",
            pointerEvents: "none", userSelect: "none",
            willChange: "transform",
          }}>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
                style={{ willChange: "transform" }}
              >
                <LogoMark intensify={intensify} progress={smoothProgress} />
              </motion.div>
            </motion.div>

            {/* Name block */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  key="name-block"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Devansh */}
                  <div style={{ display: "flex", alignItems: "center", minHeight: "1.3em" }}>
                    <span style={{
                      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
                      fontSize: "clamp(28px, 5vw, 58px)",
                      fontWeight: 300, letterSpacing: "0.22em", lineHeight: 1.2,
                      color: "#ddeeff",
                      filter: intensify
                        ? "drop-shadow(0 0 22px rgba(56,182,255,0.88)) drop-shadow(0 0 55px rgba(56,182,255,0.32))"
                        : "drop-shadow(0 0 12px rgba(56,182,255,0.52)) drop-shadow(0 0 32px rgba(56,182,255,0.18))",
                      transition: "filter 1.1s ease",
                    }}>
                      {NAME1.slice(0, n1)}
                    </span>
                    {showCursor1 && <Cursor />}
                  </div>

                  {/* Yadav */}
                  <motion.div
                    animate={{ opacity: showName2 ? 1 : 0, y: showName2 ? 0 : 8 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: "flex", alignItems: "center", minHeight: "1.15em", willChange: "transform, opacity" }}
                  >
                    <span style={{
                      fontFamily: "'Outfit', 'Inter', sans-serif",
                      fontSize: "clamp(14px, 2.6vw, 32px)",
                      fontWeight: 200, letterSpacing: "0.52em", lineHeight: 1.2,
                      color: "rgba(56,182,255,0.80)",
                      filter: intensify
                        ? "drop-shadow(0 0 14px rgba(56,182,255,0.65))"
                        : "drop-shadow(0 0 7px rgba(56,182,255,0.30))",
                      transition: "filter 1.1s ease",
                    }}>
                      {NAME2.slice(0, n2)}
                    </span>
                    {showCursor2 && <Cursor small />}
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    animate={{ scaleX: intensify ? 1 : 0, opacity: intensify ? 1 : 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: "clamp(100px, 14vw, 150px)", height: "1px",
                      margin: "10px 0 8px",
                      background: "linear-gradient(90deg, transparent 0%, rgba(56,182,255,0.6) 50%, transparent 100%)",
                      transformOrigin: "center",
                      willChange: "transform, opacity",
                    }}
                  />

                  {/* Subtitle */}
                  <motion.p
                    animate={{ opacity: intensify ? 1 : 0, y: intensify ? 0 : 10 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                    style={{
                      margin: 0,
                      fontFamily: "'Outfit', 'Inter', sans-serif",
                      fontSize: "clamp(9px, 1.2vw, 12px)",
                      fontWeight: 400, letterSpacing: "0.38em",
                      textTransform: "uppercase",
                      color: "rgba(148,163,184,0.68)",
                      whiteSpace: "nowrap",
                      willChange: "transform, opacity",
                    }}
                  >
                    Developer &nbsp;&middot;&nbsp; Designer &nbsp;&middot;&nbsp; Creator
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <style>{`
            @keyframes dy-cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
            @keyframes dy-ring-cw  { to { transform: rotate(360deg);  } }
            @keyframes dy-ring-ccw { to { transform: rotate(-360deg); } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Particle: only animates y (pixel) and opacity — no string unit animation
function Particle({ p }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, p.op, p.op * 0.6, p.op * 0.2, 0],
        y:       [0, p.riseY * 0.3, p.riseY * 0.65, p.riseY],
      }}
      transition={{
        duration:   p.dur,
        delay:      p.delay,
        repeat:     Infinity,
        repeatType: "loop",
        ease:       "easeInOut",
        times:      [0, 0.25, 0.65, 1],
      }}
      style={{
        position:     "absolute",
        left:         p.left,
        top:          p.top,
        width:        p.size,
        height:       p.size,
        borderRadius: "50%",
        background:   `rgba(56,182,255,${Math.min(p.op * 1.4, 0.88)})`,
        boxShadow:    `0 0 ${p.size * 4}px rgba(56,182,255,0.6)`,
        pointerEvents: "none",
        willChange:   "transform, opacity",
      }}
    />
  );
}

function CornerBrackets({ intensify }) {
  const dur = { duration: 1.4, ease: "easeInOut" };
  const tgt = intensify ? 1 : 0.45;
  const bw  = "1.5px solid";
  const col = "rgba(56,182,255,0.65)";
  const base = {
    position: "absolute", width: 26, height: 26,
    pointerEvents: "none", boxSizing: "border-box",
  };
  return (
    <>
      <motion.div animate={{ opacity: tgt }} transition={dur}
        style={{ ...base, top: 22, left: 22, borderTop: `${bw} ${col}`, borderLeft: `${bw} ${col}`, borderRadius: "3px 0 0 0" }} />
      <motion.div animate={{ opacity: tgt }} transition={dur}
        style={{ ...base, top: 22, right: 22, borderTop: `${bw} ${col}`, borderRight: `${bw} ${col}`, borderRadius: "0 3px 0 0" }} />
      <motion.div animate={{ opacity: tgt }} transition={dur}
        style={{ ...base, bottom: 22, right: 22, borderBottom: `${bw} ${col}`, borderRight: `${bw} ${col}`, borderRadius: "0 0 3px 0" }} />
      <motion.div animate={{ opacity: tgt }} transition={dur}
        style={{ ...base, bottom: 22, left: 22, borderBottom: `${bw} ${col}`, borderLeft: `${bw} ${col}`, borderRadius: "0 0 0 3px" }} />
    </>
  );
}

function Cursor({ small = false }) {
  return (
    <span style={{
      display: "inline-block",
      width: small ? "1.5px" : "2px",
      height: small ? "0.8em" : "0.95em",
      background: "rgba(56,182,255,0.92)",
      borderRadius: "1px", marginLeft: "3px",
      boxShadow: "0 0 10px rgba(56,182,255,0.9), 0 0 22px rgba(56,182,255,0.4)",
      animation: "dy-cursor-blink 0.85s step-end infinite",
      alignSelf: "center", flexShrink: 0,
    }} />
  );
}

function LogoMark({ intensify, progress }) {
  const R_OUTER = 52;
  const R_MID   = 44;
  const R_INNER = 37;
  const R_ARC   = 62;
  const PAD     = 14;
  const SVG     = (R_ARC + PAD) * 2;
  const C       = SVG / 2;
  const LOGO_D  = R_INNER * 1.65;

  const arcCirc   = 2 * Math.PI * R_ARC;
  const arcOffset = arcCirc * (1 - Math.max(0, Math.min(1, progress)));
  const tipAngle  = 2 * Math.PI * progress - Math.PI / 2;
  const tipX      = C + R_ARC * Math.cos(tipAngle);
  const tipY      = C + R_ARC * Math.sin(tipAngle);

  return (
    <div style={{ position: "relative", width: SVG, height: SVG }}>
      <svg width={SVG} height={SVG} viewBox={`0 0 ${SVG} ${SVG}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="sweepG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="rgba(56,182,255,0)"    />
            <stop offset="50%"  stopColor="rgba(56,182,255,0.75)" />
            <stop offset="100%" stopColor="rgba(56,182,255,0)"    />
          </linearGradient>
          <linearGradient id="arcFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#38b6ff" stopOpacity="0.05" />
            <stop offset="55%"  stopColor="#38b6ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7df9ff" stopOpacity="1"    />
          </linearGradient>
          <filter id="gF" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="tipF" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <g style={{ transformOrigin: `${C}px ${C}px`, animation: "dy-ring-cw 8s linear infinite" }}>
          <circle cx={C} cy={C} r={R_OUTER} fill="none" stroke="rgba(56,182,255,0.11)" strokeWidth="1" />
          <circle cx={C} cy={C} r={R_OUTER} fill="none" stroke="url(#sweepG)" strokeWidth="1.5"
            strokeDasharray={`${R_OUTER * 1.15} ${2 * Math.PI * R_OUTER - R_OUTER * 1.15}`} />
        </g>

        <g style={{ transformOrigin: `${C}px ${C}px`, animation: "dy-ring-ccw 13s linear infinite" }}>
          <circle cx={C} cy={C} r={R_MID} fill="none" stroke="rgba(56,182,255,0.09)" strokeWidth="1" />
          <circle cx={C} cy={C} r={R_MID} fill="none" stroke="rgba(56,182,255,0.52)" strokeWidth="1"
            strokeDasharray={`${R_MID * 0.55} ${2 * Math.PI * R_MID - R_MID * 0.55}`} />
        </g>

        <g style={{ transformOrigin: `${C}px ${C}px`, animation: "dy-ring-cw 21s linear infinite" }}>
          <circle cx={C} cy={C} r={R_INNER} fill="none" stroke="rgba(56,182,255,0.15)" strokeWidth="0.75" strokeDasharray="2.5 7" />
        </g>

        <circle cx={C} cy={C} r={R_ARC} fill="none" stroke="rgba(56,182,255,0.07)" strokeWidth="1.5" />

        {progress > 0.005 && (
          <circle cx={C} cy={C} r={R_ARC} fill="none"
            stroke="url(#arcFill)" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={arcCirc} strokeDashoffset={arcOffset}
            style={{
              transformOrigin: `${C}px ${C}px`,
              transform: "rotate(-90deg)",
              filter: "url(#gF)",
              transition: "stroke-dashoffset 0.22s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />
        )}

        {progress > 0.02 && (
          <circle cx={tipX} cy={tipY} r={3} fill="#7df9ff" style={{ filter: "url(#tipF)" }} />
        )}
      </svg>

      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          animate={{ opacity: intensify ? 0.72 : 0.28, scale: intensify ? 1.2 : 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          style={{
            position: "absolute", width: LOGO_D + 18, height: LOGO_D + 18,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,182,255,0.32) 0%, transparent 70%)",
            filter: "blur(18px)",
            willChange: "opacity, transform",
          }}
        />
        <motion.div
          animate={{
            boxShadow: intensify
              ? "0 0 38px rgba(56,182,255,0.28), inset 0 0 22px rgba(56,182,255,0.06), 0 0 0 1px rgba(56,182,255,0.28)"
              : "0 0 16px rgba(56,182,255,0.11), inset 0 0 10px rgba(56,182,255,0.04), 0 0 0 1px rgba(56,182,255,0.14)",
          }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          style={{
            position: "absolute", width: LOGO_D, height: LOGO_D,
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 38%, rgba(56,182,255,0.07) 0%, rgba(2,6,23,0.94) 100%)",
            willChange: "box-shadow",
          }}
        />
        <span style={{
          position: "relative",
          fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
          fontSize: "clamp(20px, 3.5vw, 34px)",
          fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1,
          background: "linear-gradient(135deg, #7df9ff 0%, #38b6ff 45%, #1a8fff 100%)",
          backgroundClip: "text", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", color: "transparent",
          filter: intensify
            ? "drop-shadow(0 0 18px rgba(56,182,255,0.92)) drop-shadow(0 0 48px rgba(56,182,255,0.40))"
            : "drop-shadow(0 0 11px rgba(56,182,255,0.68)) drop-shadow(0 0 28px rgba(56,182,255,0.24))",
          transition: "filter 1.1s ease",
        }}>DY</span>
      </div>
    </div>
  );
}

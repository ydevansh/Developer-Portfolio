/**
 * LoadingScreen — Premium Cinematic Edition v2 (fixed)
 *
 * Fixes applied:
 *  - Particles: use fixed positioning + CSS x/y transform (not animated top/left)
 *  - Progress arc: corrected SVG viewport geometry
 *  - Yadav second line: uses motion.animate instead of AnimatePresence for reliability
 *  - Corner brackets: explicit border per corner (no rotate hack)
 *  - Cursor: only shown during its own typing phase
 *  - Name rows: minHeight instead of fixed height prevents clipping
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME1       = "Devansh";
const NAME2       = "Yadav";
const LOGO_HOLD   = 900;
const CHAR_MS     = 105;
const JITTER_MS   = 22;
const INTER_PAUSE = 280;
const POST_TYPE   = 800;
const EXIT_S      = 1.1;
const N_PARTICLES = 30;

function useParticles() {
  return useMemo(() =>
    Array.from({ length: N_PARTICLES }, (_, i) => ({
      id:     i,
      startX: 5 + Math.random() * 90,
      startY: 10 + Math.random() * 80,
      size:   1.0 + Math.random() * 2.5,
      op:     0.15 + Math.random() * 0.45,
      dur:    8 + Math.random() * 10,
      delay:  Math.random() * 7,
      driftX: (Math.random() - 0.5) * 5,
      riseY:  12 + Math.random() * 22,
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
  const showCursor1 = phase === "typing1";
  const showCursor2 = phase === "typing2";
  const showName2   = phase === "typing2" || phase === "hold" || phase === "exit";
  const progress    = Math.min((n1 + n2) / (NAME1.length + NAME2.length), 1);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          key="loader-root"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
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
          {/* Background glows */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <motion.div animate={{ opacity: intensify ? 1 : 0.65 }} transition={{ duration: 1.5 }}
              style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 72% 55% at 50% 50%, rgba(56,182,255,0.14) 0%, transparent 68%)" }} />
            <motion.div animate={{ opacity: intensify ? 0.7 : 0.28 }} transition={{ duration: 1.5 }}
              style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 40% 35% at 25% 75%, rgba(99,102,241,0.09) 0%, transparent 62%)" }} />
            <motion.div animate={{ opacity: intensify ? 0.55 : 0.22 }} transition={{ duration: 1.5 }}
              style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 35% 28% at 75% 25%, rgba(56,182,255,0.07) 0%, transparent 60%)" }} />
          </div>

          {/* HUD grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: intensify ? 0.04 : 0.018 }}
            transition={{ duration: 2 }}
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "linear-gradient(rgba(56,182,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(56,182,255,0.55) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Scan-line sweep */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "102vh" }}
            transition={{ duration: 1.6, ease: "linear", delay: 0.1 }}
            style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "2px",
              background: "linear-gradient(90deg, transparent 0%, rgba(56,182,255,0.5) 15%, rgba(56,182,255,1) 50%, rgba(56,182,255,0.5) 85%, transparent 100%)",
              boxShadow: "0 0 22px rgba(56,182,255,0.6), 0 0 60px rgba(56,182,255,0.2)",
              pointerEvents: "none", zIndex: 8,
            }}
          />

          {/* Corner brackets */}
          <CornerBrackets intensify={intensify} />

          {/* Particles */}
          {particles.map(p => <Particle key={p.id} p={p} />)}

          {/* Central content */}
          <div style={{
            position: "relative", zIndex: 5,
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "clamp(24px, 3.8vw, 38px)",
            pointerEvents: "none", userSelect: "none",
          }}>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <LogoMark intensify={intensify} progress={progress} />
              </motion.div>
            </motion.div>

            {/* Name block */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  key="name-block"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}
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
                      transition: "filter 0.9s ease",
                    }}>
                      {NAME1.slice(0, n1)}
                    </span>
                    {showCursor1 && <Cursor />}
                  </div>

                  {/* Yadav */}
                  <motion.div
                    animate={{ opacity: showName2 ? 1 : 0, y: showName2 ? 0 : 6 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ display: "flex", alignItems: "center", minHeight: "1.15em" }}
                  >
                    <span style={{
                      fontFamily: "'Outfit', 'Inter', sans-serif",
                      fontSize: "clamp(14px, 2.6vw, 32px)",
                      fontWeight: 200, letterSpacing: "0.52em", lineHeight: 1.2,
                      color: "rgba(56,182,255,0.80)",
                      filter: intensify
                        ? "drop-shadow(0 0 14px rgba(56,182,255,0.65))"
                        : "drop-shadow(0 0 7px rgba(56,182,255,0.30))",
                      transition: "filter 0.9s ease",
                    }}>
                      {NAME2.slice(0, n2)}
                    </span>
                    {showCursor2 && <Cursor small />}
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    animate={{ scaleX: intensify ? 1 : 0, opacity: intensify ? 1 : 0 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: "clamp(100px, 14vw, 150px)", height: "1px",
                      margin: "10px 0 8px",
                      background: "linear-gradient(90deg, transparent 0%, rgba(56,182,255,0.6) 50%, transparent 100%)",
                      transformOrigin: "center",
                    }}
                  />

                  {/* Subtitle */}
                  <motion.p
                    animate={{ opacity: intensify ? 1 : 0, y: intensify ? 0 : 8 }}
                    transition={{ duration: 0.65, delay: 0.1 }}
                    style={{
                      margin: 0,
                      fontFamily: "'Outfit', 'Inter', sans-serif",
                      fontSize: "clamp(9px, 1.2vw, 12px)",
                      fontWeight: 400, letterSpacing: "0.38em",
                      textTransform: "uppercase",
                      color: "rgba(148,163,184,0.68)",
                      whiteSpace: "nowrap",
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

function Particle({ p }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, p.op, p.op * 0.5, 0],
        x: [`${p.startX}vw`, `${p.startX + p.driftX}vw`],
        y: [`${p.startY}vh`, `${p.startY - p.riseY}vh`],
      }}
      transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "fixed", top: 0, left: 0,
        width: p.size, height: p.size,
        borderRadius: "50%",
        background: `rgba(56,182,255,${Math.min(p.op * 1.5, 0.9)})`,
        boxShadow: `0 0 ${p.size * 4}px rgba(56,182,255,0.65)`,
        pointerEvents: "none", willChange: "transform, opacity",
      }}
    />
  );
}

function CornerBrackets({ intensify }) {
  const op  = intensify ? 1 : 0.5;
  const bw  = "1.5px solid";
  const col = intensify ? "rgba(56,182,255,0.70)" : "rgba(56,182,255,0.28)";
  const sh  = intensify ? "0 0 10px rgba(56,182,255,0.35)" : "none";
  const tr  = "border-color 1.2s ease, box-shadow 1.2s ease";
  const base = { position: "absolute", width: 26, height: 26, pointerEvents: "none", boxSizing: "border-box", borderRadius: 3 };
  return (
    <>
      <motion.div animate={{ opacity: op }} transition={{ duration: 1.2 }}
        style={{ ...base, top: 22, left: 22, borderTop: `${bw} ${col}`, borderLeft: `${bw} ${col}`, boxShadow: sh, transition: tr }} />
      <motion.div animate={{ opacity: op }} transition={{ duration: 1.2 }}
        style={{ ...base, top: 22, right: 22, borderTop: `${bw} ${col}`, borderRight: `${bw} ${col}`, boxShadow: sh, transition: tr }} />
      <motion.div animate={{ opacity: op }} transition={{ duration: 1.2 }}
        style={{ ...base, bottom: 22, right: 22, borderBottom: `${bw} ${col}`, borderRight: `${bw} ${col}`, boxShadow: sh, transition: tr }} />
      <motion.div animate={{ opacity: op }} transition={{ duration: 1.2 }}
        style={{ ...base, bottom: 22, left: 22, borderBottom: `${bw} ${col}`, borderLeft: `${bw} ${col}`, boxShadow: sh, transition: tr }} />
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
  const arcOffset = arcCirc * (1 - progress);
  const tipAngle  = 2 * Math.PI * progress - Math.PI / 2;
  const tipX      = C + R_ARC * Math.cos(tipAngle);
  const tipY      = C + R_ARC * Math.sin(tipAngle);

  return (
    <div style={{ position: "relative", width: SVG, height: SVG }}>
      <svg width={SVG} height={SVG} viewBox={`0 0 ${SVG} ${SVG}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="sweepG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="rgba(56,182,255,0)"   />
            <stop offset="50%"  stopColor="rgba(56,182,255,0.75)" />
            <stop offset="100%" stopColor="rgba(56,182,255,0)"   />
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

        {/* Outer ring — cw 8s */}
        <g style={{ transformOrigin: `${C}px ${C}px`, animation: "dy-ring-cw 8s linear infinite" }}>
          <circle cx={C} cy={C} r={R_OUTER} fill="none" stroke="rgba(56,182,255,0.11)" strokeWidth="1" />
          <circle cx={C} cy={C} r={R_OUTER} fill="none" stroke="url(#sweepG)" strokeWidth="1.5"
            strokeDasharray={`${R_OUTER * 1.15} ${2 * Math.PI * R_OUTER - R_OUTER * 1.15}`} />
        </g>

        {/* Mid ring — ccw 13s */}
        <g style={{ transformOrigin: `${C}px ${C}px`, animation: "dy-ring-ccw 13s linear infinite" }}>
          <circle cx={C} cy={C} r={R_MID} fill="none" stroke="rgba(56,182,255,0.09)" strokeWidth="1" />
          <circle cx={C} cy={C} r={R_MID} fill="none" stroke="rgba(56,182,255,0.52)" strokeWidth="1"
            strokeDasharray={`${R_MID * 0.55} ${2 * Math.PI * R_MID - R_MID * 0.55}`} />
        </g>

        {/* Inner dashed ring — cw 21s */}
        <g style={{ transformOrigin: `${C}px ${C}px`, animation: "dy-ring-cw 21s linear infinite" }}>
          <circle cx={C} cy={C} r={R_INNER} fill="none" stroke="rgba(56,182,255,0.15)" strokeWidth="0.75" strokeDasharray="2.5 7" />
        </g>

        {/* Arc track */}
        <circle cx={C} cy={C} r={R_ARC} fill="none" stroke="rgba(56,182,255,0.07)" strokeWidth="1.5" />

        {/* Arc fill */}
        {progress > 0.005 && (
          <circle cx={C} cy={C} r={R_ARC} fill="none"
            stroke="url(#arcFill)" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={arcCirc} strokeDashoffset={arcOffset}
            style={{ transformOrigin: `${C}px ${C}px`, transform: "rotate(-90deg)", filter: "url(#gF)", transition: "stroke-dashoffset 0.12s linear" }}
          />
        )}

        {/* Tip dot */}
        {progress > 0.02 && (
          <circle cx={tipX} cy={tipY} r={3} fill="#7df9ff" style={{ filter: "url(#tipF)" }} />
        )}
      </svg>

      {/* Center logo */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          animate={{ opacity: intensify ? 0.72 : 0.30, scale: intensify ? 1.2 : 1 }}
          transition={{ duration: 1.2 }}
          style={{
            position: "absolute", width: LOGO_D + 18, height: LOGO_D + 18,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,182,255,0.32) 0%, transparent 70%)",
            filter: "blur(18px)",
          }}
        />
        <motion.div
          animate={{
            boxShadow: intensify
              ? "0 0 38px rgba(56,182,255,0.28), inset 0 0 22px rgba(56,182,255,0.06), 0 0 0 1px rgba(56,182,255,0.28)"
              : "0 0 16px rgba(56,182,255,0.11), inset 0 0 10px rgba(56,182,255,0.04), 0 0 0 1px rgba(56,182,255,0.14)",
          }}
          transition={{ duration: 1.1 }}
          style={{
            position: "absolute", width: LOGO_D, height: LOGO_D,
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 38%, rgba(56,182,255,0.07) 0%, rgba(2,6,23,0.94) 100%)",
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
          transition: "filter 0.9s ease",
        }}>DY</span>
      </div>
    </div>
  );
}

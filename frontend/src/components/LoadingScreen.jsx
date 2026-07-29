/**
 * LoadingScreen.jsx — Ground-up clean rewrite
 *
 * Architecture
 * ────────────
 *  LoadingScreen          → public export; wraps everything in error boundary
 *    └─ LoaderErrorBoundary  → catches any crash; auto-dismisses loader safely
 *         └─ LoaderCore      → the actual loader UI
 *              ├─ useLoadingEngine()  → ALL timing/progress logic isolated here
 *              ├─ Galaxy3DBackground → lazy R3F canvas (separate Suspense)
 *              ├─ TwinkleField       → CSS-only ambient star twinkle
 *              ├─ ShootingStars      → CSS-only occasional streaks
 *              └─ LoaderHUD          → centered DY logo + rings + bar + text
 *
 * Loading flow (guaranteed)
 * ─────────────────────────
 *   On mount → start Task A (asset loading) AND Task B (4 s timer) in parallel
 *   Progress bar → animates 0 → 92 % over 4 s (eased, never reaches 100 alone)
 *   Both tasks done? → surge 92 → 100 % over 0.7 s → fade+zoom exit → homepage
 *   Assets take > 6 s? → hard fallback marks them done; timer still controls min
 */

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  Component,
  lazy,
  Suspense,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── lazy 3-D canvas (never blocks first paint) ─────────────────────────── */
const Galaxy3DBackground = lazy(() => import('./3d/GalaxyCanvas'));

/* ══════════════════════════════════════════════════════════════════════════
   1. ERROR BOUNDARY
   Catches any render/runtime crash inside the loader.
   Automatically dismisses the loader so the portfolio still opens.
══════════════════════════════════════════════════════════════════════════ */
class LoaderErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false };
    this._dismissTimer = null;
  }

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  componentDidCatch(error, info) {
    console.error('[LoaderErrorBoundary] Loader crashed — dismissing gracefully.', error, info);
    // Give the user half a second to see the fallback, then open the portfolio
    this._dismissTimer = setTimeout(() => {
      this.props.onLoadingComplete?.();
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(this._dismissTimer);
  }

  render() {
    if (this.state.crashed) {
      return (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#01050e', color: '#e2e8f0',
            fontFamily: 'sans-serif', padding: '24px', textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '1px solid rgba(34,211,238,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#67e8f9', fontWeight: 700, fontSize: 20,
              marginBottom: 16,
              boxShadow: '0 0 20px rgba(0,229,255,0.3)',
            }}
          >
            DY
          </div>
          <p style={{ fontSize: 14, color: 'rgba(103,232,249,0.7)', marginBottom: 20 }}>
            Launching Portfolio…
          </p>
          <button
            onClick={() => this.props.onLoadingComplete?.()}
            style={{
              padding: '8px 20px', borderRadius: 999,
              border: '1px solid rgba(34,211,238,0.4)',
              background: 'rgba(34,211,238,0.1)', color: '#67e8f9',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Enter Portfolio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   2. LOADING ENGINE HOOK
   Isolated custom hook — zero side effects outside its returned values.
   All timers, rAF IDs, and async tasks are cleaned up on unmount.
══════════════════════════════════════════════════════════════════════════ */
const MIN_DURATION_MS   = 6500; // hard minimum loader visibility
const ASSET_MIN_WAIT_MS = 3000; // assets cannot be "done" before this
const SURGE_MS          = 900;  // 92 → 100 % once both gates open
const EXIT_MS           = 1100; // fade+zoom duration after reaching 100 %

const LOAD_MESSAGES = [
  { at:  0, text: 'Initializing Portfolio…' },
  { at: 16, text: 'Loading Projects…'        },
  { at: 38, text: 'Preparing Skills…'        },
  { at: 60, text: 'Optimizing Experience…'  },
  { at: 80, text: 'Finalizing Interface…'   },
  { at: 94, text: 'Welcome.'                 },
];

function resolveMessage(pct) {
  let msg = LOAD_MESSAGES[0].text;
  for (const m of LOAD_MESSAGES) {
    if (pct >= m.at) msg = m.text;
  }
  return msg;
}

function useLoadingEngine(onDone) {
  // UI state (minimal — only what the HUD needs to render)
  const [progress,     setProgress]     = useState(0);
  const [displayPct,   setDisplayPct]   = useState(0);
  const [isExiting,    setIsExiting]    = useState(false);
  const [canvasOpacity, setCanvasOpacity] = useState({ star: 0, nebula: 0, galaxy: 0 });

  // Stable ref so the rAF closure always sees latest callback
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  // Interpolation ref (avoid stale closure on displayPct)
  const displayRef = useRef(0);

  useEffect(() => {
    // ── Lifecycle guard — prevents any setState after unmount ───────────────
    let mounted = true;
    const safe = (fn) => { if (mounted) fn(); };

    // ── Gate flags (mutable, intentionally not state — read in rAF) ─────────
    let assetsGate = false; // Task A complete
    let timerGate  = false; // Task B complete
    let bothOpen   = false; // assetsGate && timerGate

    // ── Surge / exit tracking ────────────────────────────────────────────────
    let surgeActive = false;
    let surgeStart  = 0;
    let exitTriggered = false;

    // ── rAF handle ──────────────────────────────────────────────────────────
    let rafId = 0;
    const t0  = performance.now();

    // ────────────────────────────────────────────────────────────────────────
    // Task A — asset loading
    // We wait for: a mandatory minimum delay, document ready, fonts, and any
    // in-flight images. This prevents assets that are already cached from
    // instantly completing and making the loader feel too fast.
    // A hard fallback fires after 9 s so a stalled network never blocks us.
    // ────────────────────────────────────────────────────────────────────────
    const loadAllAssets = async () => {
      try {
        // 0. Mandatory minimum wait — even cached pages must wait this long
        await new Promise((resolve) => setTimeout(resolve, ASSET_MIN_WAIT_MS));

        // 1. DOM fully parsed & sub-resources requested
        if (document.readyState !== 'complete') {
          await new Promise((resolve) =>
            window.addEventListener('load', resolve, { once: true })
          );
        }

        // 2. Web fonts
        if (typeof document.fonts?.ready === 'object') {
          await document.fonts.ready;
        }

        // 3. Images that haven't finished yet
        const pendingImages = Array.from(document.images).filter(
          (img) => !img.complete
        );
        if (pendingImages.length > 0) {
          await Promise.all(
            pendingImages.map(
              (img) =>
                new Promise((resolve) => {
                  img.addEventListener('load',  resolve, { once: true });
                  img.addEventListener('error', resolve, { once: true });
                })
            )
          );
        }
      } catch (_) {
        // Never throw — the fallback timer below covers failure cases
      } finally {
        if (mounted) {
          assetsGate = true;
          bothOpen   = assetsGate && timerGate;
        }
      }
    };

    // Hard fallback: if assets take more than 9 s, let them be "done"
    const assetFallback = setTimeout(() => {
      assetsGate = true;
      bothOpen   = assetsGate && timerGate;
    }, 9000);

    loadAllAssets();

    // ────────────────────────────────────────────────────────────────────────
    // Task B — minimum 4-second timer
    // This is a real setTimeout, which cannot be bypassed by rAF timing.
    // ────────────────────────────────────────────────────────────────────────
    const minTimer = setTimeout(() => {
      timerGate = true;
      bothOpen  = assetsGate && timerGate;
    }, MIN_DURATION_MS);

    // ────────────────────────────────────────────────────────────────────────
    // Easing functions
    // ────────────────────────────────────────────────────────────────────────
    // Crawl: ease-out-cubic — fast start, slows toward end (feels natural)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    // Surge: ease-in-out-cubic — smooth, satisfying finish
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // ────────────────────────────────────────────────────────────────────────
    // rAF loop
    // Runs at ~60 fps. Drives progress bar, display counter, and 3-D fade-in.
    // ────────────────────────────────────────────────────────────────────────
    const tick = (now) => {
      if (!mounted) return;

      const elapsed = now - t0;
      const t       = Math.min(elapsed / MIN_DURATION_MS, 1); // 0 → 1 over 6.5 s

      let target;

      if (!surgeActive) {
        // ── Crawl phase: 0 → 92 % over MIN_DURATION_MS ──────────────────────
        // The bar is hard-capped at 92; it cannot reach 100 during this phase.
        target = easeOutCubic(t) * 92;

        // Check if we can begin the surge
        if (bothOpen && !surgeActive) {
          surgeActive = true;
          surgeStart  = now;
        }
      } else {
        // ── Surge phase: 92 → 100 % over SURGE_MS ───────────────────────────
        const st = Math.min((now - surgeStart) / SURGE_MS, 1);
        target   = 92 + easeInOutCubic(st) * 8; // 92 + 8 = 100
      }

      // Smooth interpolated display counter (10 % blend per frame ≈ 60 fps)
      displayRef.current += (target - displayRef.current) * 0.1;

      safe(() => {
        setProgress(target);
        setDisplayPct(displayRef.current);

        // 3-D canvas fade-in cascade (staggered so galaxy builds in stages)
        setCanvasOpacity((prev) => ({
          star:   target >  5 ? Math.min(prev.star   + 0.04, 1) : prev.star,
          nebula: target > 20 ? Math.min(prev.nebula + 0.03, 1) : prev.nebula,
          galaxy: target > 38 ? Math.min(prev.galaxy + 0.025, 1) : prev.galaxy,
        }));
      });

      // ── Exit trigger ─────────────────────────────────────────────────────
      if (surgeActive && target >= 100 && !exitTriggered) {
        exitTriggered = true;
        safe(() => {
          setProgress(100);
          setDisplayPct(100);
          setIsExiting(true);
        });
        // Wait for exit animation then call onDone
        setTimeout(() => {
          if (mounted) onDoneRef.current?.();
        }, EXIT_MS);
        return; // stop loop
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      clearTimeout(minTimer);
      clearTimeout(assetFallback);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once on mount

  return { progress, displayPct, isExiting, canvasOpacity };
}

/* ══════════════════════════════════════════════════════════════════════════
   3. VISUAL SUB-COMPONENTS
   Pure presentational — no logic, no timers.
   All random values are memoized so they never change across renders.
══════════════════════════════════════════════════════════════════════════ */

/** Twinkling background stars (CSS + Framer Motion, no Three.js) */
function TwinkleField({ count }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id:    i,
        top:   `${Math.random() * 100}%`,
        left:  `${Math.random() * 100}%`,
        size:  Math.random() * 1.8 + 0.8,
        delay: Math.random() * 5,
        dur:   Math.random() * 3 + 2,
        op:    Math.random() * 0.5 + 0.3,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          animate={{ opacity: [s.op * 0.2, s.op, s.op * 0.2] }}
          transition={{
            duration: s.dur,
            delay:    s.delay,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/** Occasional shooting-star streaks */
function ShootingStars({ count }) {
  const streaks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id:     i,
        top:    `${8 + Math.random() * 55}%`,
        length: 70 + Math.random() * 70,
        delay:  i * 3.2 + Math.random() * 2.5,
        dur:    0.65 + Math.random() * 0.45,
        gap:    7 + Math.random() * 9,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {streaks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute h-px"
          style={{
            top:    s.top,
            left:   '-5%',
            width:  s.length,
            background:
              'linear-gradient(90deg,transparent,rgba(34,211,238,0.85),transparent)',
            boxShadow: '0 0 5px rgba(34,211,238,0.5)',
          }}
          animate={{ x: ['0vw', '115vw'], opacity: [0, 1, 1, 0] }}
          transition={{
            duration:    s.dur,
            delay:       s.delay,
            repeat:      Infinity,
            repeatDelay: s.gap,
            ease:        'easeIn',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Single orbiting dot.
 * Uses CSS rotate + translate so the dot travels a perfect circle
 * around the centre of the parent container.
 */
function OrbitDot({ radius, sizePx, periodSec, colorCls, glowColor, startDeg }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ rotate: [startDeg, startDeg + 360] }}
      transition={{ duration: periodSec, repeat: Infinity, ease: 'linear' }}
    >
      <div
        className={`absolute rounded-full ${colorCls}`}
        style={{
          width:     sizePx,
          height:    sizePx,
          top:       '50%',
          left:      '50%',
          transform: `translate(-50%, calc(-50% - ${radius}px))`,
          boxShadow: `0 0 ${sizePx * 4}px ${glowColor}`,
        }}
      />
    </motion.div>
  );
}

/** Central DY logo with rotating energy ring and orbiting particles */
function LogoSystem({ isExiting, galaxyOpacity, nearComplete }) {
  const ringSize = 180; // px — outer bounding box

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: ringSize, height: ringSize }}
    >
      {/* ── Outermost slow ring ─────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-400/12"
        animate={isExiting ? { scale: 0.04, opacity: 0 } : { rotate: 360 }}
        transition={
          isExiting
            ? { duration: 0.55, ease: 'easeIn' }
            : { rotate: { duration: 24, repeat: Infinity, ease: 'linear' } }
        }
      />

      {/* ── Mid dashed ring ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute rounded-full border border-dashed border-sky-400/22"
        style={{ inset: 16 }}
        animate={isExiting ? { scale: 2.4, opacity: 0 } : { rotate: -360 }}
        transition={
          isExiting
            ? { duration: 0.65, ease: 'easeOut' }
            : { rotate: { duration: 15, repeat: Infinity, ease: 'linear' } }
        }
      />

      {/* ── Inner energy ring (bright, animated bead) ───────────────────── */}
      <motion.div
        className="absolute rounded-full border border-cyan-400/55
                   shadow-[0_0_18px_rgba(0,229,255,0.25)]"
        style={{ inset: 32 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={
          isExiting
            ? { scale: 3.2, opacity: 0 }
            : {
                opacity: galaxyOpacity,
                rotate:  360,
                scale:   [1, 1.045, 1],
              }
        }
        transition={
          isExiting
            ? { duration: 0.75, ease: 'easeOut' }
            : {
                rotate:  { duration: 7,   repeat: Infinity, ease: 'linear' },
                scale:   { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.5 },
              }
        }
      >
        {/* Glowing bead on the ring */}
        <div
          className="absolute -top-[5px] left-1/2 -translate-x-1/2
                     w-[9px] h-[9px] rounded-full bg-cyan-300"
          style={{
            boxShadow: '0 0 8px #00e5ff, 0 0 18px rgba(0,229,255,0.55)',
          }}
        />
      </motion.div>

      {/* ── Orbiting particles ─────────────────────────────────────────── */}
      {!isExiting && (
        <>
          <OrbitDot radius={60} sizePx={5}  periodSec={5.5}  colorCls="bg-cyan-300"   glowColor="rgba(0,229,255,0.9)"   startDeg={0}   />
          <OrbitDot radius={60} sizePx={3}  periodSec={5.5}  colorCls="bg-sky-200"    glowColor="rgba(56,189,248,0.65)" startDeg={120} />
          <OrbitDot radius={60} sizePx={4}  periodSec={5.5}  colorCls="bg-blue-300"   glowColor="rgba(96,165,250,0.7)"  startDeg={240} />
          <OrbitDot radius={74} sizePx={3}  periodSec={10.5} colorCls="bg-violet-300" glowColor="rgba(167,139,250,0.6)" startDeg={55}  />
          <OrbitDot radius={74} sizePx={2}  periodSec={10.5} colorCls="bg-indigo-200" glowColor="rgba(129,140,248,0.5)" startDeg={195} />
        </>
      )}

      {/* ── DY core logo ────────────────────────────────────────────────── */}
      <motion.div
        className={[
          'relative z-10 flex items-center justify-center rounded-full',
          'bg-gradient-to-br from-[#0b1f42]/95 via-[#051228]/96 to-[#020914]/98',
          'border backdrop-blur-xl transition-all duration-500',
          nearComplete
            ? 'border-cyan-300 shadow-[0_0_55px_rgba(0,229,255,0.85),0_0_110px_rgba(0,229,255,0.35),inset_0_0_28px_rgba(0,229,255,0.12)]'
            : 'border-cyan-400/38 shadow-[0_0_32px_rgba(0,229,255,0.32),inset_0_0_16px_rgba(0,229,255,0.06)]',
        ].join(' ')}
        style={{ width: 92, height: 92 }}
        initial={{ opacity: 0, scale: 0.45 }}
        animate={
          isExiting
            ? { scale: [1, 1.18, 3], opacity: [1, 1, 0] }
            : { opacity: Math.min(galaxyOpacity + 0.45, 1), scale: 1, y: [0, -7, 0] }
        }
        transition={
          isExiting
            ? { duration: 0.85, ease: 'easeInOut', times: [0, 0.25, 1] }
            : {
                opacity: { duration: 0.55 },
                scale:   { duration: 0.5 },
                y:       { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
              }
        }
      >
        {/* Breathing inner pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-cyan-400/28"
          animate={{ scale: [1, 1.16, 1], opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <span
          className={[
            'font-heading font-extrabold text-[26px] sm:text-[30px] tracking-tight',
            'bg-gradient-to-r from-cyan-200 via-sky-200 to-blue-300 bg-clip-text text-transparent',
            'transition-all duration-500',
            nearComplete
              ? 'drop-shadow-[0_0_18px_rgba(0,229,255,0.95)]'
              : 'drop-shadow-[0_0_10px_rgba(0,229,255,0.65)]',
          ].join(' ')}
        >
          DY
        </span>
      </motion.div>
    </div>
  );
}

/** Progress bar with shimmer bead and scanline */
function ProgressBar({ progress }) {
  const pct = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="relative h-[3px] w-full rounded-full overflow-hidden
                    bg-slate-950/90 border border-white/[0.06]">
      {/* Fill */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full
                   bg-gradient-to-r from-blue-600 via-cyan-400 to-sky-200"
        style={{ width: `${pct}%` }}
        transition={{ duration: 0.12, ease: 'linear' }}
      />

      {/* Leading glow bead */}
      {pct > 1 && pct < 99.8 && (
        <motion.div
          className="absolute top-0 h-full w-5 rounded-full"
          style={{
            left:       `calc(${pct}% - 10px)`,
            background: 'radial-gradient(ellipse,rgba(0,229,255,1) 0%,transparent 75%)',
            filter:     'blur(2px)',
          }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Scanline shimmer */}
      <motion.div
        className="absolute inset-y-0 w-7
                   bg-gradient-to-r from-transparent via-white/25 to-transparent"
        animate={{ x: ['-100%', '160%'] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   4. LOADER CORE
   Consumes useLoadingEngine and composes all visual sub-components.
   No loading logic lives here — pure composition.
══════════════════════════════════════════════════════════════════════════ */
function LoaderCore({ onLoadingComplete }) {
  const { progress, displayPct, isExiting, canvasOpacity } =
    useLoadingEngine(onLoadingComplete);

  const isMobile = useIsMobile();

  // Message cross-fade key
  const [msgKey,    setMsgKey]    = useState(0);
  const prevMsgRef                = useRef('');
  const currentMsg                = resolveMessage(progress);

  useEffect(() => {
    if (currentMsg !== prevMsgRef.current) {
      prevMsgRef.current = currentMsg;
      setMsgKey((k) => k + 1);
    }
  }, [currentMsg]);

  const nearComplete = progress >= 94 || isExiting;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center
                 overflow-hidden bg-[#01050e] select-none"
      initial={{ opacity: 1, scale: 1 }}
      animate={isExiting ? { opacity: 0, scale: 1.055 } : { opacity: 1, scale: 1 }}
      transition={{ duration: EXIT_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ── 3-D galaxy background (lazy + suspense fallback) ──────────── */}
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-[#01050e] pointer-events-none z-0" />
        }
      >
        <Galaxy3DBackground
          starOpacity={canvasOpacity.star}
          nebulaOpacity={canvasOpacity.nebula}
          galaxyOpacity={canvasOpacity.galaxy}
          isCollapsing={isExiting}
          isMobile={isMobile}
        />
      </Suspense>

      {/* ── Ambient CSS effects ───────────────────────────────────────── */}
      <TwinkleField  count={isMobile ? 14 : 26} />
      <ShootingStars count={isMobile ?  2 :  4} />

      {/* ── Center HUD ───────────────────────────────────────────────── */}
      <div className="relative z-[2] flex flex-col items-center px-4
                      w-full max-w-[300px] sm:max-w-[340px]">

        {/* Logo + orbital system */}
        <div className="mb-8">
          <LogoSystem
            isExiting={isExiting}
            galaxyOpacity={canvasOpacity.galaxy}
            nearComplete={nearComplete}
          />
        </div>

        {/* Name + title */}
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: Math.min(canvasOpacity.galaxy * 2, 1),
            y:       canvasOpacity.galaxy > 0.08 ? 0 : 18,
          }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <h1 className="text-xl sm:text-2xl font-bold font-heading tracking-tight
                         bg-gradient-to-r from-slate-100 via-cyan-100 to-blue-200
                         bg-clip-text text-transparent leading-tight">
            Devansh Yadav
          </h1>
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase
                        tracking-[0.3em] text-cyan-300/72 mt-1.5">
            Full Stack · AI Developer
          </p>
        </motion.div>

        {/* Progress bar + status row */}
        <div className="w-full space-y-2">
          <ProgressBar progress={progress} />

          <div className="flex items-center justify-between px-0.5">
            {/* Dynamic message — cross-fades on change */}
            <div className="h-4 overflow-hidden flex-1 mr-3">
              <AnimatePresence mode="wait">
                <motion.span
                  key={msgKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="block text-[10px] font-semibold uppercase
                             tracking-[0.22em] text-cyan-200/80 whitespace-nowrap"
                >
                  {currentMsg}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Smooth percentage counter */}
            <span className="font-mono text-[11px] font-bold text-cyan-300
                             tracking-wide tabular-nums">
              {Math.min(Math.round(displayPct), 100)}%
            </span>
          </div>
        </div>

        {/* Pulsing dot indicator */}
        <motion.div
          className="mt-6 flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.min(canvasOpacity.galaxy * 2.2, 0.65) }}
          transition={{ duration: 0.7 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="rounded-full bg-cyan-400"
              style={{ width: i === 2 ? 6 : 4, height: i === 2 ? 6 : 4 }}
              animate={{ opacity: [0.18, 1, 0.18], scale: [0.8, 1.25, 0.8] }}
              transition={{
                duration: 1.5,
                delay:    i * 0.18,
                repeat:   Infinity,
                ease:     'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   5. UTILITY HOOK — mobile detection
══════════════════════════════════════════════════════════════════════════ */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

/* ══════════════════════════════════════════════════════════════════════════
   6. PUBLIC EXPORT
   App.jsx imports this. The interface is unchanged:
     <LoadingScreen onLoadingComplete={fn} />
══════════════════════════════════════════════════════════════════════════ */
export default function LoadingScreen({ onLoadingComplete }) {
  return (
    <LoaderErrorBoundary onLoadingComplete={onLoadingComplete}>
      <LoaderCore onLoadingComplete={onLoadingComplete} />
    </LoaderErrorBoundary>
  );
}

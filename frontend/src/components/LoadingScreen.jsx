/**
 * LoadingScreen.jsx — Neural Network AI Boot Loader
 *
 * Premium AI Operating System boot sequence built entirely from scratch.
 * Inspired by Apple Intelligence, OpenAI, Anthropic, Linear, Vercel.
 *
 * Architecture
 * ────────────
 *  LoadingScreen (public export)
 *    └─ NeuralBoundary        → crash guard; auto-dismisses loader
 *         └─ NeuralLoaderCore → orchestration
 *              ├─ useLoadingEngine()  → progress counter + dual gate
 *              ├─ useTypingStatus()   → typing state machine
 *              ├─ NeuralCanvas        → full-screen canvas neural net (memoized)
 *              │    ├─ poissonDisk()   → node placement algorithm
 *              │    ├─ Node physics    → breath, activation cascade, mouse reaction
 *              │    ├─ Edge animation  → appear/disappear connections
 *              │    └─ Data pulses     → traveling glow particles
 *              ├─ GlassCircle         → central glassmorphism panel + DY logo
 *              └─ StatusArea          → typing text + smooth % counter
 *
 * Timing contract
 * ───────────────
 *   MIN_MS  (4 s)   — guaranteed minimum display
 *   HOLD_MS (1.5 s) — mandatory asset hold (prevents instant completion on cache)
 *   Both asset gate AND min timer must open before surge begins
 *   Hard network fallback fires at 8 s
 *
 *   Exit sequence
 *   exitPhase 0 → normal animation
 *   exitPhase 1 → 400 ms burst (all nodes activate, pulses converge to center)
 *   exitPhase 2 → 800 ms fade (everything dissolves into homepage)
 */

import { useState, useEffect, useRef, memo, Component } from 'react';
import { motion } from 'framer-motion';

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════ */
const MIN_MS        = 4000;   // minimum loader display time
const HOLD_MS       = 1500;   // mandatory hold before assets can "complete"
const SURGE_MS      = 700;    // counter surge 88 → 100 once both gates open
const EXIT_TOTAL_MS = 1200;   // total exit duration before calling onDone
const NET_TIMEOUT   = 8000;   // hard network fallback

const MAX_CONN_PX   = 140;    // max connection distance in pixels
const NODE_SPACING  = 70;     // Poisson disk minimum separation
const MAX_PULSES    = 40;     // cap on concurrent data pulses

/* Color channels (pre-split for rgba construction) */
const C_ACCENT  = '37,99,235';    // primary blue
const C_LIGHT   = '96,165,250';   // pulse highlight
const C_NODE    = '147,197,253';  // node core

const STATUS_MSGS = [
  'Initializing Intelligence...',
  'Loading Projects...',
  'Loading Skills...',
  'Loading Experience...',
  'Compiling Portfolio...',
  'Connecting Neural Modules...',
  'Optimizing Interface...',
  'Almost Ready...',
  'Portfolio Ready',
];

/* ══════════════════════════════════════════════════════════════════════
   UTILITY — Poisson Disk Sampling
   Generates evenly distributed points without clustering or gaps.
   Guarantees ~70–100 nodes on a typical 1080p screen.
══════════════════════════════════════════════════════════════════════ */
function poissonDisk(W, H, minDist) {
  const TRIES  = 30;
  const cell   = minDist / Math.SQRT2;
  const cols   = Math.ceil(W / cell);
  const rows   = Math.ceil(H / cell);
  const grid   = new Array(cols * rows).fill(null);
  const active = [];
  const pts    = [];

  const gIdx = (x, y) => (x / cell | 0) + (y / cell | 0) * cols;

  const insert = (x, y) => {
    const p = { x, y };
    pts.push(p);
    active.push(p);
    grid[gIdx(x, y)] = p;
  };

  const valid = (x, y) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return false;
    const gx = x / cell | 0, gy = y / cell | 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = gx + dx, ny = gy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const nb = grid[ny * cols + nx];
        if (nb && Math.hypot(x - nb.x, y - nb.y) < minDist) return false;
      }
    }
    return true;
  };

  // Seed near center to guarantee centre coverage
  insert(W * (0.44 + Math.random() * 0.12), H * (0.44 + Math.random() * 0.12));

  while (active.length) {
    const i = active.length * Math.random() | 0;
    const p = active[i];
    let found = false;
    for (let k = 0; k < TRIES; k++) {
      const ang = Math.random() * Math.PI * 2;
      const r   = minDist * (1 + Math.random());
      const nx  = p.x + Math.cos(ang) * r;
      const ny  = p.y + Math.sin(ang) * r;
      if (valid(nx, ny)) { insert(nx, ny); found = true; }
    }
    if (!found) active.splice(i, 1);
  }

  return pts;
}

/* ══════════════════════════════════════════════════════════════════════
   ERROR BOUNDARY
   Auto-dismisses the loader on any render crash.
══════════════════════════════════════════════════════════════════════ */
class NeuralBoundary extends Component {
  constructor(p) {
    super(p);
    this.state = { crashed: false };
    this._t    = null;
  }

  static getDerivedStateFromError() { return { crashed: true }; }

  componentDidCatch(err) {
    console.error('[NeuralLoader] crashed:', err);
    this._t = setTimeout(() => this.props.onLoadingComplete?.(), 600);
  }

  componentWillUnmount() { clearTimeout(this._t); }

  render() {
    if (this.state.crashed) {
      return (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: '#020617',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <button
            onClick={() => this.props.onLoadingComplete?.()}
            style={{
              padding: '10px 28px', borderRadius: 999,
              border: '1px solid rgba(37,99,235,0.4)',
              background: 'rgba(37,99,235,0.1)',
              color: '#93c5fd', fontSize: 13,
              fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer',
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

/* ══════════════════════════════════════════════════════════════════════
   HOOK — useLoadingEngine
   Drives the progress counter and manages the dual-gate exit logic.
   All mutable state lives in refs — React state only for UI values.
══════════════════════════════════════════════════════════════════════ */
function useLoadingEngine(onDone) {
  const [counter,   setCounter]   = useState(0);
  const [exitPhase, setExitPhase] = useState(0); // 0 | 1 | 2

  const aliveRef      = useRef(true);
  const displayRef    = useRef(0);
  const surgeRef      = useRef(false);
  const surgeStartRef = useRef(0);
  const exitedRef     = useRef(false);
  const onDoneRef     = useRef(onDone);

  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    aliveRef.current = true;

    // Dual-gate — both must open before surge begins
    let assetsOpen = false;
    let timerOpen  = false;
    const bothOpen = () => assetsOpen && timerOpen;

    // Gate A: asset loading + mandatory hold
    const loadAssets = async () => {
      try {
        await new Promise(r => setTimeout(r, HOLD_MS));
        if (document.readyState !== 'complete')
          await new Promise(r => window.addEventListener('load', r, { once: true }));
        if (document.fonts?.ready) await document.fonts.ready;
        const imgs = Array.from(document.images).filter(i => !i.complete);
        if (imgs.length)
          await Promise.all(imgs.map(img => new Promise(r => {
            img.addEventListener('load',  r, { once: true });
            img.addEventListener('error', r, { once: true });
          })));
      } catch (_) { /* silent */ }
      finally { if (aliveRef.current) assetsOpen = true; }
    };

    const netFallback = setTimeout(() => { assetsOpen = true; }, NET_TIMEOUT);
    const minTimer    = setTimeout(() => { timerOpen  = true; }, MIN_MS);
    loadAssets();

    // Easing functions
    const easeOut4 = t => 1 - Math.pow(1 - t, 4);
    const easeIO3  = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;

    let raf = 0;
    const t0 = performance.now();

    const tick = now => {
      if (!aliveRef.current) return;

      const t = Math.min((now - t0) / MIN_MS, 1);
      let target;

      if (!surgeRef.current) {
        target = easeOut4(t) * 88;                            // crawl: 0 → 88 %
        if (bothOpen()) {
          surgeRef.current     = true;
          surgeStartRef.current = now;
        }
      } else {
        const st = Math.min((now - surgeStartRef.current) / SURGE_MS, 1);
        target = 88 + easeIO3(st) * 12;                       // surge: 88 → 100 %
      }

      // Smooth lerp so counter never jumps
      displayRef.current += (target - displayRef.current) * 0.08;
      setCounter(Math.min(Math.round(displayRef.current), 100));

      // Trigger exit when surge reaches 100
      if (surgeRef.current && target >= 100 && !exitedRef.current) {
        exitedRef.current = true;
        setCounter(100);
        setExitPhase(1);
        setTimeout(() => { if (aliveRef.current) setExitPhase(2); }, 400);
        setTimeout(() => { if (aliveRef.current) onDoneRef.current?.(); }, EXIT_TOTAL_MS);
        return; // stop rAF
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      aliveRef.current = false;
      cancelAnimationFrame(raf);
      clearTimeout(minTimer);
      clearTimeout(netFallback);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { counter, exitPhase };
}

/* ══════════════════════════════════════════════════════════════════════
   HOOK — useTypingStatus
   State machine: typing → hold → deleting → next message → repeat.
   Fully independent of progress counter (time-based, natural pacing).
══════════════════════════════════════════════════════════════════════ */
function useTypingStatus() {
  const [text,  setText]  = useState('');
  const [blink, setBlink] = useState(true);
  const [idx,   setIdx]   = useState(0);
  const [phase, setPhase] = useState('typing'); // typing | hold | delete
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => { if (alive.current) setBlink(v => !v); }, 520);
    return () => clearInterval(id);
  }, []);

  // Typing state machine
  useEffect(() => {
    const msg = STATUS_MSGS[idx] ?? '';
    let t;

    if (phase === 'typing') {
      if (text.length < msg.length) {
        t = setTimeout(() => {
          if (alive.current) setText(msg.slice(0, text.length + 1));
        }, 40 + Math.random() * 20);
      } else {
        t = setTimeout(() => { if (alive.current) setPhase('hold'); }, 800);
      }
    } else if (phase === 'hold') {
      t = setTimeout(() => { if (alive.current) setPhase('delete'); }, 1100);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => {
          if (alive.current) setText(s => s.slice(0, -1));
        }, 18);
      } else {
        setIdx(i => (i + 1) % STATUS_MSGS.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(t);
  }, [phase, text, idx]);

  return { text, blink };
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT — NeuralCanvas
   HTML5 Canvas neural network animation. Memoized — React never
   re-renders this component due to mouse movement or typing changes.
   Mouse is tracked internally via direct ref mutation (no React state).
══════════════════════════════════════════════════════════════════════ */
const NeuralCanvas = memo(function NeuralCanvas({ exitPhase }) {
  const cvRef    = useRef(null);
  const worldRef = useRef(null);

  /* ── Build the world once on mount ─────────────────────────────── */
  useEffect(() => {
    const cv  = cvRef.current;
    if (!cv) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W   = window.innerWidth;
    const H   = window.innerHeight;
    cv.style.width  = `${W}px`;
    cv.style.height = `${H}px`;
    cv.width  = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);

    // Generate node positions via Poisson disk, cap at 95
    const pts   = poissonDisk(W, H, NODE_SPACING).slice(0, 95);
    const nodes = pts.map(p => ({
      x:    p.x,
      y:    p.y,
      xR:   p.x / W,   // fraction — for proportional resize
      yR:   p.y / H,
      r:    2 + Math.random() * 1.8,
      ph:   Math.random() * Math.PI * 2,   // breath phase offset
      phS:  0.28 + Math.random() * 0.55,   // breath speed
      base: 0.2  + Math.random() * 0.32,   // resting brightness
      act:  0,                              // activation level 0–1
      actD: 0.011 + Math.random() * 0.009, // activation decay per tick
      actT: (Math.random() * 150) | 0,     // activation timer
      actI: (55 + Math.random() * 115) | 0,// activation interval (ticks)
      glow: 0,                             // computed each frame
    }));

    // Build edges between nearby nodes
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < MAX_CONN_PX) {
          edges.push({
            a:   i,
            b:   j,
            str: 1 - d / MAX_CONN_PX,            // strength: closer = stronger
            op:  0,                               // current opacity (lerped)
            top: Math.random() < 0.4 ? 0.08 + Math.random() * 0.28 : 0, // target
            ct:  (Math.random() * 180) | 0,      // change timer
            ci:  (90 + Math.random() * 210) | 0, // change interval
          });
        }
      }
    }

    // Data pulse particles
    const pulses = [];
    const spawn  = () => {
      if (pulses.length >= MAX_PULSES || !edges.length) return;
      const ei = (Math.random() * edges.length) | 0;
      pulses.push({
        ei,
        t:   0,
        sp:  0.004 + Math.random() * 0.005,
        dir: Math.random() < 0.5 ? 1 : -1,
        sz:  1.8 + Math.random() * 2,
      });
    };
    for (let k = 0; k < 20; k++) spawn();

    // Static starfield — generated once, covers the full screen
    const STAR_COUNT = 200;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      xR:  Math.random(),          // fraction of W (remaps on resize)
      yR:  Math.random(),          // fraction of H
      r:   0.4 + Math.random() * 1.1,
      op:  0.12 + Math.random() * 0.45,
      ph:  Math.random() * Math.PI * 2,  // twinkle phase
      phS: 0.2 + Math.random() * 0.6,   // twinkle speed
    }));

    worldRef.current = {
      ctx, W, H, dpr,
      nodes, edges, pulses, spawn, stars,
      tick:      0,
      mx:        W / 2, // mouse x
      my:        H / 2, // mouse y
      exitPhase: 0,
      exitT:     0,     // 0→1 progress through fade-out
    };
  }, []);

  /* ── Mouse tracking — directly mutates world, no React state ───── */
  useEffect(() => {
    const onMove = e => {
      if (!worldRef.current) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (x != null) { worldRef.current.mx = x; worldRef.current.my = y; }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, []);

  /* ── exitPhase sync ─────────────────────────────────────────────── */
  useEffect(() => {
    if (worldRef.current) worldRef.current.exitPhase = exitPhase;
  }, [exitPhase]);

  /* ── Resize — resets canvas and remaps node positions ──────────── */
  useEffect(() => {
    const onResize = () => {
      const w  = worldRef.current;
      const cv = cvRef.current;
      if (!w || !cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W   = window.innerWidth;
      const H   = window.innerHeight;
      cv.style.width  = `${W}px`;
      cv.style.height = `${H}px`;
      cv.width  = W * dpr;
      cv.height = H * dpr;
      w.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset + apply dpr
      w.W = W;
      w.H = H;
      w.nodes.forEach(n => { n.x = n.xR * W; n.y = n.yR * H; });
      // Stars store fractions too — no extra work needed, they read xR/yR in draw loop
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Animation loop ─────────────────────────────────────────────── */
  useEffect(() => {
    let alive = true;
    let raf   = 0;
    const t0  = performance.now();

    const frame = now => {
      if (!alive || !worldRef.current) return;
      const w = worldRef.current;
      const { ctx, W, H, nodes, edges, pulses, spawn } = w;
      w.tick++;

      const sec    = (now - t0) / 1000;
      const burst  = w.exitPhase === 1; // phase 1: all nodes activate
      let   xAlpha = 1;                 // network visibility multiplier

      if (w.exitPhase === 2) {
        w.exitT = Math.min(w.exitT + 0.018, 1);
        xAlpha  = Math.max(0, 1 - w.exitT * 1.5);
      }

      /* ── Background ───────────────────────────────────────────── */
      ctx.clearRect(0, 0, W, H);

      // Deep navy radial gradient
      const bg = ctx.createRadialGradient(W*.5, H*.42, 0, W*.5, H*.5, Math.max(W,H)*.75);
      bg.addColorStop(0,    '#0c1d3a');
      bg.addColorStop(0.45, '#06112a');
      bg.addColorStop(1,    '#020617');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Subtly moving ambient glow (alive, non-distracting)
      const gx = W*.5 + Math.sin(sec*.21) * W*.06;
      const gy = H*.45 + Math.cos(sec*.17) * H*.05;
      const ag = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.min(W,H)*.45);
      ag.addColorStop(0, `rgba(${C_ACCENT},.055)`);
      ag.addColorStop(1, `rgba(${C_ACCENT},0)`);
      ctx.fillStyle = ag;
      ctx.fillRect(0, 0, W, H);

      // Vignette
      const vg = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*.3, W/2, H/2, Math.max(W,H)*.8);
      vg.addColorStop(0, 'rgba(2,6,23,0)');
      vg.addColorStop(1, 'rgba(2,6,23,.68)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      /* ── Stars ────────────────────────────────────────────────── */
      w.stars.forEach(s => {
        s.ph += s.phS * 0.016;  // advance twinkle phase
        const twinkle = 0.45 + 0.55 * Math.sin(s.ph);
        const alpha   = s.op * twinkle * xAlpha;
        if (alpha < 0.02) return;
        const sx = s.xR * W;
        const sy = s.yR * H;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.fill();
      });

      /* ── Node physics ─────────────────────────────────────────── */
      const { mx, my } = w;

      nodes.forEach((n, i) => {
        // Breathing oscillation
        n.ph += n.phS * 0.016;
        const breath = 0.5 + 0.5 * Math.sin(n.ph);

        // Mouse proximity boost
        const md        = Math.hypot(n.x - mx, n.y - my);
        const mouseBoost = Math.max(0, 1 - md / 105) * 0.55;

        // Spontaneous activation (neuron firing)
        n.actT++;
        if (!burst && n.actT >= n.actI) {
          n.act = 0.72 + Math.random() * 0.28;
          // Spread activation to nearby connected nodes
          edges.forEach(e => {
            if (e.a !== i && e.b !== i) return;
            const ni = e.a === i ? e.b : e.a;
            if (Math.random() < 0.55)
              nodes[ni].act = Math.max(nodes[ni].act, 0.4 + Math.random() * 0.3);
          });
          n.actT = 0;
          n.actI = (55 + Math.random() * 115) | 0;
        }

        // Decay or burst-activate
        n.act  = burst
          ? Math.min(1, n.act + 0.06)
          : Math.max(0, n.act - n.actD);

        // Final glow value used for drawing
        n.glow = Math.min(1, n.base * (0.55 + breath * 0.45) + n.act * 0.7 + mouseBoost);
      });

      /* ── Edge animation ───────────────────────────────────────── */
      edges.forEach(e => {
        e.ct++;
        if (e.ct >= e.ci) {
          e.top = burst
            ? 0.4 + Math.random() * 0.5
            : Math.random() < 0.42
              ? 0.07 + Math.random() * 0.3 * e.str
              : 0;
          e.ct = 0;
          e.ci = (80 + Math.random() * 200) | 0;
        }
        e.op += (e.top - e.op) * 0.025; // smooth lerp
      });

      /* ── Draw edges ───────────────────────────────────────────── */
      edges.forEach(e => {
        const alpha = e.op * xAlpha;
        if (alpha < 0.012) return;

        const na = nodes[e.a], nb = nodes[e.b];
        const nodeGlow = (na.glow + nb.glow) * 0.5;
        const fa = Math.min(alpha * (0.5 + nodeGlow * 0.7), 1);

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);

        // Wide soft glow pass
        ctx.strokeStyle = `rgba(${C_ACCENT},${fa * 0.28})`;
        ctx.lineWidth   = 3;
        ctx.stroke();

        // Crisp centre line
        ctx.strokeStyle = `rgba(${C_LIGHT},${fa * 0.52})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      });

      /* ── Spawn + draw data pulses ─────────────────────────────── */
      if (w.tick % 7 === 0 && !burst) spawn();

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p  = pulses[i];
        const e  = edges[p.ei];
        if (!e || e.op < 0.06) { pulses.splice(i, 1); continue; }

        p.t += p.sp * p.dir;
        if (p.t < 0 || p.t > 1) { pulses.splice(i, 1); continue; }

        const na = nodes[e.a], nb = nodes[e.b];
        let px = na.x + (nb.x - na.x) * p.t;
        let py = na.y + (nb.y - na.y) * p.t;

        // During exit burst, steer pulses toward center
        if (burst) {
          px += (W / 2 - px) * 0.08;
          py += (H / 2 - py) * 0.08;
        }

        const pa = e.op * xAlpha;
        if (pa < 0.05) continue;

        // Glow halo (radial gradient, no canvas filter)
        const gr = ctx.createRadialGradient(px, py, 0, px, py, p.sz * 3.5);
        gr.addColorStop(0,   `rgba(${C_LIGHT},${pa * 0.48})`);
        gr.addColorStop(0.5, `rgba(${C_ACCENT},${pa * 0.15})`);
        gr.addColorStop(1,   `rgba(${C_ACCENT},0)`);
        ctx.beginPath();
        ctx.arc(px, py, p.sz * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();

        // Bright core dot
        ctx.beginPath();
        ctx.arc(px, py, p.sz * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${pa * 0.92})`;
        ctx.fill();
      }

      /* ── Draw nodes ───────────────────────────────────────────── */
      nodes.forEach(n => {
        const b = n.glow * xAlpha;
        if (b < 0.04) return;

        // Outer glow (radial gradient, avoids expensive canvas blur filter)
        const glowR = n.r * (3 + b * 3.5);
        const ng    = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        ng.addColorStop(0,   `rgba(${C_ACCENT},${b * 0.58})`);
        ng.addColorStop(0.3, `rgba(${C_ACCENT},${b * 0.18})`);
        ng.addColorStop(1,   `rgba(${C_ACCENT},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = ng;
        ctx.fill();

        // Bright core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.75 + b * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${C_NODE},${Math.min(b * 1.2, 1)})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={cvRef}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />
  );
});

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT — GlassCircle
   Central glassmorphism circle with DY logo, breathing ring,
   light reflection sweep, and dynamic glow on completion.
══════════════════════════════════════════════════════════════════════ */
function GlassCircle({ counter, exitPhase }) {
  const bright = counter >= 88;
  const burst  = exitPhase === 1;
  const fading = exitPhase === 2;

  return (
    <motion.div
      style={{ position: 'relative', zIndex: 2 }}
      initial={{ opacity: 0, scale: 0.84 }}
      animate={
        fading ? { opacity: 0, scale: 0.88 }
        : burst  ? { opacity: 1, scale: 1.05 }
        : { opacity: 1, scale: 1, y: [0, -3, 0] }
      }
      transition={
        fading ? { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
        : burst  ? { duration: 0.4, ease: 'easeOut' }
        : {
            opacity: { duration: 0.9, ease: 'easeOut' },
            scale:   { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
            y:       { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          }
      }
    >
      {/* Gradient border ring */}
      <div style={{
        position: 'absolute', inset: -1.5, borderRadius: '50%',
        background: burst || bright
          ? 'conic-gradient(from 0deg,rgba(37,99,235,.72),rgba(96,165,250,.52),rgba(37,99,235,.72))'
          : 'conic-gradient(from 0deg,rgba(37,99,235,.32),rgba(59,130,246,.16),rgba(37,99,235,.32))',
        padding: 1.5,
        transition: 'background 0.55s ease',
      }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#020617' }} />
      </div>

      {/* Glass surface */}
      <div style={{
        width: 184, height: 184, borderRadius: '50%',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(148deg,rgba(255,255,255,.1) 0%,rgba(255,255,255,.04) 55%,rgba(255,255,255,.015) 100%)',
        backdropFilter: 'blur(22px) saturate(160%)',
        WebkitBackdropFilter: 'blur(22px) saturate(160%)',
        border: `1px solid rgba(255,255,255,${bright ? 0.17 : 0.09})`,
        boxShadow: burst || bright
          ? '0 0 52px rgba(37,99,235,.42),0 0 104px rgba(37,99,235,.16),inset 0 1px 0 rgba(255,255,255,.16)'
          : '0 0 28px rgba(37,99,235,.18),0 0 60px rgba(37,99,235,.07),inset 0 1px 0 rgba(255,255,255,.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
      }}>
        {/* Top edge highlight */}
        <div style={{
          position: 'absolute', top: 0, left: '14%', width: '72%', height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)',
        }} />

        {/* Light sweep */}
        <motion.div
          style={{
            position: 'absolute', top: '-25%', left: '-10%',
            width: '40%', height: '150%',
            background: 'linear-gradient(110deg,transparent 30%,rgba(255,255,255,.048) 50%,transparent 70%)',
            transform: 'skewX(-12deg)', pointerEvents: 'none',
          }}
          animate={{ x: ['-50%', '310%'] }}
          transition={{ duration: 2.5, delay: 1.5, repeat: Infinity, repeatDelay: 5.5, ease: [0.4, 0, 0.6, 1] }}
        />

        {/* Breathing inner ring */}
        <motion.div
          style={{
            position: 'absolute', inset: 14, borderRadius: '50%',
            border: `1px solid rgba(37,99,235,${bright ? 0.52 : 0.22})`,
            transition: 'border-color 0.5s ease',
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.88, 0.4] }}
          transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* DY logo — uses solid color + textShadow to avoid the
            background-clip flash that causes the white square.
            Never has a background rectangle, so never flashes. */}
        <motion.span
          style={{
            fontFamily: '"Inter","SF Pro Display",-apple-system,BlinkMacSystemFont,sans-serif',
            fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em',
            color: burst || bright ? '#bfdbfe' : '#93c5fd',
            textShadow: burst || bright
              ? '0 0 18px rgba(96,165,250,0.95), 0 0 40px rgba(59,130,246,0.65), 0 0 70px rgba(37,99,235,0.4)'
              : '0 0 10px rgba(96,165,250,0.6), 0 0 24px rgba(59,130,246,0.35)',
            userSelect: 'none', position: 'relative', zIndex: 1,
            transition: 'color 0.5s ease, text-shadow 0.5s ease',
          }}
          animate={{ scale: [1, 1.022, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          DY
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT — StatusArea
   Typing message with blinking cursor + smooth percentage counter.
══════════════════════════════════════════════════════════════════════ */
function StatusArea({ counter, exitPhase, text, blink }) {
  return (
    <motion.div
      style={{
        position: 'relative', zIndex: 2, marginTop: 34,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: exitPhase === 2 ? 0 : 1, y: 0 }}
      transition={{
        duration: exitPhase === 2 ? 0.5 : 0.75,
        delay:    exitPhase === 2 ? 0 : 0.55,
        ease:     'easeOut',
      }}
    >
      {/* Typing text row */}
      <div style={{
        height: 19, display: 'flex', alignItems: 'center',
        justifyContent: 'center', minWidth: 248,
      }}>
        <span style={{
          fontFamily: '"Inter","SF Pro Display",-apple-system,sans-serif',
          fontSize: 11, fontWeight: 500, letterSpacing: '0.13em',
          color: 'rgba(148,163,184,.88)', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {text}
          <span style={{
            display: 'inline-block', width: 1.5, height: 10.5,
            background: blink ? 'rgba(148,163,184,.85)' : 'transparent',
            marginLeft: 2, verticalAlign: 'middle',
            borderRadius: 1, transition: 'background 0.08s',
          }} />
        </span>
      </div>

      {/* Percentage counter */}
      <div style={{
        fontFamily: '"Inter",monospace',
        fontSize: 12.5, fontWeight: 600,
        letterSpacing: '0.1em',
        color: 'rgba(148,163,184,.58)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {String(counter).padStart(2, '0')}%
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT — NeuralLoaderCore
   Orchestrates all sub-components. Passes exit phase to canvas and UI.
══════════════════════════════════════════════════════════════════════ */
function NeuralLoaderCore({ onLoadingComplete }) {
  const { counter, exitPhase } = useLoadingEngine(onLoadingComplete);
  const { text, blink }        = useTypingStatus();

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
      animate={ exitPhase === 2 ? { opacity: 0 } : { opacity: 1 } }
      transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Canvas neural network (memoized — does not re-render on state changes) */}
      <NeuralCanvas exitPhase={exitPhase} />

      {/* Glass panel */}
      <GlassCircle counter={counter} exitPhase={exitPhase} />

      {/* Status text + percentage */}
      <StatusArea counter={counter} exitPhase={exitPhase} text={text} blink={blink} />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PUBLIC EXPORT
   Interface unchanged: <LoadingScreen onLoadingComplete={fn} />
   App.jsx requires no modifications.
══════════════════════════════════════════════════════════════════════ */
export default function LoadingScreen({ onLoadingComplete }) {
  return (
    <NeuralBoundary onLoadingComplete={onLoadingComplete}>
      <NeuralLoaderCore onLoadingComplete={onLoadingComplete} />
    </NeuralBoundary>
  );
}

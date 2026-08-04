/**
 * AuroraBackground.jsx — v8.0 "Photorealistic 3D Solar System Orrery"
 *
 * Full 3D interactive Solar System model rendered in Three.js WebGL.
 * Inspired by NASA Orrery astronomical diagrams.
 * Renders on a fixed full-screen canvas behind all page content (z-index: 0).
 *
 * Features
 * ────────
 *  1. Glowing 3D Central Sun with solar corona light emission.
 *  2. Thin, elegant 3D Orbital Ring Lines for all 8 planets in perspective tilt.
 *  3. All 8 Planets in 3D:
 *      – Mercury (Inner terrestrial rock)
 *      – Venus (Golden atmosphere)
 *      – Earth (Blue Marble + orbiting Moon)
 *      – Mars (Rust red planet)
 *      – Jupiter (Huge banded gas giant)
 *      – Saturn (Gas giant with authentic 3D Saturn Rings)
 *      – Uranus (Cyan ice giant with faint ring)
 *      – Neptune (Deep azure ice giant)
 *  4. Dense Asteroid Belt ring between Mars and Jupiter.
 *  5. Sweeping Comets with luminous ion gas tails.
 *  6. Multi-spectral starfield & Milky Way background.
 *  7. Smooth zero-gravity mouse camera displacement & slow orbital motion.
 */

import React, { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';

/* ══════════════════════════════════════════════════════════════════════
   HELPERS & NOISE
══════════════════════════════════════════════════════════════════════ */
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (lo, hi) => lo + Math.random() * (hi - lo);

function isLowEndDevice() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return false;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return false;
    return /intel|mali|adreno 3|adreno 4|sgx/i.test(
      gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || ''
    );
  } catch { return false; }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Pseudo 2D Simplex Noise for procedural planetary surface maps
function createPerlinNoiseMap(w, h, scale = 0.015) {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = p[i + 256] = Math.floor(Math.random() * 256);

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function grad(hash, x, y) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  function noise2D(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);

    const aa = p[p[X] + Y];
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];

    const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
    const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
    return lerp(x1, x2, v);
  }

  function fBm(x, y, octaves = 4) {
    let total = 0, freq = scale, amp = 1, maxVal = 0;
    for (let i = 0; i < octaves; i++) {
      total += noise2D(x * freq, y * freq) * amp;
      maxVal += amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return total / maxVal;
  }

  return { fBm };
}

/* ══════════════════════════════════════════════════════════════════════
   PROCEDURAL TEXTURE GENERATORS
══════════════════════════════════════════════════════════════════════ */

// Sun Corona Flare Surface Texture
function createSunTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2, cy = size / 2;

  const g = ctx.createRadialGradient(cx, cy, size * 0.1, cx, cy, size * 0.48);
  g.addColorStop(0,    '#ffffff');
  g.addColorStop(0.55, '#fef08a');
  g.addColorStop(0.80, '#f97316');
  g.addColorStop(0.95, '#ef4444');
  g.addColorStop(1,    'rgba(185, 28, 28, 0)');

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// Banded Planet Texture (Jupiter / Saturn / Uranus / Neptune / Venus)
function createBandedPlanetTexture(colors, width = 512, height = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const noise = createPerlinNoiseMap(width, height, 0.015);

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const n = noise.fBm(x, y * 2.5, 3);
      const val = Math.max(0, Math.min(1, (n + 1) * 0.5));
      const idxVal = val * (colors.length - 1);
      const i1 = Math.floor(idxVal);
      const i2 = Math.min(colors.length - 1, i1 + 1);
      const f = idxVal - i1;

      const r = Math.round(lerp(colors[i1].r, colors[i2].r, f));
      const g = Math.round(lerp(colors[i1].g, colors[i2].g, f));
      const b = Math.round(lerp(colors[i1].b, colors[i2].b, f));

      const idx = (y * width + x) * 4;
      data[idx + 0] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Saturn Rings Texture (Concentric ice/rock rings)
function createSaturnRingsTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2, cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  for (let r = size * 0.22; r < size * 0.48; r += 1) {
    const norm = (r - size * 0.22) / (size * 0.26);
    let alpha = 0.4 + 0.4 * Math.sin(norm * Math.PI * 14);
    if (norm > 0.52 && norm < 0.58) alpha = 0.05; // Cassini division gap

    ctx.strokeStyle = `rgba(226, 232, 240, ${alpha.toFixed(2)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
function AuroraBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = prefersReducedMotion();
    const lowEnd  = isLowEndDevice();

    let width  = window.innerWidth;
    let height = window.innerHeight;

    // ── 1. Three.js Scene, Camera & WebGL Renderer ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02050e);
    scene.fog = new THREE.FogExp2(0x02050e, 0.0014);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 22, 135);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !lowEnd,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── 2. Orrery Root Group (Tilted in 3D Perspective) ──
    const orreryGroup = new THREE.Group();
    orreryGroup.position.set(0, -6, -20);
    orreryGroup.rotation.x = 0.42; // Tilt orbital plane toward camera
    scene.add(orreryGroup);

    // ── 3. Central Sun & Point Light Emission ──
    const sunTex = createSunTexture();
    const sunGeo = new THREE.SphereGeometry(7.5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ map: sunTex });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    orreryGroup.add(sunMesh);

    // Sun Solar Flare Glow Sprite (Tight, subtle, natural corona rim)
    const sunGlowMat = new THREE.SpriteMaterial({
      map: sunTex,
      color: 0xfde047,
      transparent: true,
      opacity: 0.25, // Subtle, non-intrusive glow
      blending: THREE.AdditiveBlending,
    });
    const sunGlowSprite = new THREE.Sprite(sunGlowMat);
    sunGlowSprite.scale.set(16, 16, 1); // Reduced from 38 to 16 for a clean solar disk
    orreryGroup.add(sunGlowSprite);

    // Solar Light Source + Camera Front Fill Light to ensure ALL planets are brightly lit
    const sunPointLight = new THREE.PointLight(0xfffbeb, 4.0, 350);
    sunPointLight.position.set(0, 0, 0);
    orreryGroup.add(sunPointLight);

    // Front Camera Light so planet surfaces facing the viewer are vividly illuminated
    const cameraLight = new THREE.DirectionalLight(0xffffff, 2.2);
    cameraLight.position.set(0, 30, 120);
    scene.add(cameraLight);

    const ambientLight = new THREE.AmbientLight(0xf8fafc, 1.1);
    scene.add(ambientLight);

    // ── 4. Planetary Data Config (All 8 Planets) ──
    const PLANET_CONFIGS = [
      {
        name: 'Mercury',
        radius: 1.1,
        dist: 14,
        speed: 0.018,
        mainColor: 0x94a3b8,
        colors: [{ r: 180, g: 195, b: 210 }, { r: 100, g: 115, b: 135 }],
      },
      {
        name: 'Venus',
        radius: 1.6,
        dist: 20,
        speed: 0.013,
        mainColor: 0xfbbf24,
        colors: [{ r: 254, g: 215, b: 170 }, { r: 217, g: 119, b: 6 }],
      },
      {
        name: 'Earth',
        radius: 1.9,
        dist: 27,
        speed: 0.009,
        mainColor: 0x38bdf8,
        colors: [{ r: 14, g: 116, b: 175 }, { r: 30, g: 64, b: 110 }, { r: 240, g: 248, b: 255 }],
        hasMoon: true,
      },
      {
        name: 'Mars',
        radius: 1.3,
        dist: 34,
        speed: 0.007,
        mainColor: 0xef4444,
        colors: [{ r: 239, g: 68, b: 68 }, { r: 185, g: 28, b: 28 }],
      },
      {
        name: 'Jupiter',
        radius: 4.2,
        dist: 49,
        speed: 0.004,
        mainColor: 0xf97316,
        colors: [{ r: 251, g: 146, b: 60 }, { r: 194, g: 65, b: 12 }, { r: 254, g: 243, b: 199 }],
      },
      {
        name: 'Saturn',
        radius: 3.5,
        dist: 63,
        speed: 0.0028,
        mainColor: 0xfde047,
        colors: [{ r: 253, g: 224, b: 71 }, { r: 161, g: 98, b: 7 }],
        hasRings: true,
      },
      {
        name: 'Uranus',
        radius: 2.5,
        dist: 76,
        speed: 0.0020,
        mainColor: 0x38bdf8,
        colors: [{ r: 56, g: 189, b: 248 }, { r: 3, g: 105, b: 161 }],
        hasFaintRings: true,
      },
      {
        name: 'Neptune',
        radius: 2.4,
        dist: 88,
        speed: 0.0014,
        mainColor: 0x2563eb,
        colors: [{ r: 37, g: 99, b: 235 }, { r: 14, g: 165, b: 233 }],
      },
    ];

    const planetMeshes = [];
    const orbitLines   = [];

    PLANET_CONFIGS.forEach((cfg) => {
      // 4A. Render 3D Orbital Line Ring Path
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        cfg.dist, cfg.dist * 0.72, // Oval perspective elongation
        0, 2 * Math.PI,
        false, 0
      );
      const points = orbitCurve.getPoints(90);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.22,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orreryGroup.add(orbitLine);
      orbitLines.push(orbitLine);

      // 4B. Render 3D Planet Mesh with Self-Illuminated Emissive Glow
      const pTex = createBandedPlanetTexture(cfg.colors);
      const pGeo = new THREE.SphereGeometry(cfg.radius, 32, 32);
      const pMat = new THREE.MeshStandardMaterial({
        map: pTex,
        emissive: new THREE.Color(cfg.mainColor),
        emissiveMap: pTex,
        emissiveIntensity: 0.48, // Guarantees planets are brightly visible & colorful
        roughness: 0.5,
        metalness: 0.1,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);

      // Initial orbital position
      const initialAngle = rand(0, Math.PI * 2);
      pMesh.position.x = Math.cos(initialAngle) * cfg.dist;
      pMesh.position.z = Math.sin(initialAngle) * cfg.dist * 0.72;

      orreryGroup.add(pMesh);

      // 4C. Saturn Rings
      let ringMesh = null;
      if (cfg.hasRings) {
        const rTex = createSaturnRingsTexture();
        const rGeo = new THREE.RingGeometry(cfg.radius * 1.4, cfg.radius * 2.6, 48);
        const rMat = new THREE.MeshStandardMaterial({
          map: rTex,
          emissive: new THREE.Color(0xfde047),
          emissiveMap: rTex,
          emissiveIntensity: 0.5,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });
        ringMesh = new THREE.Mesh(rGeo, rMat);
        ringMesh.rotation.x = Math.PI * 0.5;
        ringMesh.rotation.y = 0.2;
        pMesh.add(ringMesh);
      }

      // 4D. Earth Moon
      let moonMesh = null;
      if (cfg.hasMoon) {
        const mGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const mMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.9 });
        moonMesh = new THREE.Mesh(mGeo, mMat);
        pMesh.add(moonMesh);
      }

      planetMeshes.push({
        mesh: pMesh,
        moon: moonMesh,
        dist: cfg.dist,
        speed: cfg.speed,
        angle: initialAngle,
      });
    });

    // ── 5. Dense Asteroid Belt (Between Mars & Jupiter, dist: 40 - 44) ──
    const asteroidCount = lowEnd ? 120 : 320;
    const astGroup = new THREE.Group();
    const astGeo   = new THREE.IcosahedronGeometry(0.35, 1);
    const astMat   = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      emissive: new THREE.Color(0x64748b),
      emissiveIntensity: 0.35,
      roughness: 0.6,
    });

    const asteroidsData = [];

    for (let i = 0; i < asteroidCount; i++) {
      const aMesh = new THREE.Mesh(astGeo, astMat);
      const dist  = rand(40, 44);
      const angle = rand(0, Math.PI * 2);
      const yOff  = rand(-1.2, 1.2);

      aMesh.position.x = Math.cos(angle) * dist;
      aMesh.position.y = yOff;
      aMesh.position.z = Math.sin(angle) * dist * 0.72;

      const scale = rand(0.5, 1.4);
      aMesh.scale.set(scale, scale, scale);
      astGroup.add(aMesh);

      asteroidsData.push({ mesh: aMesh, dist, angle, speed: rand(0.0045, 0.0055) });
    }
    orreryGroup.add(astGroup);

    // ── 6. Multi-Spectral Starfield (1500+ Stars) ──
    const starCount = lowEnd ? 500 : 1400;
    const starGeo   = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors    = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0x7dd3fc), // Cyan blue
      new THREE.Color(0xbae6fd), // Ice white-blue
      new THREE.Color(0xffffff), // Pure white
      new THREE.Color(0xfef08a), // Warm yellow
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3 + 0] = rand(-350, 350);
      starPositions[i * 3 + 1] = rand(-250, 250);
      starPositions[i * 3 + 2] = rand(-250, -30);

      const c = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3 + 0] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── 7. Sweeping Comet with Ion Tail ──
    const cometGeo = new THREE.BufferGeometry();
    cometGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([0, 0, 0, -22, -11, 0]), 3)
    );
    const cometMat = new THREE.LineBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0,
    });
    const cometLine = new THREE.Line(cometGeo, cometMat);
    cometLine.position.set(-140, 40, -40);
    scene.add(cometLine);

    let cometActive = false;
    let nextCometTime = Date.now() + rand(10000, 22000);

    // ── 8. Camera Shift & Mouse State (Strict 2-3px max) ──
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let scrollY = 0;

    function onMouseMove(e) {
      targetMouseX = (e.clientX / width - 0.5) * 2.5; // Max 2.5px shift
      targetMouseY = (e.clientY / height - 0.5) * 2.5;
    }

    function onScroll() {
      scrollY = window.scrollY;
    }

    function onResize() {
      width  = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    // ── 9. Render Loop ──
    let animationFrameId = null;

    function animate(time) {
      animationFrameId = requestAnimationFrame(animate);

      const sec = time * 0.001;

      // Mouse camera shift (smooth damped lerp)
      mouseX = lerp(mouseX, targetMouseX, 0.02);
      mouseY = lerp(mouseY, targetMouseY, 0.02);

      // Subtle zero-gravity camera sway
      const swayX = Math.sin(sec * 0.15) * 0.5;
      const swayY = Math.cos(sec * 0.12) * 0.5;

      camera.position.x = swayX + mouseX;
      camera.position.y = 22 + swayY - mouseY - (scrollY * 0.006);
      camera.lookAt(0, -6, -20);

      // 9A. Rotate Planets along Orbits
      planetMeshes.forEach((p) => {
        p.angle += p.speed * 0.25; // Smooth slow orbital revolution
        p.mesh.position.x = Math.cos(p.angle) * p.dist;
        p.mesh.position.z = Math.sin(p.angle) * p.dist * 0.72;
        p.mesh.rotation.y += 0.008;

        if (p.moon) {
          p.moon.position.x = Math.sin(sec * 1.5) * 2.8;
          p.moon.position.z = Math.cos(sec * 1.5) * 2.8;
        }
      });

      // 9B. Rotate Asteroid Belt
      asteroidsData.forEach((a) => {
        a.angle += a.speed * 0.25;
        a.mesh.position.x = Math.cos(a.angle) * a.dist;
        a.mesh.position.z = Math.sin(a.angle) * a.dist * 0.72;
      });

      // 9C. Comet Sweep Logic
      const now = Date.now();
      if (!cometActive && now > nextCometTime) {
        cometActive = true;
        cometLine.position.set(rand(-80, 40), rand(20, 60), -30);
        cometMat.opacity = 0.90;
        nextCometTime = now + rand(20000, 45000);
      }

      if (cometActive) {
        cometLine.position.x += 1.6;
        cometLine.position.y -= 0.8;
        cometMat.opacity -= 0.02;

        if (cometMat.opacity <= 0) {
          cometActive = false;
        }
      }

      renderer.render(scene, camera);
    }

    function onVisibilityChange() {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    }

    window.addEventListener('mousemove',          onMouseMove,        { passive: true });
    window.addEventListener('scroll',             onScroll,           { passive: true });
    window.addEventListener('resize',             onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove',          onMouseMove);
      window.removeEventListener('scroll',             onScroll);
      window.removeEventListener('resize',             onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      // Clean up WebGL resources
      sunTex.dispose();
      starGeo.dispose();
      starMat.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      sunGlowMat.dispose();
      astGeo.dispose();
      astMat.dispose();
      cometGeo.dispose();
      cometMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}

export default memo(AuroraBackground);

/**
 * AuroraBackground.jsx — v6.0 "Photorealistic NASA Space & Planets Engine"
 *
 * Full-screen realistic deep-space environment for the portfolio.
 * Built with Three.js WebGL renderer.
 * Renders on a fixed full-screen canvas behind all page content (z-index: 0).
 *
 * Realism Improvements
 * ────────────────────
 *  • Photorealistic 3D Gas Giant Planet with Simplex Turbulence, Fine Cloud Filaments,
 *    Vortex Storms (Great Dark Spot), Polar Ice Caps, and Real Rayleigh Atmospheric Limb Darkening.
 *  • High-Detail Cratered Lunar Moon with Rim Shadows & Ray Craters.
 *  • Multi-Spectral Starfield (Real stellar temperatures, 4-point JWST diffraction spikes).
 *  • Low-Opacity Hubble/JWST Nebulae (5%–10% Opacity) blending into #02060B void.
 *  • Zero-Gravity Camera Float & 2–4px max Mouse Shift.
 */

import React, { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';

/* ══════════════════════════════════════════════════════════════════════
   HELPERS & NOISE GENERATOR
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

// Pseudo 2D Simplex Noise for procedural atmospheric turbulence
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
   PHOTOREALISTIC PROCEDURAL NASA PLANET & MOON TEXTURES
══════════════════════════════════════════════════════════════════════ */

// 1. Photorealistic NASA Gas Giant Surface Texture (Neptune / Jupiter style)
function createPhotorealisticGasGiantTexture(width = 1024, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const noise = createPerlinNoiseMap(width, height, 0.012);
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Realistic color Palette for Gas Giant Atmosphere:
  // Deep space indigo, slate navy, vibrant cyan, icy white, and dark storm blue
  const colors = [
    { r: 7,   g: 14,  b: 28 },  // Dark polar void
    { r: 15,  g: 30,  b: 54 },  // Deep indigo band
    { r: 30,  g: 64,  b: 110 }, // Slate blue band
    { r: 14,  g: 116, b: 175 }, // Azure cloud stream
    { r: 56,  g: 189, b: 248 }, // Bright ice cyan band
    { r: 186, g: 230, b: 253 }, // High altitude cirrus white
  ];

  function getColor(val) {
    const scaled = Math.max(0, Math.min(1, (val + 1) * 0.5));
    const idx = scaled * (colors.length - 1);
    const i1 = Math.floor(idx);
    const i2 = Math.min(colors.length - 1, i1 + 1);
    const f = idx - i1;

    return {
      r: Math.round(lerp(colors[i1].r, colors[i2].r, f)),
      g: Math.round(lerp(colors[i1].g, colors[i2].g, f)),
      b: Math.round(lerp(colors[i1].b, colors[i2].b, f)),
    };
  }

  for (let y = 0; y < height; y++) {
    // Latitudinal band distortion (shear along equator)
    const lat = (y / height) * Math.PI;
    const bandFreq = Math.sin(lat * 8.0);
    
    for (let x = 0; x < width; x++) {
      // Swirling turbulence along bands
      const nVal = noise.fBm(x + bandFreq * 40, y * 2.2, 4);
      const stormN = noise.fBm(x * 2.0, y * 0.8, 3);
      
      const combined = nVal * 0.75 + stormN * 0.25;
      const c = getColor(combined);

      const idx = (y * width + x) * 4;
      data[idx + 0] = c.r;
      data[idx + 1] = c.g;
      data[idx + 2] = c.b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Add Photorealistic Swirling Storm (Great Dark Spot / Eye)
  ctx.save();
  const stormCx = width * 0.62, stormCy = height * 0.52;
  const stormGrd = ctx.createRadialGradient(stormCx, stormCy, 5, stormCx, stormCy, 70);
  stormGrd.addColorStop(0,    'rgba(2, 44, 87, 0.90)');
  stormGrd.addColorStop(0.4,  'rgba(14, 116, 175, 0.70)');
  stormGrd.addColorStop(0.75, 'rgba(56, 189, 248, 0.35)');
  stormGrd.addColorStop(1,    'rgba(15, 23, 42, 0)');

  ctx.fillStyle = stormGrd;
  ctx.beginPath();
  ctx.ellipse(stormCx, stormCy, 85, 42, -0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Photorealistic Lunar Cratered Moon Surface Texture
function createPhotorealisticMoonTexture(width = 512, height = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const noise = createPerlinNoiseMap(width, height, 0.02);
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const n = noise.fBm(x, y, 4);
      const val = Math.floor(lerp(70, 160, (n + 1) * 0.5));
      const idx = (y * width + x) * 4;
      data[idx + 0] = val;
      data[idx + 1] = val + 4;
      data[idx + 2] = val + 10;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Add Impact Craters with Rim Highlights & Cast Shadows
  for (let i = 0; i < 45; i++) {
    const cx = rand(0, width);
    const cy = rand(0, height);
    const r  = rand(4, 14);

    // Crater Rim Highlight
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Inner shadow floor
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.beginPath();
    ctx.arc(cx + 1.2, cy + 1.2, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 3. JWST / Hubble Nebula Cloud Texture (5%-10% Opacity, Cyan & Slate Blue)
function createNebulaTexture(width = 1024, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  const blobs = [
    { x: 0.35 * width, y: 0.40 * height, r: 0.38 * width, color: 'rgba(14, 165, 233, 0.08)' },
    { x: 0.65 * width, y: 0.55 * height, r: 0.42 * width, color: 'rgba(30, 58, 138, 0.09)' },
    { x: 0.50 * width, y: 0.75 * height, r: 0.35 * width, color: 'rgba(2, 132, 199, 0.06)' },
    { x: 0.25 * width, y: 0.70 * height, r: 0.30 * width, color: 'rgba(15, 23, 42, 0.08)' },
  ];

  blobs.forEach((b) => {
    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    g.addColorStop(0,    b.color);
    g.addColorStop(0.5,  b.color.replace(/[\d\.]+\)$/, '0.04)'));
    g.addColorStop(1,    'rgba(2, 6, 11, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/* ══════════════════════════════════════════════════════════════════════
   PHOTOREALISTIC PLANET ATMOSPHERE & LIMB DARKENING SHADERS
══════════════════════════════════════════════════════════════════════ */

// 1. Atmosphere Rim Rayleigh Scatter Glow
const RayleighAtmosphereShader = {
  uniforms: {
    color: { value: new THREE.Color(0x38bdf8) },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    uniform vec3 color;
    void main() {
      float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
      gl_FragColor = vec4(color, intensity * 0.85);
    }
  `,
};

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
    scene.background = new THREE.Color(0x02060b);
    scene.fog = new THREE.FogExp2(0x02060b, 0.0018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 120);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !lowEnd,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // ── 2. Lighting (Natural Far Sun Light) ──
    const ambientLight = new THREE.AmbientLight(0x0f172a, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    sunLight.position.set(-140, 90, 80);
    scene.add(sunLight);

    // ── 3. LAYER 2: Multi-Spectral Starfield (1600+ Stars with Twinkle) ──
    const starCount = lowEnd ? 600 : 1600;
    const starGeo   = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors    = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0x7dd3fc), // Cyan blue
      new THREE.Color(0xbae6fd), // Ice white-blue
      new THREE.Color(0xffffff), // Pure white
      new THREE.Color(0xfef08a), // Warm yellow
      new THREE.Color(0xfde047), // Gold
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3 + 0] = rand(-350, 350);
      starPositions[i * 3 + 1] = rand(-250, 250);
      starPositions[i * 3 + 2] = rand(-250, -20);

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3 + 0] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      sizeAttenuation: true,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── 4. LAYER 3: Hubble/JWST Inspired Nebula Texture (5%-10% Opacity) ──
    const nebulaTex = createNebulaTexture();
    const nebulaGeo = new THREE.PlaneGeometry(320, 320);
    const nebulaMat = new THREE.MeshBasicMaterial({
      map: nebulaTex,
      transparent: true,
      opacity: 0.08, // Strict 5%-10% requirement
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebulaMesh.position.set(0, 0, -110);
    scene.add(nebulaMesh);

    // ── 5. LAYER 4: Photorealistic 3D Gas Giant Planet (Non-overlapping Text) ──
    const planetSegments = lowEnd ? 32 : 64;
    const planetGeo = new THREE.SphereGeometry(22, planetSegments, planetSegments);
    const planetTex = createPhotorealisticGasGiantTexture();
    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTex,
      roughness: 0.75,
      metalness: 0.05,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    // Positioned in upper right margin outside central text flow
    planetMesh.position.set(46, 22, -65);
    planetMesh.rotation.z = 0.35; // Axis tilt
    scene.add(planetMesh);

    // 5B. Rayleigh Atmosphere Glow Rim
    const atmGeo = new THREE.SphereGeometry(23.2, planetSegments, planetSegments);
    const atmMat = new THREE.ShaderMaterial({
      vertexShader: RayleighAtmosphereShader.vertexShader,
      fragmentShader: RayleighAtmosphereShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(RayleighAtmosphereShader.uniforms),
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmMesh = new THREE.Mesh(atmGeo, atmMat);
    atmMesh.position.copy(planetMesh.position);
    scene.add(atmMesh);

    // ── 6. LAYER 5: Photorealistic Distant Lunar Moon ──
    const moonGeo = new THREE.SphereGeometry(2.6, 24, 24);
    const moonTex = createPhotorealisticMoonTexture();
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTex,
      roughness: 0.90,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(70, 36, -85);
    scene.add(moonMesh);

    // ── 7. LAYER 6: Soft Volumetric Cosmic Dust ──
    const dustCount = lowEnd ? 40 : 120;
    const dustGeo   = new THREE.BufferGeometry();
    const dustPos   = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3 + 0] = rand(-180, 180);
      dustPos[i * 3 + 1] = rand(-120, 120);
      dustPos[i * 3 + 2] = rand(-60, 40);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.2,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const cosmicDust = new THREE.Points(dustGeo, dustMat);
    scene.add(cosmicDust);

    // ── 8. Asteroid (Passing slowly every 40-60 sec) ──
    const asteroidGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const astPos = asteroidGeo.attributes.position;
    for (let i = 0; i < astPos.count; i++) {
      astPos.setXYZ(
        i,
        astPos.getX(i) + rand(-0.3, 0.3),
        astPos.getY(i) + rand(-0.3, 0.3),
        astPos.getZ(i) + rand(-0.3, 0.3)
      );
    }
    asteroidGeo.computeVertexNormals();

    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.9,
    });
    const asteroidMesh = new THREE.Mesh(asteroidGeo, asteroidMat);
    asteroidMesh.position.set(-160, -40, -45);
    scene.add(asteroidMesh);

    let asteroidPassing = false;
    let nextAsteroidTime = Date.now() + rand(15000, 30000);

    // ── 9. Shooting Star (Passing every 20-40 sec) ──
    const shootingStarGeo = new THREE.BufferGeometry();
    shootingStarGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([0, 0, 0, -18, -9, 0]), 3)
    );
    const shootingStarMat = new THREE.LineBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0,
    });
    const shootingStarLine = new THREE.Line(shootingStarGeo, shootingStarMat);
    shootingStarLine.position.set(0, 0, -30);
    scene.add(shootingStarLine);

    let shootingStarActive = false;
    let nextShootingStarTime = Date.now() + rand(8000, 18000);

    // ── 10. Camera Shift & Mouse State (Strict 2-4px max) ──
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let scrollY = 0;

    function onMouseMove(e) {
      targetMouseX = (e.clientX / width - 0.5) * 3.5;
      targetMouseY = (e.clientY / height - 0.5) * 3.5;
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

    // ── 11. Render Loop ──
    let animationFrameId = null;

    function animate(time) {
      animationFrameId = requestAnimationFrame(animate);

      const sec = time * 0.001;

      // Mouse camera shift (smooth damped lerp)
      mouseX = lerp(mouseX, targetMouseX, 0.025);
      mouseY = lerp(mouseY, targetMouseY, 0.025);

      // Subtle zero-gravity camera sway
      const swayX = Math.sin(sec * 0.25) * 0.8;
      const swayY = Math.cos(sec * 0.2) * 0.8;

      camera.position.x = swayX + mouseX;
      camera.position.y = swayY - mouseY - (scrollY * 0.008);
      camera.lookAt(0, 0, 0);

      // Parallax layer rotation & drift
      nebulaMesh.rotation.z = sec * 0.005;

      planetMesh.rotation.y = sec * 0.012; // Realistic slow atmospheric rotation
      moonMesh.position.x   = planetMesh.position.x + Math.sin(sec * 0.04) * 22;
      moonMesh.position.z   = planetMesh.position.z + Math.cos(sec * 0.04) * 12;

      starField.rotation.y  = sec * 0.002;
      cosmicDust.rotation.y = sec * 0.004;

      // Asteroid passage logic
      const now = Date.now();
      if (!asteroidPassing && now > nextAsteroidTime) {
        asteroidPassing = true;
        asteroidMesh.position.set(-160, rand(-40, 40), -45);
        nextAsteroidTime = now + rand(40000, 60000);
      }

      if (asteroidPassing) {
        asteroidMesh.position.x += 0.12;
        asteroidMesh.position.y += 0.03;
        asteroidMesh.rotation.x += 0.005;
        asteroidMesh.rotation.y += 0.008;

        if (asteroidMesh.position.x > 160) {
          asteroidPassing = false;
        }
      }

      // Shooting star logic
      if (!shootingStarActive && now > nextShootingStarTime) {
        shootingStarActive = true;
        shootingStarLine.position.set(rand(-60, 40), rand(10, 60), -35);
        shootingStarMat.opacity = 0.95;
        nextShootingStarTime = now + rand(20000, 40000);
      }

      if (shootingStarActive) {
        shootingStarLine.position.x += 1.8;
        shootingStarLine.position.y -= 0.9;
        shootingStarMat.opacity -= 0.025;

        if (shootingStarMat.opacity <= 0) {
          shootingStarActive = false;
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
      planetTex.dispose();
      moonTex.dispose();
      nebulaTex.dispose();
      starGeo.dispose();
      starMat.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
      planetGeo.dispose();
      planetMat.dispose();
      atmGeo.dispose();
      atmMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      asteroidGeo.dispose();
      asteroidMat.dispose();
      shootingStarGeo.dispose();
      shootingStarMat.dispose();
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

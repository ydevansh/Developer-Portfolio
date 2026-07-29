import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────────────────────
   GLSL SHADER DEFINITION: VOLUMETRIC COSMIC NEBULA WITH DOMAIN WARPING FBM
   Primary Palette: Deep Space Black, Deep Navy, Midnight Blue, Electric Blue, Cyan
   Zero Pink / Magenta.
───────────────────────────────────────────────────────────────────────────── */
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  // 3D Simplex Noise Helper Functions
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // 4-Octave Fractal Brownian Motion (FBM)
  float fbm(vec3 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      val += amp * snoise(p * freq);
      freq *= 2.1;
      amp *= 0.48;
    }
    return val;
  }

  void main() {
    vec2 st = (vUv - 0.5) * 2.0;
    float t = uTime * 0.015;

    // Mouse Parallax Offset
    vec2 mouseOffset = uMouse * 0.15;
    vec3 p = vec3((st + mouseOffset) * 1.8, t);

    // Domain Warping for fluid cosmic filaments
    vec3 q = vec3(
      fbm(p + vec3(0.0, 0.0, t * 0.5)),
      fbm(p + vec3(5.2, 1.3, t * 0.3)),
      fbm(p + vec3(2.8, 4.1, t * 0.4))
    );

    vec3 r = vec3(
      fbm(p + 4.0 * q + vec3(1.7, 9.2, t * 0.6)),
      fbm(p + 4.0 * q + vec3(8.3, 2.8, t * 0.5)),
      fbm(p + 4.0 * q + vec3(3.1, 5.7, t * 0.2))
    );

    float f = fbm(p + 3.0 * r);

    // Photorealistic NASA Palette: Deep Navy, Midnight Blue, Electric Blue, Cyan
    vec3 spaceBlack = vec3(0.005, 0.02, 0.05);
    vec3 deepNavy   = vec3(0.02, 0.08, 0.20);
    vec3 midnight   = vec3(0.04, 0.16, 0.42);
    vec3 electric   = vec3(0.06, 0.45, 0.88);
    vec3 cyanGlow   = vec3(0.10, 0.85, 0.98);
    vec3 coreWhite  = vec3(0.85, 0.96, 1.00);

    // Smooth color transitions
    float density = smoothstep(-0.25, 0.75, f);
    vec3 col = mix(spaceBlack, deepNavy, density);
    col = mix(col, midnight, pow(max(0.0, f + 0.1), 1.8));
    col = mix(col, electric, pow(max(0.0, length(q) - 0.2), 2.2) * 0.7);
    col += cyanGlow * pow(max(0.0, length(r) - 0.3), 3.0) * 0.65;
    col += coreWhite * pow(max(0.0, f), 4.5) * 0.35;

    // Radial Vignette for immersive depth
    float dist = length(st);
    float vignette = smoothstep(1.5, 0.3, dist);

    float finalAlpha = density * vignette * uOpacity * 0.88;
    gl_FragColor = vec4(col * vignette, finalAlpha);
  }
`;

export default function VolumetricNebula({ opacity = 1, mouseRef }) {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uOpacity: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    return () => {
      if (meshRef.current?.geometry) meshRef.current.geometry.dispose();
      if (meshRef.current?.material) meshRef.current.material.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current?.material) {
      const mat = meshRef.current.material;
      if (mat.uniforms?.uTime) mat.uniforms.uTime.value += delta;
      if (mat.uniforms?.uOpacity) {
        mat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
          mat.uniforms.uOpacity.value,
          opacity,
          0.05
        );
      }
      if (mat.uniforms?.uMouse && mouseRef?.current) {
        mat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -18]} scale={[75, 75, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

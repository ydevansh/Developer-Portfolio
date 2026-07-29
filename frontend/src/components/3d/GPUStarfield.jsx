import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vPhase;
  uniform float uTime;
  uniform float uOpacity;

  void main() {
    vColor = aColor;
    vPhase = aPhase;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Twinkle calculation
    float twinkle = 0.75 + 0.25 * sin(uTime * 2.5 + aPhase);
    gl_PointSize = aSize * twinkle * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vPhase;

  void main() {
    // Circular point shape with soft glowing radial falloff
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float glow = smoothstep(0.5, 0.0, dist);
    float core = smoothstep(0.2, 0.0, dist);

    vec3 finalColor = mix(vColor, vec3(1.0), core * 0.7);
    float alpha = (glow * 0.85 + core * 0.4) * uOpacity;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default function GPUStarfield({ opacity = 1, isCollapsing = false, isMobile = false }) {
  const pointsRef = useRef();
  const count = isMobile ? 1600 : 4000;
  const speedFactorRef = useRef(1.0);
  const timeRef = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);

    const colorPalette = [
      new THREE.Color('#ffffff'), // Pure White
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#dbeafe'), // Ice Blue
      new THREE.Color('#7dd3fc'), // Sky Blue
      new THREE.Color('#38bdf8'), // Vibrant Blue
      new THREE.Color('#22d3ee'), // Cyan Highlight
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 140;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 140;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 10;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      const rand = Math.random();
      sz[i] = rand > 0.95 ? (Math.random() * 2.2 + 1.8) : (Math.random() * 1.0 + 0.4);
      ph[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));

    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    return () => {
      if (geometry) geometry.dispose();
      if (pointsRef.current?.material) pointsRef.current.material.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    if (pointsRef.current?.material) {
      const targetSpeedFactor = isCollapsing ? 0.2 : 1.0;
      speedFactorRef.current = THREE.MathUtils.lerp(speedFactorRef.current, targetSpeedFactor, 0.05);
      timeRef.current += delta * speedFactorRef.current;

      const mat = pointsRef.current.material;
      if (mat.uniforms?.uTime) mat.uniforms.uTime.value = timeRef.current;
      if (mat.uniforms?.uOpacity) {
        mat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
          mat.uniforms.uOpacity.value,
          opacity,
          0.04
        );
      }

      pointsRef.current.rotation.y = timeRef.current * 0.012;
      pointsRef.current.rotation.x = timeRef.current * 0.006;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

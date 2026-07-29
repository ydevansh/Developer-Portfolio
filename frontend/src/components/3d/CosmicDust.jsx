import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CosmicDust({ opacity = 1, isMobile = false }) {
  const dustRef = useRef();

  const count = isMobile ? 120 : 300;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 + 5;
    }
    return [pos];
  }, [count]);

  useEffect(() => {
    return () => {
      if (dustRef.current?.geometry) dustRef.current.geometry.dispose();
      if (dustRef.current?.material) dustRef.current.material.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    if (dustRef.current) {
      dustRef.current.rotation.y = -state.clock.getElapsedTime() * 0.015;
      dustRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.05;
      if (dustRef.current.material) {
        dustRef.current.material.opacity = THREE.MathUtils.lerp(
          dustRef.current.material.opacity,
          opacity * 0.55,
          0.04
        );
      }
    }
  });

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        color="#38bdf8"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

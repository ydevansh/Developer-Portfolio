import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleHalo({ opacity = 1, isCollapsing = false, isMobile = false }) {
  const pointsRef = useRef();
  const radiusRef = useRef(4.5);

  const count = isMobile ? 90 : 180;

  const [positions, initialAngles, radiiOffsets, speed] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const rOffsets = new Float32Array(count);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const rOffset = (Math.random() - 0.5) * 0.45;
      const r = 4.5 + rOffset;

      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;

      angles[i]   = angle;
      rOffsets[i] = rOffset;
      spd[i]      = (Math.random() * 0.3 + 0.8) * (Math.random() < 0.5 ? 1 : -1);
    }
    return [pos, angles, rOffsets, spd];
  }, [count]);

  useEffect(() => {
    return () => {
      if (pointsRef.current?.geometry) pointsRef.current.geometry.dispose();
      if (pointsRef.current?.material) pointsRef.current.material.dispose();
    };
  }, []);

  const speedFactorRef = useRef(1.0);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Smoothly slow down rotation speed during final transition
    const targetSpeedFactor = isCollapsing ? 0.2 : 1.0;
    speedFactorRef.current = THREE.MathUtils.lerp(speedFactorRef.current, targetSpeedFactor, 0.05);
    timeRef.current += delta * speedFactorRef.current;

    // Target radius collapse when collapsing
    const targetRadius = isCollapsing ? 0.05 : 4.5;
    radiusRef.current = THREE.MathUtils.lerp(radiusRef.current, targetRadius, isCollapsing ? 0.12 : 0.04);

    const positionsArr = pointsRef.current.geometry.attributes.position.array;
    const time = timeRef.current;

    for (let i = 0; i < count; i++) {
      const currentAngle = initialAngles[i] + time * 0.35 * speed[i];
      const r = radiusRef.current + radiiOffsets[i] * (radiusRef.current / 4.5);

      positionsArr[i * 3]     = Math.cos(currentAngle) * r;
      positionsArr[i * 3 + 1] = Math.sin(currentAngle) * r;
      positionsArr[i * 3 + 2] = Math.sin(time * 2.0 + initialAngles[i]) * 0.25 * (radiusRef.current / 4.5);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    if (pointsRef.current.material) {
      const targetOpacity = isCollapsing ? 0 : opacity * 0.85;
      pointsRef.current.material.opacity = THREE.MathUtils.lerp(
        pointsRef.current.material.opacity,
        targetOpacity,
        0.1
      );
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.32 : 0.42}
        color="#22d3ee"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

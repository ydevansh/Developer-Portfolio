import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DistantGalaxy({ opacity = 1, isMobile = false }) {
  const galaxyRef = useRef();
  const count = isMobile ? 800 : 2000;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const arms = 2;
    const radius = 12;
    const spin = 1.2;

    const coreColor = new THREE.Color('#e0f7ff');
    const innerColor = new THREE.Color('#38bdf8');
    const outerColor = new THREE.Color('#0369a1');

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 2.5) * radius;
      const armAngle = ((i % arms) / arms) * Math.PI * 2;
      const spinAngle = r * spin;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * r;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * r;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;

      const x = Math.cos(armAngle + spinAngle) * r + randomX;
      const y = Math.sin(armAngle + spinAngle) * r + randomY;
      const z = randomZ;

      pos[i * 3]     = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const mixRatio = r / radius;
      const mixedColor = coreColor.clone().lerp(
        mixRatio < 0.4 ? innerColor : outerColor,
        mixRatio
      );

      col[i * 3]     = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    return geo;
  }, [count]);

  useEffect(() => {
    return () => {
      if (geometry) geometry.dispose();
      if (galaxyRef.current?.material) galaxyRef.current.material.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.z += delta * 0.03;
      if (galaxyRef.current.material) {
        galaxyRef.current.material.opacity = THREE.MathUtils.lerp(
          galaxyRef.current.material.opacity,
          opacity * 0.75,
          0.04
        );
      }
    }
  });

  return (
    <group position={[-18, 10, -32]} rotation={[0.6, -0.4, 0.5]}>
      <points ref={galaxyRef} geometry={geometry}>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

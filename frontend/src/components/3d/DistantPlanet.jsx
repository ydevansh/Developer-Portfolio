import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FresnelAtmosphereShader = {
  uniforms: {
    uTime: { value: 0 },
    color: { value: new THREE.Color('#38bdf8') },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 color;

    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 3.0);
      gl_FragColor = vec4(color, fresnel * 0.7);
    }
  `
};

export default function DistantPlanet({ opacity = 1 }) {
  const planetRef = useRef();
  const atmosphereRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      color: { value: new THREE.Color('#38bdf8') },
    }),
    []
  );

  useEffect(() => {
    return () => {
      if (planetRef.current?.geometry) planetRef.current.geometry.dispose();
      if (planetRef.current?.material) planetRef.current.material.dispose();
      if (atmosphereRef.current?.geometry) atmosphereRef.current.geometry.dispose();
      if (atmosphereRef.current?.material) atmosphereRef.current.material.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.04;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group position={[19, 11, -26]} scale={[1, 1, 1]}>
      {/* Dark Oceanic Gas Planet Body */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshStandardMaterial
          color="#031f4b"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Cyan Fresnel Atmosphere Rim */}
      <mesh ref={atmosphereRef} scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <shaderMaterial
          vertexShader={FresnelAtmosphereShader.vertexShader}
          fragmentShader={FresnelAtmosphereShader.fragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

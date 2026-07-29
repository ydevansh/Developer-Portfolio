import { useRef, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import VolumetricNebula from './VolumetricNebula';
import GPUStarfield from './GPUStarfield';
import DistantGalaxy from './DistantGalaxy';
import DistantPlanet from './DistantPlanet';
import CosmicDust from './CosmicDust';
import ParticleHalo from './ParticleHalo';
import PostProcessingBloom from './PostProcessingBloom';

/* ─────────────────────────────────────────────────────────────────────────────
   CANVAS ERROR BOUNDARY (Guarantees HUD never crashes)
───────────────────────────────────────────────────────────────────────────── */
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Galaxy Canvas error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback deep space dark background if WebGL fails
      return <div className="absolute inset-0 bg-[#01050e] pointer-events-none" />;
    }
    return this.props.children;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   CAMERA RIG: SMOOTH DRIFT & MOUSE PARALLAX
───────────────────────────────────────────────────────────────────────────── */
function CameraController({ mouseRef }) {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const targetX = (mouseRef.current?.x || 0) * 2.8;
    const targetY = -(mouseRef.current?.y || 0) * 2.8;

    const driftX = Math.sin(t * 0.12) * 0.6;
    const driftY = Math.cos(t * 0.09) * 0.4;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX + driftX, 0.035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY + driftY, 0.035);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function isWebGLSupported() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export default function GalaxyCanvas({
  starOpacity = 1,
  nebulaOpacity = 1,
  galaxyOpacity = 1,
  isCollapsing = false,
  isMobile = false,
}) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const hasWebGL = isWebGLSupported();

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!hasWebGL) {
    return <div className="absolute inset-0 bg-[#01050e] pointer-events-none z-0" />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 24], fov: 60, near: 0.1, far: 1000 }}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            try {
              if (gl && 'outputColorSpace' in gl) {
                gl.outputColorSpace = THREE.SRGBColorSpace;
              }
            } catch (e) {
              console.warn('WebGL setup warning:', e);
            }
          }}
          dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isMobile ? 1.25 : 1.75)}
        >
          <CameraController mouseRef={mouseRef} />

          <ambientLight intensity={0.15} color="#0c2d6b" />
          <directionalLight position={[20, 15, 10]} intensity={1.2} color="#00e5ff" />

          <VolumetricNebula opacity={nebulaOpacity} mouseRef={mouseRef} />
          <GPUStarfield opacity={starOpacity} isCollapsing={isCollapsing} isMobile={isMobile} />
          <DistantGalaxy opacity={galaxyOpacity} isMobile={isMobile} />
          <DistantPlanet opacity={galaxyOpacity} />
          <CosmicDust opacity={starOpacity} isMobile={isMobile} />
          <ParticleHalo opacity={galaxyOpacity} isCollapsing={isCollapsing} isMobile={isMobile} />

          <PostProcessingBloom />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

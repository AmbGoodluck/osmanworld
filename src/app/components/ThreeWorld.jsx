"use client";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';

const TAB_CAMERAS = {
  about: { position: [0, 0, 10], lookAt: [0, 0, 0] },
  academics: { position: [10, 0, 0], lookAt: [0, 0, 0] },
  fashion: { position: [0, 10, 0], lookAt: [0, 0, 0] },
  tech: { position: [0, 0, -10], lookAt: [0, 0, 0] },
  entrepreneurship: { position: [-10, 0, 0], lookAt: [0, 0, 0] },
};

function CameraRig() {
  const { camera } = useThree();
  const pathname = usePathname();
  useEffect(() => {
    let tab = pathname.replace('/', '');
    if (!TAB_CAMERAS[tab]) tab = 'about';
    const { position, lookAt } = TAB_CAMERAS[tab];
    gsap.to(camera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(...lookAt),
    });
  }, [pathname, camera]);
  return null;
}

function RimLights() {
  return (
    <>
      {/* Crimson rim light */}
      <pointLight position={[0, 5, 10]} intensity={1.2} color="#8B0000" distance={20} />
      {/* Blue rim light */}
      <pointLight position={[-10, 5, -10]} intensity={1.1} color="#1A3A8F" distance={20} />
    </>
  );
}

function WorldContent() {
  // Example: scattered cubes, can be extended for each tab
  const cubes = [
    { color: '#1A3A8F', position: [-4, 2, -3], scale: [1.3, 1.1, 1.2], rotationSpeed: [0.008, -0.012] },
    { color: '#9CA3AF', position: [3, -2, 2], scale: [1, 1.2, 1], rotationSpeed: [-0.01, 0.007] },
    { color: '#8B0000', position: [0, 3, -4], scale: [0.9, 0.8, 1.1], rotationSpeed: [0.012, -0.01] },
    { color: '#9CA3AF', position: [-3.5, -2.5, 3], scale: [0.7, 0.9, 0.7], rotationSpeed: [0.009, 0.013] },
    { color: '#8B0000', position: [2.5, 2.5, -2], scale: [0.6, 0.6, 0.8], rotationSpeed: [-0.011, 0.009] },
    { color: '#1A3A8F', position: [0, -3.5, 4], scale: [1.1, 0.7, 1.2], rotationSpeed: [0.013, -0.008] },
    { color: '#9CA3AF', position: [-2.5, 3, 2.5], scale: [0.8, 1, 0.8], rotationSpeed: [0.007, -0.012] },
    { color: '#8B0000', position: [4, 0, -3.5], scale: [1, 0.7, 1], rotationSpeed: [-0.012, 0.011] },
  ];
  return cubes.map((cube, i) => <AnimatedCube key={i} {...cube} />);
}

function AnimatedCube({ color, position, scale, rotationSpeed }) {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.x += rotationSpeed[0];
    ref.current.rotation.y += rotationSpeed[1];
  });
  return (
    <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={new THREE.Color(color)} roughness={0.35} metalness={0.6} />
    </mesh>
  );
}

export default function ThreeWorld() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} shadows>
        <color attach="background" args={["#101624"]} />
        <ambientLight intensity={0.5} />
        <RimLights />
        <WorldContent />
        <CameraRig />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

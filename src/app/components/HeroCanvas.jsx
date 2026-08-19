"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingShape({ position, geometry, color, rotSpeeds, floatAmp, floatSpeed, scale = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x += rotSpeeds[0];
    ref.current.rotation.y += rotSpeeds[1];
    ref.current.rotation.z += rotSpeeds[2];
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={new THREE.Color(color)}
        roughness={0.25}
        metalness={0.7}
        emissive={new THREE.Color(color)}
        emissiveIntensity={0.25}
        transparent
        opacity={0.85}
        wireframe={false}
      />
    </mesh>
  );
}

function WireShape({ position, geometry, color, rotSpeeds, floatAmp, floatSpeed }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x += rotSpeeds[0];
    ref.current.rotation.y += rotSpeeds[1];
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed + 1) * floatAmp;
  });
  return (
    <mesh ref={ref} position={position}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color={new THREE.Color(color)} wireframe opacity={0.45} transparent />
    </mesh>
  );
}

function FloatingTorus({ position, color, rotSpeeds, floatSpeed, floatAmp }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x += rotSpeeds[0];
    ref.current.rotation.y += rotSpeeds[1];
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.55, 0.065, 16, 80]} />
      <meshStandardMaterial color={new THREE.Color(color)} roughness={0.15} metalness={0.85}
        emissive={new THREE.Color(color)} emissiveIntensity={0.3} />
    </mesh>
  );
}

const icoGeo   = new THREE.IcosahedronGeometry(0.7, 0);
const octGeo   = new THREE.OctahedronGeometry(0.6, 0);
const icoGeo2  = new THREE.IcosahedronGeometry(0.45, 1);
const octGeo2  = new THREE.OctahedronGeometry(0.38, 0);

export default function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 5, 4]}   intensity={2.2} color="#87CEEB" distance={18} />
      <pointLight position={[-4, -3, 3]} intensity={1.8} color="#8B0000" distance={16} />
      <pointLight position={[0, 3, -4]}  intensity={1.4} color="#1A3A8F" distance={14} />

      {/* Solid shapes */}
      <FloatingShape geometry={icoGeo}  position={[2.4,  0.5, 0]}  color="#87CEEB" scale={1}
        rotSpeeds={[0.005, 0.008, 0.003]} floatAmp={0.3}  floatSpeed={1.1} />
      <FloatingShape geometry={octGeo}  position={[-2.2, -0.4, 0.5]} color="#8B0000" scale={1}
        rotSpeeds={[0.007, 0.005, 0.006]} floatAmp={0.25} floatSpeed={0.9} />
      <FloatingShape geometry={octGeo2} position={[1.2,  1.8, -1]}  color="#9CA3AF" scale={1}
        rotSpeeds={[0.009, 0.006, 0.004]} floatAmp={0.35} floatSpeed={1.3} />

      {/* Wireframe accent */}
      <WireShape geometry={icoGeo2} position={[-1.6, 1.2, 0.5]} color="#1A3A8F"
        rotSpeeds={[0.006, 0.009, 0.004]} floatAmp={0.28} floatSpeed={1.05} />

      {/* Tori */}
      <FloatingTorus position={[3.0, -1.0, -0.5]} color="#87CEEB"
        rotSpeeds={[0.008, 0.006, 0.003]} floatSpeed={1.2} floatAmp={0.22} />
      <FloatingTorus position={[-2.8, 1.4, -0.8]} color="#8B0000"
        rotSpeeds={[0.005, 0.009, 0.005]} floatSpeed={0.85} floatAmp={0.3} />
    </Canvas>
  );
}

"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { OrbitControls, Edges } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = {
  blue:      '#1A3A8F',
  lightBlue: '#87CEEB',
  crimson:   '#8B0000',
  gray:      '#9CA3AF',
  white:     '#FFFFFF',
};

// Dual wireframe icosahedra — central knowledge orb
function KnowledgeOrb({ mouse }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const coreRef  = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    outerRef.current.rotation.y =  t * 0.10;
    outerRef.current.rotation.x =  t * 0.06;
    innerRef.current.rotation.y = -t * 0.18;
    innerRef.current.rotation.x =  t * 0.09;
    coreRef.current.rotation.y  =  t * 0.35;
    coreRef.current.rotation.z  =  t * 0.20;
    const px = (mouse.current[0] || 0) * 0.28;
    const py = 0.4 + (mouse.current[1] || 0) * 0.18;
    outerRef.current.position.set(px, py, -1.2);
    innerRef.current.position.set(px, py, -1.2);
    coreRef.current.position.set(px, py, -1.2);
  });

  return (
    <>
      <mesh ref={outerRef} position={[0, 0.4, -1.2]}>
        <icosahedronGeometry args={[2.0, 1]} />
        <meshStandardMaterial color={COLORS.blue} wireframe transparent opacity={0.28}
          emissive={new THREE.Color(COLORS.blue)} emissiveIntensity={0.28} />
      </mesh>
      <mesh ref={innerRef} position={[0, 0.4, -1.2]}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshStandardMaterial color={COLORS.lightBlue} wireframe transparent opacity={0.18}
          emissive={new THREE.Color(COLORS.lightBlue)} emissiveIntensity={0.22} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0.4, -1.2]}>
        <octahedronGeometry args={[0.30, 0]} />
        <meshStandardMaterial color={COLORS.lightBlue} roughness={0.1} metalness={0.9}
          emissive={new THREE.Color(COLORS.lightBlue)} emissiveIntensity={0.65} />
      </mesh>
    </>
  );
}

// Wireframe cube
function KnowledgeCube({ position, size, color, rotSpeed, floatSpeed, floatAmp, mouse, parallaxStrength }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x += rotSpeed[0];
    ref.current.rotation.y += rotSpeed[1];
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    ref.current.position.x = position[0] + (mouse.current[0] || 0) * parallaxStrength;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={new THREE.Color(color)} roughness={0.2} metalness={0.65} transparent opacity={0.12} />
      <Edges color={color} />
    </mesh>
  );
}

// Floating book
function FloatingBook({ position, bodyColor, spineColor, rotation, floatSpeed, floatAmp, mouse, parallaxStrength }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed + position[0]) * floatAmp;
    ref.current.position.x = position[0] + (mouse.current[0] || 0) * parallaxStrength;
    ref.current.rotation.y += 0.0025;
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.62, 0.88, 0.11]} />
        <meshStandardMaterial color={new THREE.Color(bodyColor)} roughness={0.45} metalness={0.35} />
      </mesh>
      <mesh position={[-0.29, 0, 0.001]}>
        <boxGeometry args={[0.05, 0.88, 0.115]} />
        <meshStandardMaterial color={new THREE.Color(spineColor)} roughness={0.3} metalness={0.5}
          emissive={new THREE.Color(spineColor)} emissiveIntensity={0.22} />
      </mesh>
    </group>
  );
}

function Scene({ mouse }) {
  // 1 orb + 3 cubes + 3 books = 7
  const cubes = [
    { position: [-4.2, -1.0, -0.8], size: [1.2, 1.2, 1.2], color: COLORS.blue,      rotSpeed: [0.003, 0.005], floatSpeed: 0.8,  floatAmp: 0.18, parallaxStrength: 0.35 },
    { position: [ 3.8,  1.0, -0.6], size: [1.0, 1.5, 1.0], color: COLORS.lightBlue, rotSpeed: [0.004, 0.006], floatSpeed: 1.0,  floatAmp: 0.2,  parallaxStrength: 0.38 },
    { position: [-1.5,  2.6,  0.5], size: [0.75,0.75,0.75],color: COLORS.crimson,   rotSpeed: [0.005, 0.004], floatSpeed: 1.2,  floatAmp: 0.24, parallaxStrength: 0.55 },
  ];

  const books = [
    { position: [-3.6,  1.2,  0.8], bodyColor: '#0d1e4a', spineColor: COLORS.lightBlue, rotation: [ 0.1, -0.3,  0.05], floatSpeed: 0.88, floatAmp: 0.22, parallaxStrength: 0.42 },
    { position: [ 3.2, -1.4,  0.6], bodyColor: '#111d3d', spineColor: COLORS.crimson,   rotation: [-0.05, 0.4, -0.1 ], floatSpeed: 1.05, floatAmp: 0.28, parallaxStrength: 0.50 },
    { position: [ 1.0,  0.6,  1.6], bodyColor: '#0e1f4e', spineColor: COLORS.gray,      rotation: [ 0.08,-0.2,  0.12], floatSpeed: 0.75, floatAmp: 0.3,  parallaxStrength: 0.65 },
  ];

  return (
    <>
      <ambientLight intensity={0.16} />
      <directionalLight position={[5, 10, 6]} intensity={1.6} castShadow color="#ffffff" />
      <pointLight position={[-7, 5,  4]}  intensity={2.2} color={COLORS.blue}      distance={24} />
      <pointLight position={[ 7, 4, -4]}  intensity={1.8} color={COLORS.lightBlue} distance={22} />
      <pointLight position={[ 0, -4,  5]} intensity={0.9} color={COLORS.crimson}   distance={14} />
      <KnowledgeOrb mouse={mouse} />
      {cubes.map((c, i) => <KnowledgeCube key={i} {...c} mouse={mouse} />)}
      {books.map((b, i) => <FloatingBook  key={i} {...b} mouse={mouse} />)}
    </>
  );
}

export default function AcademicsTab() {
  const mouse = useRef([0, 0]);
  const [size, setSize] = useState([1200, 800]);

  useEffect(() => {
    setSize([window.innerWidth, window.innerHeight]);
    function handleResize() { setSize([window.innerWidth, window.innerHeight]); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handlePointerMove(e) {
    mouse.current = [(e.clientX / size[0]) * 2 - 1, -((e.clientY / size[1]) * 2 - 1)];
  }

  return (
    <div style={{ width: '100%', height: '72vh', borderRadius: '1rem', overflow: 'hidden' }} onPointerMove={handlePointerMove}>
      <Canvas camera={{ position: [0, 0.5, 10], fov: 58 }} shadows gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#101624']} />
        <fog attach="fog" args={['#101624', 20, 34]} />
        <Scene mouse={mouse} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

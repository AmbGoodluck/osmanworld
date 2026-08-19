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

// Pulsing nested-wireframe server core
function ServerCore({ mouse }) {
  const outerRef = useRef();
  const midRef   = useRef();
  const coreRef  = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    outerRef.current.rotation.y =  t * 0.12;
    outerRef.current.rotation.x =  t * 0.07;
    midRef.current.rotation.y   = -t * 0.22;
    midRef.current.rotation.z   =  t * 0.10;
    coreRef.current.rotation.y  =  t * 0.45;
    coreRef.current.rotation.x  =  t * 0.30;
    const pulse = 1 + Math.sin(t * 1.8) * 0.055;
    outerRef.current.scale.setScalar(pulse);
    outerRef.current.position.x = (mouse.current[0] || 0) * 0.28;
    outerRef.current.position.y = 0.2 + (mouse.current[1] || 0) * 0.18;
    midRef.current.position.x   = (mouse.current[0] || 0) * 0.28;
    midRef.current.position.y   = 0.2 + (mouse.current[1] || 0) * 0.18;
    coreRef.current.position.x  = (mouse.current[0] || 0) * 0.28;
    coreRef.current.position.y  = 0.2 + (mouse.current[1] || 0) * 0.18;
  });

  return (
    <>
      <mesh ref={outerRef} position={[0, 0.2, -1]}>
        <icosahedronGeometry args={[2.0, 1]} />
        <meshStandardMaterial color={COLORS.blue} wireframe transparent opacity={0.22}
          emissive={new THREE.Color(COLORS.blue)} emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={midRef} position={[0, 0.2, -1]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color={COLORS.lightBlue} wireframe transparent opacity={0.18}
          emissive={new THREE.Color(COLORS.lightBlue)} emissiveIntensity={0.25} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0.2, -1]}>
        <octahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial color={COLORS.lightBlue} roughness={0.05} metalness={0.95}
          emissive={new THREE.Color(COLORS.lightBlue)} emissiveIntensity={0.85} />
      </mesh>
    </>
  );
}

// Solid metallic cube
function TechCube({ position, size, color, rotSpeed, floatSpeed, floatAmp, mouse, parallaxStrength }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x += rotSpeed[0];
    ref.current.rotation.y += rotSpeed[1];
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    ref.current.position.x = position[0] + (mouse.current[0] || 0) * parallaxStrength;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={new THREE.Color(color)} roughness={0.2} metalness={0.8}
        emissive={new THREE.Color(color)} emissiveIntensity={0.08} />
      <Edges color={color} />
    </mesh>
  );
}

// Sharp octahedron data node
function DataNode({ position, color, rotSpeed, floatSpeed, floatAmp, mouse, parallaxStrength }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x += rotSpeed[0];
    ref.current.rotation.y += rotSpeed[1];
    ref.current.rotation.z += rotSpeed[2];
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    ref.current.position.x = position[0] + (mouse.current[0] || 0) * parallaxStrength;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <octahedronGeometry args={[0.44, 0]} />
      <meshStandardMaterial color={new THREE.Color(color)} roughness={0.1} metalness={0.9}
        emissive={new THREE.Color(color)} emissiveIntensity={0.45} />
    </mesh>
  );
}

function Scene({ mouse }) {
  // 1 ServerCore + 3 cubes + 3 nodes = 7
  const cubes = [
    { position: [-3.8, -1.0,  0.2], size: [1.1, 1.1, 1.1], color: COLORS.blue,      rotSpeed: [0.004, 0.008], floatSpeed: 1.0,  floatAmp: 0.25, parallaxStrength: 0.5  },
    { position: [ 3.5, -1.2,  0.0], size: [0.9, 0.9, 0.9], color: COLORS.lightBlue, rotSpeed: [0.006, 0.005], floatSpeed: 1.15, floatAmp: 0.22, parallaxStrength: 0.45 },
    { position: [-1.4,  2.2,  0.5], size: [0.75,0.75,0.75],color: COLORS.crimson,   rotSpeed: [0.005, 0.009], floatSpeed: 1.3,  floatAmp: 0.28, parallaxStrength: 0.6  },
  ];

  const nodes = [
    { position: [ 4.0,  1.4, -0.5], color: COLORS.lightBlue, rotSpeed: [0.006, 0.010, 0.004], floatSpeed: 0.9,  floatAmp: 0.2,  parallaxStrength: 0.38 },
    { position: [-4.2,  1.0,  0.2], color: COLORS.crimson,   rotSpeed: [0.008, 0.006, 0.005], floatSpeed: 1.1,  floatAmp: 0.24, parallaxStrength: 0.42 },
    { position: [ 1.5, -2.5,  0.8], color: COLORS.white,     rotSpeed: [0.007, 0.009, 0.004], floatSpeed: 1.5,  floatAmp: 0.3,  parallaxStrength: 0.65 },
  ];

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[6, 10, 6]} intensity={1.6} castShadow color="#ffffff" />
      <pointLight position={[-6, 4,  4]}  intensity={2.2} color={COLORS.blue}      distance={24} />
      <pointLight position={[ 6, 5, -4]}  intensity={1.8} color={COLORS.lightBlue} distance={22} />
      <pointLight position={[ 0, -4,  5]} intensity={1.0} color={COLORS.crimson}   distance={15} />
      <ServerCore mouse={mouse} />
      {cubes.map((c, i) => <TechCube  key={i} {...c} mouse={mouse} />)}
      {nodes.map((n, i) => <DataNode  key={i} {...n} mouse={mouse} />)}
    </>
  );
}

export default function TechTab() {
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
        <fog attach="fog" args={['#101624', 18, 32]} />
        <Scene mouse={mouse} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

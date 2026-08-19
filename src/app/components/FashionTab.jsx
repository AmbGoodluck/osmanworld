"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = {
  blue:      '#1A3A8F',
  lightBlue: '#87CEEB',
  crimson:   '#8B0000',
  gray:      '#9CA3AF',
  white:     '#FFFFFF',
};

// Three interlocked rings — signature fashion centrepiece
function SignatureRings({ mouse }) {
  const groupRef = useRef();
  const r1 = useRef();
  const r2 = useRef();
  const r3 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.position.x = (mouse.current[0] || 0) * 0.22;
    groupRef.current.position.y = 0.2 + (mouse.current[1] || 0) * 0.15;
    r1.current.rotation.y = t * 0.18;
    r1.current.rotation.x = Math.sin(t * 0.22) * 0.4;
    r2.current.rotation.z = t * 0.14;
    r2.current.rotation.x = Math.cos(t * 0.18) * 0.5;
    r3.current.rotation.y = -t * 0.20;
    r3.current.rotation.z = Math.sin(t * 0.15) * 0.3;
  });

  return (
    <group ref={groupRef} position={[0, 0.2, -1.0]}>
      <mesh ref={r1}>
        <torusGeometry args={[1.1, 0.06, 16, 120]} />
        <meshStandardMaterial color={COLORS.white} roughness={0.1} metalness={0.9}
          emissive={new THREE.Color(COLORS.white)} emissiveIntensity={0.35} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.06, 16, 120]} />
        <meshStandardMaterial color={COLORS.lightBlue} roughness={0.1} metalness={0.9}
          emissive={new THREE.Color(COLORS.lightBlue)} emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={r3} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.1, 0.06, 16, 120]} />
        <meshStandardMaterial color={COLORS.crimson} roughness={0.1} metalness={0.9}
          emissive={new THREE.Color(COLORS.crimson)} emissiveIntensity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color={COLORS.white} roughness={0.05} metalness={0.95}
          emissive={new THREE.Color(COLORS.white)} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

// Breathing sphere with glow halo
function FashionSphere({ position, radius, color, floatSpeed, floatAmp, pulseSpeed, mouse, parallaxStrength }) {
  const meshRef = useRef();
  const haloRef = useRef();

  useFrame((state) => {
    const t     = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * pulseSpeed) * 0.08;
    const px    = position[0] + (mouse.current[0] || 0) * parallaxStrength;
    const py    = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    meshRef.current.scale.setScalar(pulse);
    haloRef.current.scale.setScalar(pulse * 1.5);
    meshRef.current.position.set(px, py, position[2]);
    haloRef.current.position.set(px, py, position[2]);
  });

  return (
    <>
      <mesh ref={meshRef} position={position} castShadow>
        <sphereGeometry args={[radius, 40, 40]} />
        <meshStandardMaterial color={new THREE.Color(color)} roughness={0.18} metalness={0.55}
          emissive={new THREE.Color(color)} emissiveIntensity={0.28} />
      </mesh>
      <mesh ref={haloRef} position={position}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial color={new THREE.Color(color)} transparent opacity={0.055} roughness={1} />
      </mesh>
    </>
  );
}

// Graceful orbiting torus
function FashionRing({ position, ringRadius, tubeRadius, color, rotX, rotY, rotZ, floatSpeed, floatAmp, mouse, parallaxStrength }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x += rotX;
    ref.current.rotation.y += rotY;
    ref.current.rotation.z += rotZ;
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    ref.current.position.x = position[0] + (mouse.current[0] || 0) * parallaxStrength;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <torusGeometry args={[ringRadius, tubeRadius, 24, 120]} />
      <meshStandardMaterial color={new THREE.Color(color)} roughness={0.2} metalness={0.7}
        emissive={new THREE.Color(color)} emissiveIntensity={0.2} />
    </mesh>
  );
}

function Scene({ mouse }) {
  // 1 SignatureRings + 3 spheres + 3 rings = 7
  const spheres = [
    { position: [-3.8,  0.6,  0.0], radius: 0.58, color: COLORS.crimson,   floatSpeed: 1.0,  floatAmp: 0.28, pulseSpeed: 1.5, parallaxStrength: 0.48 },
    { position: [ 3.5, -0.8,  0.2], radius: 0.50, color: COLORS.lightBlue, floatSpeed: 1.15, floatAmp: 0.24, pulseSpeed: 1.2, parallaxStrength: 0.45 },
    { position: [ 0.8,  2.6,  0.4], radius: 0.42, color: COLORS.white,     floatSpeed: 1.4,  floatAmp: 0.3,  pulseSpeed: 1.8, parallaxStrength: 0.6  },
  ];

  const rings = [
    { position: [-4.6,  1.4,  0.0], ringRadius: 0.85, tubeRadius: 0.06, color: COLORS.blue,      rotX: 0.005, rotY: 0.006, rotZ: 0.002, floatSpeed: 0.95, floatAmp: 0.25, parallaxStrength: 0.42 },
    { position: [ 4.4, -1.4,  0.2], ringRadius: 0.75, tubeRadius: 0.055,color: COLORS.gray,      rotX: 0.004, rotY: 0.007, rotZ: 0.003, floatSpeed: 1.05, floatAmp: 0.22, parallaxStrength: 0.45 },
    { position: [-1.8, -2.2,  0.8], ringRadius: 0.65, tubeRadius: 0.05, color: COLORS.lightBlue, rotX: 0.006, rotY: 0.005, rotZ: 0.004, floatSpeed: 1.35, floatAmp: 0.32, parallaxStrength: 0.68 },
  ];

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 9, 6]} intensity={1.4} castShadow color="#ffffff" />
      <pointLight position={[-6, 4,  4]}  intensity={2.0} color={COLORS.lightBlue} distance={24} />
      <pointLight position={[ 6, 5, -3]}  intensity={1.6} color={COLORS.white}     distance={22} />
      <pointLight position={[ 0, -4,  5]} intensity={1.1} color={COLORS.crimson}   distance={16} />
      <SignatureRings mouse={mouse} />
      {spheres.map((s, i) => <FashionSphere key={i} {...s} mouse={mouse} />)}
      {rings.map((r, i)   => <FashionRing   key={i} {...r} mouse={mouse} />)}
    </>
  );
}

export default function FashionTab() {
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
    <div style={{ width: '100%', height: '72vh', borderRadius: '1rem', overflow: 'hidden', position: 'relative', zIndex: 0 }} onPointerMove={handlePointerMove}>
      <Canvas camera={{ position: [0, 0.5, 10], fov: 58 }} shadows gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#101624']} />
        <fog attach="fog" args={['#101624', 18, 32]} />
        <Scene mouse={mouse} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

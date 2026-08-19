"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = {
  blue:      '#1A3A8F',
  lightBlue: '#87CEEB',
  crimson:   '#8B0000',
  gray:      '#9CA3AF',
  white:     '#FFFFFF',
};

// Pulsing milestone sphere with glow shell
function MilestoneSphere({ position, color, pulseSpeed, mouse, parallaxStrength }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const t     = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * pulseSpeed) * 0.13;
    const px    = position[0] + (mouse.current[0] || 0) * parallaxStrength;
    const py    = position[1] + Math.sin(t * pulseSpeed * 0.5) * 0.18;
    meshRef.current.scale.setScalar(pulse);
    glowRef.current.scale.setScalar(pulse * 1.6);
    meshRef.current.position.set(px, py, position[2]);
    glowRef.current.position.set(px, py, position[2]);
  });

  return (
    <>
      <mesh ref={meshRef} position={position} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={new THREE.Color(color)} roughness={0.15} metalness={0.7}
          emissive={new THREE.Color(color)} emissiveIntensity={0.38} />
      </mesh>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={new THREE.Color(color)} transparent opacity={0.06} roughness={1} />
      </mesh>
    </>
  );
}

// Floating torus — organic motion
function FloatingTorus({ position, color, rotX, rotY, floatSpeed, floatAmp, mouse, parallaxStrength }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x += rotX;
    ref.current.rotation.y += rotY;
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    ref.current.position.x = position[0] + (mouse.current[0] || 0) * parallaxStrength;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <torusGeometry args={[0.48, 0.11, 16, 80]} />
      <meshStandardMaterial color={new THREE.Color(color)} roughness={0.25} metalness={0.6}
        emissive={new THREE.Color(color)} emissiveIntensity={0.14} />
    </mesh>
  );
}

// CatmullRom tube tracing the journey
function JourneyPath({ waypoints, color }) {
  const curve  = useMemo(() => new THREE.CatmullRomCurve3(waypoints.map((p) => new THREE.Vector3(...p))), []);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.022, 8, false), [curve]);
  const matRef  = useRef();

  useFrame((state) => {
    if (matRef.current) matRef.current.opacity = 0.38 + Math.sin(state.clock.getElapsedTime() * 0.55) * 0.12;
  });

  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial ref={matRef} color={new THREE.Color(color)} emissive={new THREE.Color(color)}
        emissiveIntensity={0.55} transparent opacity={0.45} roughness={0.05} metalness={0.9} />
    </mesh>
  );
}

function Scene({ mouse }) {
  const milestones = [
    { spherePos: [-4.0, -1.8, 0.0], color: COLORS.blue,      pulseSpeed: 1.1, parallax: 0.3  },
    { spherePos: [-1.2,  0.1, 0.4], color: COLORS.lightBlue, pulseSpeed: 1.4, parallax: 0.45 },
    { spherePos: [ 1.4,  1.2, 0.2], color: COLORS.crimson,   pulseSpeed: 1.7, parallax: 0.55 },
    { spherePos: [ 3.8,  2.2, 0.4], color: COLORS.white,     pulseSpeed: 2.1, parallax: 0.7  },
  ];

  const pathWaypoints = [
    [-4.0, -1.8, 0.0], [-2.8, -1.0, 0.3], [-1.2, 0.1, 0.4],
    [ 0.1,  0.7, 0.3], [ 1.4,  1.2, 0.2], [ 2.6, 1.7, 0.3], [3.8, 2.2, 0.4],
  ];

  // 2 tori flanking the path
  const tori = [
    { position: [-3.0,  0.8, -1.0], color: COLORS.blue,      rotX: 0.003, rotY: 0.005, floatSpeed: 0.75, floatAmp: 0.22, parallaxStrength: 0.28 },
    { position: [ 2.5, -0.4, -0.8], color: COLORS.lightBlue, rotX: 0.004, rotY: 0.006, floatSpeed: 0.95, floatAmp: 0.25, parallaxStrength: 0.38 },
  ];

  // Total rendered: 1 path + 4 spheres + 2 tori = 7
  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 9, 6]} intensity={1.5} castShadow color="#ffffff" />
      <pointLight position={[-6, 3,  4]}  intensity={2.0} color={COLORS.lightBlue} distance={22} />
      <pointLight position={[ 6, 4, -3]}  intensity={1.6} color={COLORS.blue}      distance={20} />
      <pointLight position={[ 0, -3,  5]} intensity={1.0} color={COLORS.crimson}   distance={15} />
      <JourneyPath waypoints={pathWaypoints} color={COLORS.lightBlue} />
      {milestones.map((m, i) => (
        <MilestoneSphere key={i} position={m.spherePos} color={m.color}
          pulseSpeed={m.pulseSpeed} mouse={mouse} parallaxStrength={m.parallax} />
      ))}
      {tori.map((t, i) => <FloatingTorus key={i} {...t} mouse={mouse} />)}
    </>
  );
}

export default function AboutTab() {
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
    <div style={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: '1rem', overflow: 'hidden' }} onPointerMove={handlePointerMove}>
      <Canvas camera={{ position: [0, 0.5, 10], fov: 58 }} shadows gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#101624']} />
        <fog attach="fog" args={['#101624', 18, 32]} />
        <Scene mouse={mouse} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

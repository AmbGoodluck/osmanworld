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

// Sharp ascending shape — floats upward and rotates energetically
function AscendingShape({ geo, color, position, scale, floatSpeed, floatAmp, rotX, rotY, emissive, mouse, parallaxStrength }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x += rotX;
    ref.current.rotation.y += rotY;
    ref.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    ref.current.position.x = position[0] + (mouse.current[0] || 0) * parallaxStrength;
    ref.current.position.z = position[2] + (mouse.current[1] || 0) * parallaxStrength * 0.5;
  });
  return (
    <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
      <primitive object={geo} />
      <meshStandardMaterial color={new THREE.Color(color)} roughness={0.25} metalness={0.75}
        emissive={emissive ? new THREE.Color(color) : new THREE.Color('#000000')}
        emissiveIntensity={emissive ? 0.28 : 0} />
    </mesh>
  );
}

// Thin glowing vertical cylinder — chart spike / momentum line
function RisingLine({ position, color, mouse, speed }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.x = position[0] + (mouse.current[0] || 0) * 0.4;
    ref.current.position.y = position[1] + Math.sin(t * speed) * 0.2;
  });
  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.022, 0.022, 2.6, 6]} />
      <meshStandardMaterial color={new THREE.Color(color)} emissive={new THREE.Color(color)}
        emissiveIntensity={0.65} roughness={0.1} metalness={0.9} />
    </mesh>
  );
}

function Scene({ mouse }) {
  const geoms = useMemo(() => ({
    pyramid4:  new THREE.ConeGeometry(0.65, 1.5, 4),
    sharpCone: new THREE.ConeGeometry(0.3,  2.0, 4),
    cube:      new THREE.BoxGeometry(0.75, 0.75, 0.75),
    octahedron: new THREE.OctahedronGeometry(0.55),
  }), []);

  // 4 ascending shapes + 3 rising lines = 7
  const shapes = [
    { geo: geoms.pyramid4,   color: COLORS.crimson,   position: [-3.2, -1.5,  0.0], scale: [1.3, 1.3, 1.3], floatSpeed: 1.0,  floatAmp: 0.38, rotX: 0.003, rotY: 0.010, emissive: true,  parallaxStrength: 0.5  },
    { geo: geoms.sharpCone,  color: COLORS.lightBlue, position: [ 0.4,  0.8,  0.0], scale: [1.1, 1.0, 1.1], floatSpeed: 1.35, floatAmp: 0.32, rotX: 0.004, rotY: 0.012, emissive: true,  parallaxStrength: 0.5  },
    { geo: geoms.octahedron, color: COLORS.white,     position: [ 2.4, -0.4,  0.3], scale: [0.9, 0.9, 0.9], floatSpeed: 1.15, floatAmp: 0.3,  rotX: 0.006, rotY: 0.007, emissive: true,  parallaxStrength: 0.5  },
    { geo: geoms.cube,       color: COLORS.blue,      position: [-1.4,  1.8,  0.5], scale: [1.0, 1.0, 1.0], floatSpeed: 1.2,  floatAmp: 0.28, rotX: 0.005, rotY: 0.008, emissive: false, parallaxStrength: 0.5  },
  ];

  const lines = [
    { position: [-4.5, 0.0, 0.5], color: COLORS.crimson,   speed: 1.1 },
    { position: [ 0.0, 1.0, 0.2], color: COLORS.lightBlue, speed: 0.9 },
    { position: [ 3.8, 0.5, 0.6], color: COLORS.blue,      speed: 1.3 },
  ];

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[6, 10, 6]} intensity={1.6} castShadow color="#ffffff" />
      <pointLight position={[-6, 4, 4]}  intensity={2.0} color={COLORS.crimson}   distance={18} />
      <pointLight position={[ 6, 6, -4]} intensity={1.8} color={COLORS.blue}      distance={18} />
      <pointLight position={[ 0, 8,  2]} intensity={1.2} color={COLORS.lightBlue} distance={14} />
      {shapes.map((s, i) => <AscendingShape key={i} {...s} mouse={mouse} />)}
      {lines.map((l, i)  => <RisingLine    key={i} {...l} mouse={mouse} />)}
    </>
  );
}

export default function EntrepreneurshipTab() {
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
      <Canvas camera={{ position: [0, 0.5, 9], fov: 58 }} shadows gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#101624']} />
        <fog attach="fog" args={['#101624', 18, 32]} />
        <Scene mouse={mouse} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

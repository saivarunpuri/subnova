import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useUIStore } from '../store/uiStore';
import { gsap } from 'gsap';

// Aurora Eclipse Planet Data - each world has its own atmospheric identity
const PLANETS = {
  discover: { position: [0, 0, 0], color: '#00F5A0', emissive: '#00D9F5', label: 'Hub' },
  entertainment: { position: [-8, 2, -5], color: '#FF6B6B', emissive: '#f472b6', label: 'Entertainment' },
  education: { position: [8, -2, -8], color: '#00D9F5', emissive: '#00F5A0', label: 'Education' },
  creator: { position: [0, 6, -10], color: '#FF6B6B', emissive: '#f472b6', label: 'Creator' },
  music: { position: [-6, -4, 2], color: '#00F5A0', emissive: '#00D9F5', label: 'Music' },
  productivity: { position: [6, 4, 4], color: '#A78BFA', emissive: '#00D9F5', label: 'Productivity' },
  dashboard: { position: [0, -6, 5], color: '#00D9F5', emissive: '#00F5A0', label: 'Dashboard' },
  profile: { position: [0, 0, 8], color: '#FF6B6B', emissive: '#f472b6', label: 'Profile' },
};

const Planet = ({ position, color, emissive, label, active, onClick }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.18;
      meshRef.current.rotation.x += delta * 0.04;
    }
    if (ringRef.current && active) {
      ringRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group position={position} onClick={onClick}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[active ? 1.6 : 0.95, 48, 48]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={active ? 0.7 : 0.25}
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>

        {active && (
          <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
            <torusGeometry args={[2.4, 0.12, 8, 64]} />
            <meshBasicMaterial color={emissive} transparent opacity={0.5} />
          </mesh>
        )}

        <mesh>
          <sphereGeometry args={[active ? 2.0 : 1.2, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 0.06 : 0.03} side={THREE.BackSide} />
        </mesh>

        <Text
          position={[0, active ? 2.5 : 1.7, 0]}
          fontSize={active ? 0.45 : 0.35}
          color={active ? '#F8FAFC' : 'rgba(248,250,252,0.55)'}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  const activeSpace = useUIStore((state) => state.activeSpace);

  useEffect(() => {
    const updatePosition = () => {
      const targetPlanet = PLANETS[activeSpace as keyof typeof PLANETS] || PLANETS.discover;
      const isMobile = window.innerWidth < 1024;
      
      let shiftX = 0;
      let shiftY = 0;
      let zoomZ = 9;

      if (activeSpace === 'discover' || activeSpace === 'dashboard' || activeSpace === 'profile') {
        shiftX = 0;
        shiftY = 0;
        zoomZ = 9;
      } else {
        if (isMobile) {
          // On mobile, keep planet centered but shift slightly upwards to clear bottom space dock navigation
          shiftX = 0;
          shiftY = -0.5;
          zoomZ = 6.8;
        } else {
          // On desktop, shift active planet to the left half of the screen so it is completely visible beside the right-hand card
          shiftX = 2.4;
          shiftY = 0;
          zoomZ = 5.8;
        }
      }

      gsap.to(camera.position, {
        x: targetPlanet.position[0] + shiftX,
        y: targetPlanet.position[1] + shiftY,
        z: targetPlanet.position[2] + zoomZ,
        duration: 2.2,
        ease: 'power3.inOut'
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activeSpace, camera]);

  return null;
};

const AuroraParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.05;
    }
  });

  const positions = new Float32Array(4000 * 3);
  const colors = new Float32Array(4000 * 3);
  const auroraColors = [
    [0.0, 0.96, 0.63],
    [0.0, 0.85, 0.96],
    [1.0, 0.42, 0.42],
    [1.0, 1.0, 1.0],
  ];

  for (let i = 0; i < 4000; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300;

    const c = auroraColors[Math.floor(Math.random() * auroraColors.length)];
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.35} vertexColors transparent opacity={0.75} sizeAttenuation />
    </points>
  );
};

export const SubscriptionUniverse = () => {
  const { activeSpace, setActiveSpace } = useUIStore();
  const visiblePlanets = Object.entries(PLANETS).filter(([key]) => key !== 'profile');

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 58 }}
      onPointerMissed={() => setActiveSpace('discover')}
    >
      <color attach="background" args={['#050816']} />

      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00F5A0" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#00D9F5" />
      <pointLight position={[5, -10, 5]} intensity={0.5} color="#FF6B6B" />

      <AuroraParticles />

      {visiblePlanets.map(([key, data]) => (
        <Planet
          key={key}
          position={data.position}
          color={data.color}
          emissive={data.emissive}
          label={data.label}
          active={activeSpace === key}
          onClick={() => setActiveSpace(key as any)}
        />
      ))}

      <CameraController />
    </Canvas>
  );
};

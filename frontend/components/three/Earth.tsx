"use client";
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ParticleEarth = () => {
  const points = useRef<THREE.Points>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (camera) {
      camera.position.z = 5;
    }
  }, [camera]);
  // Generate particles in spherical coordinates
  const particleCount = 10000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    // Spherical coordinates
    const radius = 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Create continents by varying colors based on position
    const isLand = Math.random() > 0.7;
    if (isLand) {
      // Green for land
      colors[i * 3] = 0.2;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 0.3;
    } else {
      // Blue for water
      colors[i * 3] = 0.2;
      colors[i * 3 + 1] = 0.4;
      colors[i * 3 + 2] = 0.8;
    }
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.8} />
    </points>
  );
};

const Scene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ParticleEarth />
    </Canvas>
  );
};

export default function EarthAnimation() {
  return (
    <div style={{ width: "500px", height: "500px" }}>
      <Scene />
    </div>
  );
}

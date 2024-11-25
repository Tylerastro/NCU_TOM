"use client";
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

// Shader definitions
const vertexShader = `
  uniform float size;
  uniform sampler2D elevTexture;

  varying vec2 vUv;
  varying float vVisible;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    float elv = texture2D(elevTexture, vUv).r;
    vec3 vNormal = normalMatrix * normal;
    vVisible = step(0.0, dot( -normalize(mvPosition.xyz), normalize(vNormal)));
    mvPosition.z += 0.35 * elv;
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform sampler2D alphaTexture;

  varying vec2 vUv;
  varying float vVisible;

  void main() {
    if (floor(vVisible + 0.1) == 0.0) discard;
    float alpha = 1.0 - texture2D(alphaTexture, vUv).r;
    gl_FragColor = vec4(0.3, 0.5, 0.8, alpha); 
  }
`;

interface EarthProps {
  wireframe?: boolean;
}

// Convert latitude and longitude to 3D coordinates
const latLongToVector3 = (
  lat: number,
  long: number,
  radius: number
): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = -(long + 180) * (Math.PI / 180);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

const Earth: React.FC<EarthProps> = ({ wireframe = true }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (!groupRef.current) return;

    const textureLoader = new THREE.TextureLoader();

    // Load textures
    const elevMap = textureLoader.load("/textures/01_earthbump1k.jpg");
    const alphaMap = textureLoader.load("/textures/02_earthspec1k.jpg");

    // Create points geometry
    const pointsGeo = new THREE.IcosahedronGeometry(1, 120);

    // Create shader material
    const uniforms = {
      size: { value: 4.0 },
      elevTexture: { value: elevMap },
      alphaTexture: { value: alphaMap },
    };

    const pointsMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const points = new THREE.Points(pointsGeo, pointsMat);
    groupRef.current.add(points);

    // Add NCU marker
    const ncuPosition = latLongToVector3(23.469444, 120.872639, 1.05);
    const markerGeo = new THREE.SphereGeometry(0.005, 8, 8);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.5,
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.copy(ncuPosition);
    groupRef.current.add(marker);

    // Add LSST marker
    const lsstPosition = latLongToVector3(-30.244639, -70.749417, 1.05);
    const lsstMarker = new THREE.Mesh(markerGeo, markerMat);
    lsstMarker.position.copy(lsstPosition);
    groupRef.current.add(lsstMarker);

    // Add wireframe if enabled
    if (wireframe) {
      const wireframeGeo = new THREE.IcosahedronGeometry(1, 10);
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x202020,
        wireframe: true,
      });
      const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
      groupRef.current.add(wireframeMesh);
    }

    // Cleanup
    return () => {
      pointsGeo.dispose();
      pointsMat.dispose();
      markerGeo.dispose();
      markerMat.dispose();
    };
  }, [wireframe]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      // groupRef.current.rotation.x += 0.002;
      // groupRef.current.rotation.z -= 0.002;
    }
  });

  return <group ref={groupRef} />;
};

const Scene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
      <ambientLight />
      <hemisphereLight intensity={3} color={0xffffff} groundColor={0x080820} />
      <Earth />
      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  );
};

export default function EarthAnimation() {
  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <Scene />
    </div>
  );
}

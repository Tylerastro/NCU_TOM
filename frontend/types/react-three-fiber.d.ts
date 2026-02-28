import { Object3DNode, BufferGeometryNode, MaterialNode } from "@react-three/fiber";
import * as THREE from "three";

declare module "@react-three/fiber" {
  interface ThreeElements {
    points: Object3DNode<THREE.Points, typeof THREE.Points>;
    bufferGeometry: BufferGeometryNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
    bufferAttribute: Object3DNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>;
    pointsMaterial: MaterialNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
    }
  }
}

export {};

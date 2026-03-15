"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

/**
 * Параметры одной фигуры
 */
interface ShapeConfig {
  position: [number, number, number];
  color: string;
  opacity: number;
  floatSpeed: number;
  floatIntensity: number;
  rotationIntensity: number;
}

const SHAPES: ShapeConfig[] = [
  {
    position: [-2.5, 1, -2],
    color: "#a78bfa",
    opacity: 0.15,
    floatSpeed: 1.5,
    floatIntensity: 0.8,
    rotationIntensity: 0.5,
  },
  {
    position: [2.5, -0.5, -1],
    color: "#60a5fa",
    opacity: 0.1,
    floatSpeed: 1.2,
    floatIntensity: 0.6,
    rotationIntensity: 0.4,
  },
  {
    position: [0.5, 2, -3],
    color: "#22d3ee",
    opacity: 0.08,
    floatSpeed: 1.0,
    floatIntensity: 0.7,
    rotationIntensity: 0.3,
  },
  {
    position: [-1.5, -1.5, -2],
    color: "#c084fc",
    opacity: 0.12,
    floatSpeed: 1.3,
    floatIntensity: 0.5,
    rotationIntensity: 0.6,
  },
];

/**
 * Одна плавающая фигура, реагирующая на позицию мыши.
 */
function FloatingShape({
  config,
  children,
}: {
  config: ShapeConfig;
  children: React.ReactNode;
}) {
  const meshRef = useRef<Mesh>(null);
  const { pointer } = useThree();

  // Плавное следование за мышью
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.x +=
      (config.position[0] + pointer.x * 0.3 - meshRef.current.position.x) * 0.02;
    meshRef.current.position.y +=
      (config.position[1] + pointer.y * 0.3 - meshRef.current.position.y) * 0.02;
  });

  return (
    <Float
      speed={config.floatSpeed}
      floatIntensity={config.floatIntensity}
      rotationIntensity={config.rotationIntensity}
    >
      <mesh ref={meshRef} position={config.position}>
        {children}
        <meshBasicMaterial
          wireframe
          color={config.color}
          transparent
          opacity={config.opacity}
        />
      </mesh>
    </Float>
  );
}

/**
 * Набор плавающих wireframe-фигур для Hero 3D-сцены.
 * Icosahedron, Octahedron, Dodecahedron, TorusKnot — все wireframe,
 * плавают и реагируют на позицию мыши.
 */
export function FloatingGeometry() {
  return (
    <>
      <FloatingShape config={SHAPES[0]}>
        <icosahedronGeometry args={[0.8]} />
      </FloatingShape>

      <FloatingShape config={SHAPES[1]}>
        <octahedronGeometry args={[0.5]} />
      </FloatingShape>

      <FloatingShape config={SHAPES[2]}>
        <dodecahedronGeometry args={[0.4]} />
      </FloatingShape>

      <FloatingShape config={SHAPES[3]}>
        <torusKnotGeometry args={[0.3, 0.08, 64, 16]} />
      </FloatingShape>
    </>
  );
}

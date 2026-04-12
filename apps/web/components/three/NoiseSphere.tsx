"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import type { Mesh } from "three";

/**
 * Интерактивная 3D noise sphere — центральный объект Hero-секции.
 * Использует MeshDistortMaterial из drei для деформации.
 * Реагирует на движение мыши: меняется скорость и интенсивность деформации.
 */
export function NoiseSphere() {
  const meshRef = useRef<Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Медленное вращение
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.08;
  });

  // Сила деформации зависит от расстояния мыши от центра
  const distortAmount = 0.3 + Math.abs(pointer.x * 0.15) + Math.abs(pointer.y * 0.15);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          distort={distortAmount}
          speed={2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

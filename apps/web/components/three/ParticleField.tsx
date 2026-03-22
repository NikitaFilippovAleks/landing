"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";

/**
 * Анимированное поле частиц для Hero-секции.
 * Два слоя: фиолетовые (1500 шт) и голубые (500 шт), вращаются в разные стороны.
 */
export function ParticleField() {
  const purpleRef = useRef<Points>(null);
  const cyanRef = useRef<Points>(null);

  // Генерация позиций частиц один раз
  const purplePositions = useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;      // x: -15..15
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;  // y: -15..15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2; // z: -10..5
    }
    return positions;
  }, []);

  const cyanPositions = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (purpleRef.current) {
      purpleRef.current.rotation.y += delta * 0.02;
      purpleRef.current.rotation.x += delta * 0.01;
    }
    if (cyanRef.current) {
      // Голубой слой вращается в обратную сторону
      cyanRef.current.rotation.y -= delta * 0.015;
      cyanRef.current.rotation.x -= delta * 0.008;
    }
  });

  return (
    <>
      {/* Фиолетовый слой — основной */}
      <points ref={purpleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1500}
            array={purplePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color="#7C3AED"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Голубой слой — дополнительный */}
      <points ref={cyanRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={cyanPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          color="#F97316"
          transparent
          opacity={0.3}
          sizeAttenuation
        />
      </points>
    </>
  );
}

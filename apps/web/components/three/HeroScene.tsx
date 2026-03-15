"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { ParticleField } from "./ParticleField";
import { FloatingGeometry } from "./FloatingGeometry";

/**
 * Основная 3D-сцена для Hero-секции.
 * Canvas с частицами, плавающей геометрией и постобработкой.
 */
export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 1.5]}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Автоматическое снижение DPR при просадках FPS */}
      <AdaptiveDpr pixelated />

      {/* Два слоя частиц */}
      <ParticleField />

      {/* Wireframe-фигуры */}
      <FloatingGeometry />

      {/* Постобработка: свечение + лёгкий шум */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={0.4}
        />
        <Noise opacity={0.03} />
      </EffectComposer>
    </Canvas>
  );
}

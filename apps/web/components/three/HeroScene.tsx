"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { ParticleField } from "./ParticleField";
import { NoiseSphere } from "./NoiseSphere";

interface HeroSceneProps {
  paused?: boolean;
}

/**
 * Основная 3D-сцена для Hero-секции.
 * Центральный объект — NoiseSphere, окружённая частицами.
 * Усиленный Bloom для неонового свечения.
 *
 * При paused=true рендеринг останавливается (frameloop="never"),
 * что полностью снимает GPU-нагрузку когда hero вне viewport.
 */
export function HeroScene({ paused = false }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 1.5]}
      frameloop={paused ? "never" : "always"}
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

      {/* Освещение для NoiseSphere */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#A855F7" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#F97316" />

      {/* Интерактивная noise sphere */}
      <NoiseSphere />

      {/* Два слоя частиц */}
      <ParticleField />

      {/* Постобработка: Bloom для неонового свечения */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          intensity={0.6}
        />
      </EffectComposer>
    </Canvas>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MobileFallback } from "./MobileFallback";

// Ленивая загрузка 3D-сцены — Three.js (~500KB) не попадёт в основной бандл
const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
});

/**
 * Контейнер 3D-сцены с автоматическим фоллбеком.
 * - Desktop: полная 3D-сцена (React Three Fiber)
 * - Mobile / слабое устройство: CSS-анимация blob-ов
 * - prefers-reduced-motion: статичный градиентный фон
 */
export function SceneContainer() {
  const { isMobile, isLowPower } = useIsMobile();
  const prefersReduced = useReducedMotion();

  // Статичный фон для пользователей с reduced-motion
  if (prefersReduced) {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[128px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[96px]" />
      </div>
    );
  }

  // CSS-анимация для мобильных и слабых устройств
  if (isMobile || isLowPower) {
    return <MobileFallback />;
  }

  // Полная 3D-сцена для десктопа
  return (
    <div className="pointer-events-none absolute inset-0">
      <Suspense fallback={<MobileFallback />}>
        <HeroScene />
      </Suspense>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Провайдер плавного скролла Lenis.
 * При prefers-reduced-motion — не инициализируется (обычный скролл).
 * На мобильных — нативный скролл (Lenis использует gestureOrientation: vertical).
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Не инициализируем Lenis если пользователь предпочитает уменьшенное движение
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // RAF-цикл для обновления Lenis с остановкой при завершении скролла
    let rafId: number;
    let isScrolling = false;

    lenis.on("scroll", () => {
      isScrolling = true;
    });

    function raf(time: number) {
      lenis.raf(time);
      // Продолжаем RAF только пока Lenis анимирует скролл
      if (isScrolling && !lenis.isScrolling) {
        isScrolling = false;
      }
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced]);

  return <>{children}</>;
}

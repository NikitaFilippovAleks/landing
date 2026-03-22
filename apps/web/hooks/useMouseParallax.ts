"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxPosition {
  x: number;
  y: number;
}

/**
 * Хук для параллакс-эффекта на движение мыши.
 * Возвращает нормализованные координаты от -1 до 1 с плавным lerp.
 */
export function useMouseParallax(smoothing = 0.1): ParallaxPosition {
  const [position, setPosition] = useState<ParallaxPosition>({ x: 0, y: 0 });
  const targetRef = useRef<ParallaxPosition>({ x: 0, y: 0 });
  const currentRef = useRef<ParallaxPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Нормализуем от -1 до 1 относительно центра экрана
      targetRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    let rafId: number;
    const animate = () => {
      // Lerp для плавности
      currentRef.current.x +=
        (targetRef.current.x - currentRef.current.x) * smoothing;
      currentRef.current.y +=
        (targetRef.current.y - currentRef.current.y) * smoothing;

      setPosition({ ...currentRef.current });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [smoothing]);

  return position;
}

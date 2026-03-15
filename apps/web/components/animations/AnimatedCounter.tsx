"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimatedCounterProps {
  /** Целевое число */
  target: number;
  /** Суффикс после числа (например "+") */
  suffix?: string;
  /** Длительность анимации в мс */
  duration?: number;
  className?: string;
}

/**
 * Анимированный счётчик, который считает от 0 до target при появлении во вьюпорте.
 * Используется в секции About для статистики.
 */
export function AnimatedCounter({
  target,
  suffix = "",
  duration = 1500,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || hasAnimated || !ref.current) {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Анимируем счётчик
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuad для плавного замедления
            const eased = 1 - (1 - progress) * (1 - progress);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  );
}

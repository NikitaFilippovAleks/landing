"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealProps {
  children: ReactNode;
  /** Направление появления */
  direction?: "up" | "down" | "left" | "right";
  /** Задержка перед началом анимации (секунды) */
  delay?: number;
  className?: string;
}

// Смещения для каждого направления
const offsets = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

/**
 * Обёртка для плавного появления элемента при скролле.
 * Используется вокруг серверных компонентов для добавления анимации
 * без нарушения SSR.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const prefersReduced = useReducedMotion();

  // Если пользователь предпочитает уменьшенное движение — рендерим без анимации
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const offset = offsets[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

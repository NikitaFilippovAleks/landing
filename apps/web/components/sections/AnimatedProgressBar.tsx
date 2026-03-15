"use client";

import { motion } from "framer-motion";

interface AnimatedProgressBarProps {
  /** Уровень заполнения (0-100) */
  level: number;
  /** CSS-класс градиента (например "from-purple-500 to-blue-500") */
  colorClass: string;
  /** Задержка анимации для stagger-эффекта */
  delay?: number;
}

/**
 * Прогресс-бар с анимацией заполнения при появлении во вьюпорте.
 */
export function AnimatedProgressBar({
  level,
  colorClass,
  delay = 0,
}: AnimatedProgressBarProps) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
        initial={{ width: "0%" }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
    </div>
  );
}

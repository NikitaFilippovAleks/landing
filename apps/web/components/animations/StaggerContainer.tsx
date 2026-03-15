"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StaggerContainerProps {
  children: ReactNode;
  /** Задержка между появлением дочерних элементов (секунды) */
  staggerDelay?: number;
  /** Задержка перед стартом первого элемента */
  delayChildren?: number;
  className?: string;
}

/**
 * Контейнер для поочерёдного появления дочерних элементов.
 * Используется вместе с StaggerItem.
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  delayChildren = 0.2,
  className,
}: StaggerContainerProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Kastomnyj kursor: tochka + krug-folover.
 * Pokazyvaetsya tolko na desktop, skryvaetsya pri prefers-reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();
  const { isMobile } = useIsMobile();

  useEffect(() => {
    if (prefersReduced || isMobile) return;

    let isAnimating = false;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }

      // Запускаем RAF-цикл если он не активен
      if (!isAnimating) {
        isAnimating = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    let rafId: number;
    const animate = () => {
      const dx = mousePos.current.x - circlePos.current.x;
      const dy = mousePos.current.y - circlePos.current.y;

      circlePos.current.x += dx * 0.15;
      circlePos.current.y += dy * 0.15;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${circlePos.current.x - 20}px, ${circlePos.current.y - 20}px)`;
      }

      // Останавливаем RAF когда круг догнал курсор
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        isAnimating = false;
        return;
      }

      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReduced, isMobile, visible]);

  if (prefersReduced || isMobile) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-violet-400 mix-blend-difference transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={circleRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border border-violet-400/30 mix-blend-difference transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Кастомный курсор: точка + круг-фолловер.
 * Показывается только на desktop, скрывается при prefers-reduced-motion.
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
    // Не показываем на мобильных и при reduced motion
    if (prefersReduced || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Точка следует мгновенно
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    // RAF-цикл для плавного следования круга
    let rafId: number;
    const animate = () => {
      const dx = mousePos.current.x - circlePos.current.x;
      const dy = mousePos.current.y - circlePos.current.y;

      // Lerp — плавное следование с задержкой
      circlePos.current.x += dx * 0.15;
      circlePos.current.y += dy * 0.15;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${circlePos.current.x - 20}px, ${circlePos.current.y - 20}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReduced, isMobile, visible]);

  // Не рендерим на мобильных и при reduced motion
  if (prefersReduced || isMobile) return null;

  return (
    <>
      {/* Точка-курсор (8px) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-violet-400 mix-blend-difference transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      />
      {/* Круг-фолловер (40px) */}
      <div
        ref={circleRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border border-violet-400/30 mix-blend-difference transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
    </>
  );
}

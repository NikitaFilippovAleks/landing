"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Максимальный угол наклона (градусы) */
  maxTilt?: number;
}

/**
 * Карточка с 3D-tilt эффектом при наведении мыши.
 * Используется для карточек навыков.
 * Работает через inline styles (transform) без перерисовок React.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 5,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Позиция мыши относительно центра карточки (-0.5 до 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Вращение: ось Y — горизонтальное движение, ось X — вертикальное (инвертировано)
    ref.current.style.transform = `perspective(1000px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: "transform 0.3s ease-out" }}
    >
      {children}
    </div>
  );
}

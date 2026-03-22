"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Экран загрузки с анимированным SVG-логотипом "NF",
 * числовым счётчиком и линией прогресса.
 * Исчезает вверх после завершения загрузки.
 */
export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Эмуляция прогресса загрузки
  const runProgress = useCallback(async () => {
    // Быстро до 60%
    for (let i = 0; i <= 60; i += 3) {
      setProgress(i);
      await new Promise((r) => setTimeout(r, 30));
    }

    // Медленнее до 85%
    for (let i = 60; i <= 85; i += 1) {
      setProgress(i);
      await new Promise((r) => setTimeout(r, 40));
    }

    // Ждём реальную загрузку шрифтов
    await document.fonts.ready;

    // Финальный рывок до 100%
    for (let i = 85; i <= 100; i += 2) {
      setProgress(i);
      await new Promise((r) => setTimeout(r, 20));
    }

    setProgress(100);

    // Задержка перед исчезновением
    await new Promise((r) => setTimeout(r, 300));
    setIsComplete(true);

    // Полностью убираем из DOM после анимации
    await new Promise((r) => setTimeout(r, 700));
    setIsHidden(true);
  }, []);

  useEffect(() => {
    runProgress();
  }, [runProgress]);

  // Не рендерим после полного скрытия
  if (isHidden) return null;

  return (
    <div
      role="progressbar"
      aria-live="polite"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050510] transition-transform duration-[600ms] ease-in-out"
      style={{
        transform: isComplete ? "translateY(-100%)" : "translateY(0)",
        pointerEvents: isComplete ? "none" : "auto",
      }}
    >
      {/* SVG-логотип "NF" с контурной анимацией */}
      <svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-12"
      >
        <defs>
          <linearGradient id="nf-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>

        {/* Буква N */}
        <path
          d="M5 70V10H15L45 55V10H55V70H45L15 25V70H5Z"
          stroke="url(#nf-gradient)"
          strokeWidth="2"
          fill={progress > 80 ? "url(#nf-gradient)" : "none"}
          className="transition-all duration-500"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: 300 - (progress / 100) * 300,
            fillOpacity: progress > 80 ? (progress - 80) / 20 : 0,
          }}
        />

        {/* Буква F */}
        <path
          d="M70 70V10H115V20H80V35H110V45H80V70H70Z"
          stroke="url(#nf-gradient)"
          strokeWidth="2"
          fill={progress > 80 ? "url(#nf-gradient)" : "none"}
          className="transition-all duration-500"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: 300 - (progress / 100) * 300,
            fillOpacity: progress > 80 ? (progress - 80) / 20 : 0,
          }}
        />
      </svg>

      {/* Счётчик процентов */}
      <div className="flex flex-col items-center gap-3">
        <span
          className="font-[family-name:var(--font-mono)] text-sm tabular-nums transition-colors duration-300"
          style={{
            color: progress === 100 ? "#F8FAFC" : "rgba(248, 250, 252, 0.4)",
          }}
        >
          {progress}%
        </span>

        {/* Линия прогресса */}
        <div className="h-0.5 w-48 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

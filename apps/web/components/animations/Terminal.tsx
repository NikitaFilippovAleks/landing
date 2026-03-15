"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TerminalLine {
  /** Промпт (например "$ " или "→ ") */
  prompt?: string;
  /** Текст строки */
  text: string;
  /** Подсветить строку (цветная) */
  highlight?: boolean;
}

interface TerminalProps {
  lines: TerminalLine[];
  /** Скорость набора символа (мс) */
  typingSpeed?: number;
  /** Задержка между строками (мс) */
  lineDelay?: number;
  /** Задержка перед стартом (мс) */
  startDelay?: number;
  className?: string;
}

/**
 * Имитация терминала с эффектом набора кода.
 * Запускается при попадании во вьюпорт через IntersectionObserver.
 */
export function Terminal({
  lines,
  typingSpeed = 50,
  lineDelay = 300,
  startDelay = 500,
  className = "",
}: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<
    { prompt?: string; text: string; highlight?: boolean }[]
  >([]);
  const [currentLineText, setCurrentLineText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Запуск анимации при попадании во вьюпорт
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setTimeout(() => setStarted(true), startDelay);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, startDelay]);

  // Анимация набора строк
  useEffect(() => {
    if (!started || currentLineIndex >= lines.length) return;

    // Если предпочитает без анимаций — показываем всё сразу
    if (prefersReduced) {
      setVisibleLines(lines);
      setCurrentLineIndex(lines.length);
      return;
    }

    const line = lines[currentLineIndex];
    if (currentLineText.length < line.text.length) {
      const timeout = setTimeout(() => {
        setCurrentLineText(line.text.substring(0, currentLineText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }

    // Строка набрана — добавляем в видимые и переходим к следующей
    const timeout = setTimeout(() => {
      setVisibleLines((prev) => [
        ...prev,
        { ...line, text: currentLineText },
      ]);
      setCurrentLineText("");
      setCurrentLineIndex((prev) => prev + 1);
    }, lineDelay);

    return () => clearTimeout(timeout);
  }, [started, currentLineIndex, currentLineText, lines, typingSpeed, lineDelay, prefersReduced]);

  const currentLine = lines[currentLineIndex];

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-xl border border-white/10 bg-[#0d0d14] backdrop-blur-sm ${className}`}
    >
      {/* Заголовок терминала с тремя точками */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/60" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
        <span className="h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-2 text-xs text-white/30">terminal</span>
      </div>

      {/* Содержимое */}
      <div className="p-4 font-mono text-sm leading-relaxed">
        {/* Уже набранные строки */}
        {visibleLines.map((line, i) => (
          <div key={i} className={line.highlight ? "text-cyan-400" : "text-white/60"}>
            {line.prompt && (
              <span className="text-green-400">{line.prompt}</span>
            )}
            {line.text}
          </div>
        ))}

        {/* Текущая набираемая строка */}
        {currentLine && started && currentLineIndex < lines.length && (
          <div className={currentLine.highlight ? "text-cyan-400" : "text-white/60"}>
            {currentLine.prompt && (
              <span className="text-green-400">{currentLine.prompt}</span>
            )}
            {currentLineText}
            <span className="animate-blink ml-0.5 inline-block w-[7px] h-[14px] bg-white/60 align-middle" />
          </div>
        )}
      </div>
    </div>
  );
}

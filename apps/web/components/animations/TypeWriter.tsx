"use client";

import { useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TypeWriterProps {
  /** Массив фраз для циклического набора */
  phrases: string[];
  /** Скорость набора символа (мс) */
  typingSpeed?: number;
  /** Скорость удаления символа (мс) */
  deletingSpeed?: number;
  /** Пауза между фразами (мс) */
  pauseTime?: number;
  className?: string;
}

/**
 * Компонент с эффектом печатающей машинки.
 * Циклически набирает и стирает фразы из массива.
 */
export function TypeWriter({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseTime = 2000,
  className,
}: TypeWriterProps) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const prefersReduced = useReducedMotion();

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      setText(currentPhrase.substring(0, text.length - 1));
    } else {
      setText(currentPhrase.substring(0, text.length + 1));
    }
  }, [text, phraseIndex, isDeleting, phrases]);

  useEffect(() => {
    // Если пользователь предпочитает без анимаций — показываем первую фразу
    if (prefersReduced) {
      setText(phrases[0]);
      return;
    }

    const currentPhrase = phrases[phraseIndex];

    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentPhrase) {
      // Фраза полностью набрана — ждём перед удалением
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      // Фраза полностью удалена — переходим к следующей
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, tick, typingSpeed, deletingSpeed, pauseTime, prefersReduced]);

  return (
    <span className={className}>
      {text}
      <span className="animate-blink ml-0.5 inline-block w-[2px] h-[1em] bg-current align-middle" />
    </span>
  );
}

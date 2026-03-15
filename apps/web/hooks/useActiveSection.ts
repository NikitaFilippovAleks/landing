"use client";

import { useState, useEffect } from "react";

const SECTION_IDS = ["about", "skills", "projects", "contacts"];

/**
 * Хук для определения активной секции при скролле.
 * Используется для подсветки текущего пункта навигации в Header.
 */
export function useActiveSection(): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      {
        // Верхний отступ для фиксированного хедера, нижний — чтобы секция
        // считалась активной, когда она занимает верхнюю половину экрана
        rootMargin: "-80px 0px -50% 0px",
        threshold: 0,
      },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return active;
}

"use client";

import { useState, useEffect } from "react";

interface MobileState {
  isMobile: boolean;
  isLowPower: boolean;
}

/**
 * Хук для определения мобильного устройства и слабого железа.
 * Используется для выбора между 3D-сценой и CSS-фоллбеком.
 */
export function useIsMobile(): MobileState {
  const [state, setState] = useState<MobileState>({
    isMobile: false,
    isLowPower: false,
  });

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const isLowPower =
        typeof navigator !== "undefined" &&
        "hardwareConcurrency" in navigator &&
        navigator.hardwareConcurrency <= 4;

      setState({ isMobile, isLowPower });
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return state;
}

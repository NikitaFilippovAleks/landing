"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTranslations } from "next-intl";
import { useActiveSection } from "@/hooks/useActiveSection";
import { LocaleSwitcher } from "./LocaleSwitcher";

// Ключи навигации — лейблы берутся из переводов
const NAV_KEYS = [
  { key: "about", href: "#about", id: "about" },
  { key: "skills", href: "#skills", id: "skills" },
  { key: "projects", href: "#projects", id: "projects" },
  { key: "contacts", href: "#contacts", id: "contacts" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();
  const { scrollY } = useScroll();
  const t = useTranslations("nav");

  // Изменение прозрачности фона при скролле
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-[#050510]/95"
          : "border-white/5 bg-[#050510]/80"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Логотип */}
        <a href="#" className="text-lg font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            NF
          </span>
          <span className="text-white/60">.dev</span>
        </a>

        {/* Десктопная навигация с индикатором активной секции */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_KEYS.map((item) => (
            <li key={item.href} className="relative">
              <a
                href={item.href}
                className={`text-sm transition-colors ${
                  activeSection === item.id
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {t(item.key)}
              </a>
              {/* Анимированный индикатор активной секции */}
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-orange-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Правая часть: переключатель языка + CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <a
            href="#contacts"
            className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          >
            {t("cta")}
          </a>
        </div>

        {/* Мобильное меню — кнопка */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Мобильное меню — выпадающее */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#050510]/95 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-4 px-6 py-6">
            {NAV_KEYS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg transition-colors hover:text-white ${
                    activeSection === item.id
                      ? "text-white"
                      : "text-white/80"
                  }`}
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
          {/* Переключатель языка в мобильном меню */}
          <div className="border-t border-white/5 px-6 py-4">
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}

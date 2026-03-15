"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";

const NAV_ITEMS = [
  { label: "О себе", href: "#about", id: "about" },
  { label: "Навыки", href: "#skills", id: "skills" },
  { label: "Проекты", href: "#projects", id: "projects" },
  { label: "Контакты", href: "#contacts", id: "contacts" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();
  const { scrollY } = useScroll();

  // Изменение прозрачности фона при скролле
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-[#0a0a0f]/95"
          : "border-white/5 bg-[#0a0a0f]/80"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Логотип */}
        <a href="#" className="text-lg font-bold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            NF
          </span>
          <span className="text-white/60">.dev</span>
        </a>

        {/* Десктопная навигация с индикатором активной секции */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="relative">
              <a
                href={item.href}
                className={`text-sm transition-colors ${
                  activeSection === item.id
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </a>
              {/* Анимированный индикатор активной секции */}
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contacts"
          className="hidden rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 md:block"
        >
          Связаться
        </a>

        {/* Мобильное меню — кнопка */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Меню"
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
        <div className="border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-4 px-6 py-6">
            {NAV_ITEMS.map((item) => (
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
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

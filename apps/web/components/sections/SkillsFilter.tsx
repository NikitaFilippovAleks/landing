"use client";

import { motion } from "framer-motion";

// Категории для фильтрации навыков
const CATEGORIES = [
  { key: "all", label: "all" },
  { key: "frontend", label: "frontend" },
  { key: "mobile", label: "mobile" },
  { key: "backend", label: "backend" },
  { key: "devops", label: "devops" },
] as const;

interface SkillsFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  /** Переведённые лейблы для каждого ключа фильтра */
  labels: Record<string, string>;
}

/**
 * Табы фильтрации навыков по категориям.
 * Использует Framer Motion layoutId для плавного перемещения индикатора.
 */
export function SkillsFilter({
  activeCategory,
  onCategoryChange,
  labels,
}: SkillsFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter skills by category"
      className="mb-10 flex flex-wrap justify-center gap-2"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          role="tab"
          aria-selected={activeCategory === cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
            activeCategory === cat.key
              ? "text-white"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          {/* Анимированный фон активного таба */}
          {activeCategory === cat.key && (
            <motion.div
              layoutId="skillsFilterBg"
              className="absolute inset-0 rounded-full border border-violet-500/30 bg-violet-500/10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {labels[cat.key] || cat.label}
          </span>
        </button>
      ))}
    </div>
  );
}

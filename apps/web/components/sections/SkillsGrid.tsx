"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import type { Skill } from "@portfolio/shared-types";
import { SkillsFilter } from "./SkillsFilter";
import { SkillCard } from "./SkillCard";

interface SkillsGridProps {
  skills: Skill[];
  /** Переведённые лейблы фильтра */
  filterLabels: Record<string, string>;
}

/**
 * Клиентская сетка навыков с фильтрацией по категориям.
 * Принимает данные от серверного родителя Skills.tsx.
 * Использует AnimatePresence для плавных переходов при смене фильтра.
 */
export function SkillsGrid({ skills, filterLabels }: SkillsGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  // Фильтруем навыки по выбранной категории
  const filteredSkills = useMemo(() => {
    if (activeCategory === "all") return skills;
    return skills.filter((skill) => skill.category === activeCategory);
  }, [skills, activeCategory]);

  return (
    <>
      {/* Табы фильтрации */}
      <SkillsFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        labels={filterLabels}
      />

      {/* Сетка карточек с анимацией */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </AnimatePresence>
      </div>

      {/* Пустое состояние */}
      {filteredSkills.length === 0 && (
        <p className="mt-8 text-center text-white/30">
          Нет навыков в этой категории
        </p>
      )}
    </>
  );
}

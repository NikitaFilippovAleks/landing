"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
 * При смене фильтра: все карточки исчезают, затем появляются новые.
 */
export function SkillsGrid({ skills, filterLabels }: SkillsGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  // Фильтруем навыки по выбранной категории
  const filteredSkills = useMemo(() => {
    if (activeCategory === "all") return skills;
    return skills.filter((skill) => skill.category === activeCategory);
  }, [skills, activeCategory]);

  // Высота грида рассчитывается по максимальному количеству элементов (все навыки)
  // чтобы при фильтрации не было сдвига контента ниже
  const maxRows = Math.ceil(skills.length / 5); // lg:grid-cols-5

  return (
    <>
      {/* Табы фильтрации */}
      <SkillsFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        labels={filterLabels}
      />

      {/* Сетка карточек с анимацией — фиксированная минимальная высота */}
      <div style={{ minHeight: `${maxRows * 7.5}rem` }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </motion.div>
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

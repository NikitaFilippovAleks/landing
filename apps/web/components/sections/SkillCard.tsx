"use client";

import { motion } from "framer-motion";
import type { Skill } from "@portfolio/shared-types";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiFlutter,
  SiNodedotjs,
  SiNestjs,
  SiPython,
  SiDocker,
  SiGit,
  SiPostgresql,
  SiFastapi,
  SiTailwindcss,
  SiFirebase,
  SiRedux,
  SiGraphql,
  SiFigma,
  SiDart,
} from "react-icons/si";
import type { IconType } from "react-icons";

// Маппинг названия иконки из API → компонент иконки + фирменный цвет бренда
const SKILL_MAP: Record<string, { icon: IconType; color: string }> = {
  react: { icon: SiReact, color: "#61DAFB" },
  nextjs: { icon: SiNextdotjs, color: "#FFFFFF" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  flutter: { icon: SiFlutter, color: "#02569B" },
  dart: { icon: SiDart, color: "#0175C2" },
  "react-native": { icon: SiReact, color: "#61DAFB" },
  reactnative: { icon: SiReact, color: "#61DAFB" },
  nodejs: { icon: SiNodedotjs, color: "#339933" },
  "node.js": { icon: SiNodedotjs, color: "#339933" },
  nestjs: { icon: SiNestjs, color: "#E0234E" },
  python: { icon: SiPython, color: "#3776AB" },
  docker: { icon: SiDocker, color: "#2496ED" },
  git: { icon: SiGit, color: "#F05032" },
  postgresql: { icon: SiPostgresql, color: "#4169E1" },
  postgres: { icon: SiPostgresql, color: "#4169E1" },
  fastapi: { icon: SiFastapi, color: "#009688" },
  tailwindcss: { icon: SiTailwindcss, color: "#06B6D4" },
  tailwind: { icon: SiTailwindcss, color: "#06B6D4" },
  firebase: { icon: SiFirebase, color: "#FFCA28" },
  redux: { icon: SiRedux, color: "#764ABC" },
  graphql: { icon: SiGraphql, color: "#E10098" },
  figma: { icon: SiFigma, color: "#F24E1E" },
};

interface SkillCardProps {
  skill: Skill;
}

/**
 * Карточка навыка с SVG-иконкой технологии и фирменным цветом бренда.
 * При hover: поднимается, появляется glow в фирменном цвете.
 */
export function SkillCard({ skill }: SkillCardProps) {
  // Нормализуем имя иконки для поиска в маппинге
  const iconKey = skill.icon?.toLowerCase().replace(/[\s.]/g, "") || skill.name.toLowerCase().replace(/[\s.]/g, "");
  const mapped = SKILL_MAP[iconKey] || SKILL_MAP[skill.name.toLowerCase().replace(/[\s.]/g, "")];

  const IconComponent = mapped?.icon;
  const brandColor = mapped?.color || "#A855F7";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className="group relative flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06]"
      style={{
        // Glow-эффект при hover через CSS переменную
        "--glow-color": brandColor,
      } as React.CSSProperties}
    >
      {/* Glow-подсветка за иконкой при hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 30px ${brandColor}15, 0 0 60px ${brandColor}08`,
        }}
      />

      {/* Иконка технологии */}
      <div className="relative z-10 flex h-12 w-12 items-center justify-center">
        {IconComponent ? (
          <IconComponent
            size={32}
            className="transition-all duration-300 group-hover:scale-110"
            style={{
              color: `${brandColor}99`,
              filter: "brightness(0.8)",
            }}
            // При hover — полный цвет
            onMouseEnter={(e) => {
              const target = e.currentTarget as SVGElement;
              target.style.color = brandColor;
              target.style.filter = "brightness(1) drop-shadow(0 0 8px " + brandColor + "40)";
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as SVGElement;
              target.style.color = `${brandColor}99`;
              target.style.filter = "brightness(0.8)";
            }}
          />
        ) : (
          // Фоллбек: первая буква названия
          <span
            className="text-2xl font-bold"
            style={{ color: brandColor }}
          >
            {skill.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Название технологии */}
      <span className="relative z-10 text-center text-xs font-medium text-white/60 transition-colors duration-300 group-hover:text-white/90">
        {skill.name}
      </span>
    </motion.div>
  );
}

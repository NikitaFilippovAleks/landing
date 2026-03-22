import { getTranslations } from "next-intl/server";
import type { Skill } from "@portfolio/shared-types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { TiltCard } from "@/components/animations/TiltCard";
import { AnimatedProgressBar } from "./AnimatedProgressBar";

// Маппинг категорий на русский
const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  devops: "DevOps",
};

// Цвета для категорий
const CATEGORY_COLORS: Record<string, string> = {
  frontend: "from-purple-500 to-blue-500",
  backend: "from-green-500 to-emerald-500",
  mobile: "from-blue-500 to-cyan-500",
  devops: "from-orange-500 to-yellow-500",
};

interface SkillsProps {
  skills: Skill[];
}

export async function Skills({ skills }: SkillsProps) {
  const t = await getTranslations("skills");

  // Группируем навыки по категориям
  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      {/* Фоновое свечение */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-purple-500/5 blur-[128px]" />

      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              {t("title")}
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid gap-8 md:grid-cols-2">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <StaggerItem key={category}>
              <TiltCard className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                {/* Заголовок категории */}
                <h3 className="mb-6 text-lg font-semibold">
                  <span
                    className={`bg-gradient-to-r ${CATEGORY_COLORS[category] || "from-white to-white/60"} bg-clip-text text-transparent`}
                  >
                    {CATEGORY_LABELS[category] || category}
                  </span>
                </h3>

                {/* Навыки */}
                <div className="space-y-4">
                  {categorySkills.map((skill, index) => (
                    <div key={skill.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-white/80">
                          {skill.name}
                        </span>
                        <span className="text-xs text-white/40">
                          {skill.level}%
                        </span>
                      </div>
                      {/* Анимированный прогресс-бар */}
                      <AnimatedProgressBar
                        level={skill.level}
                        colorClass={
                          CATEGORY_COLORS[category] ||
                          "from-white/40 to-white/20"
                        }
                        delay={index * 0.05}
                      />
                    </div>
                  ))}
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

import { getTranslations } from "next-intl/server";
import type { Skill } from "@portfolio/shared-types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SkillsGrid } from "./SkillsGrid";

interface SkillsProps {
  skills: Skill[];
}

/**
 * Секция навыков — серверный компонент.
 * Получает переводы и передаёт данные в клиентский SkillsGrid
 * для интерактивной фильтрации и анимаций.
 */
export async function Skills({ skills }: SkillsProps) {
  const t = await getTranslations("skills");

  // Собираем переведённые лейблы для фильтра
  const filterLabels: Record<string, string> = {
    all: t("filter_all"),
    frontend: t("filter_frontend"),
    mobile: t("filter_mobile"),
    backend: t("filter_backend"),
    devops: t("filter_devops"),
  };

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      {/* Фоновое свечение */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-violet-500/5 blur-[128px]" />

      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              {t("title")}
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-violet-500 to-orange-500" />
          </div>
        </ScrollReveal>

        {/* Клиентская сетка с фильтрацией */}
        <SkillsGrid skills={skills} filterLabels={filterLabels} />
      </div>
    </section>
  );
}

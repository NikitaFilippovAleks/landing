import { getTranslations } from "next-intl/server";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";

interface AboutProps {
  text: string;
}

/**
 * Секция "О себе" — open layout без glassmorphism.
 * Текст слева, цифровой дашборд справа.
 */
export async function About({ text }: AboutProps) {
  const t = await getTranslations("about");

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Заголовок секции */}
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              {t("title")}
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-violet-500 to-orange-500" />
          </div>
        </ScrollReveal>

        {/* Open layout: текст + дашборд */}
        <div className="grid items-start gap-12 lg:grid-cols-12">
          {/* Левая часть — текст о себе */}
          <ScrollReveal delay={0.15} className="lg:col-span-7">
            <p className="font-[family-name:var(--font-display)] text-xl leading-relaxed text-white/70 sm:text-2xl">
              {text}
            </p>
          </ScrollReveal>

          {/* Правая часть — цифровой дашборд */}
          <ScrollReveal delay={0.3} className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Опыт */}
              <div className="rounded-xl border border-violet-500/10 bg-violet-500/[0.04] p-5">
                <div className="mb-1 font-[family-name:var(--font-display)] text-3xl font-bold text-violet-400">
                  <AnimatedCounter target={5} suffix="+" />
                </div>
                <div className="text-sm text-white/40">
                  {t("experience")}
                </div>
              </div>

              {/* Проекты */}
              <div className="rounded-xl border border-orange-500/10 bg-orange-500/[0.04] p-5">
                <div className="mb-1 font-[family-name:var(--font-display)] text-3xl font-bold text-orange-400">
                  <AnimatedCounter target={20} suffix="+" />
                </div>
                <div className="text-sm text-white/40">
                  {t("projects_count")}
                </div>
              </div>

              {/* Фреймворки */}
              <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.04] p-5">
                <div className="mb-1 font-[family-name:var(--font-display)] text-3xl font-bold text-cyan-400">
                  <AnimatedCounter target={4} />
                </div>
                <div className="text-sm text-white/40">
                  {t("frameworks")}
                </div>
              </div>

              {/* Мотивация */}
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-5">
                <div className="mb-1 font-[family-name:var(--font-display)] text-3xl font-bold text-emerald-400">
                  &infin;
                </div>
                <div className="text-sm text-white/40">
                  {t("motivation")}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

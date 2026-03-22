import { getTranslations } from "next-intl/server";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";

interface AboutProps {
  text: string;
}

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
            <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-3xl">
          {/* Glassmorphism-карточка */}
          <ScrollReveal delay={0.15}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:p-10">
              <p className="text-lg leading-relaxed text-white/70">{text}</p>

              {/* Статистика с анимированными счётчиками */}
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/5 pt-8 sm:grid-cols-4">
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    <AnimatedCounter target={5} suffix="+" />
                  </div>
                  <div className="mt-1 text-sm text-white/40">
                    {t("experience")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    <AnimatedCounter target={20} suffix="+" />
                  </div>
                  <div className="mt-1 text-sm text-white/40">
                    {t("projects_count")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    <AnimatedCounter target={4} />
                  </div>
                  <div className="mt-1 text-sm text-white/40">
                    {t("frameworks")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    &infin;
                  </div>
                  <div className="mt-1 text-sm text-white/40">
                    {t("motivation")}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

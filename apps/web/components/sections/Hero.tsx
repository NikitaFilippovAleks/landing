import { getTranslations } from "next-intl/server";
import { SceneContainer } from "@/components/three/SceneContainer";
import { TypeWriter } from "@/components/animations/TypeWriter";
import { HeroButtons } from "./HeroButtons";

interface HeroProps {
  title: string;
  subtitle: string;
}

/**
 * Hero-секция — полноэкранная, тёмная, с 3D NoiseSphere.
 * Стиль вдохновлён Loris Bukvic: крупная типография + 3D-объект + неоновые свечения.
 */
export async function Hero({ title, subtitle }: HeroProps) {
  const t = await getTranslations("hero");

  // Фразы для TypeWriter из переводов
  const typewriterPhrases = [
    t("typewriter.0"),
    t("typewriter.1"),
    t("typewriter.2"),
    t("typewriter.3"),
  ];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* 3D-сцена (desktop) или CSS blob-анимация (mobile) */}
      <SceneContainer />

      {/* Неоновое свечение за 3D-объектом (сдвинуто правее) */}
      <div className="pointer-events-none absolute left-[55%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-violet-500/15 blur-[200px]" />
      <div className="pointer-events-none absolute left-[65%] top-[35%] h-[250px] w-[250px] rounded-full bg-orange-500/8 blur-[150px]" />

      {/* Сетка на фоне */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="max-w-xl lg:ml-0">
          {/* Бейдж */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.06] px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-sm text-white/60">{t("badge")}</span>
          </div>

          {/* Заголовок — крупный, Space Grotesk */}
          <h1 className="mb-6 font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tighter">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          {/* TypeWriter — стилизован как терминальная строка */}
          <div className="mb-10 h-8">
            <div className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-mono)] text-violet-400/60">
                {">"}_
              </span>
              <TypeWriter
                phrases={typewriterPhrases}
                className="font-[family-name:var(--font-mono)] text-lg text-cyan-400/80 sm:text-xl"
              />
            </div>
          </div>

          {/* Скрытый текст для SEO */}
          <p className="sr-only">{subtitle}</p>

          {/* CTA-кнопки */}
          <HeroButtons />
        </div>
      </div>

      {/* Стрелка вниз */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a
          href="#about"
          className="text-white/20 transition-colors hover:text-white/40"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-bounce"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </a>
      </div>
    </section>
  );
}

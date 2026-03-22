import { getTranslations } from "next-intl/server";
import { SceneContainer } from "@/components/three/SceneContainer";
import { TypeWriter } from "@/components/animations/TypeWriter";
import { Terminal } from "@/components/animations/Terminal";
import { HeroButtons } from "./HeroButtons";

interface HeroProps {
  title: string;
  subtitle: string;
}

export async function Hero({ title, subtitle }: HeroProps) {
  const t = await getTranslations("hero");

  // Фразы для TypeWriter из переводов
  const typewriterPhrases = [
    t("typewriter.0"),
    t("typewriter.1"),
    t("typewriter.2"),
    t("typewriter.3"),
  ];

  // Строки для терминала
  const terminalLines = [
    { prompt: "$ ", text: "whoami" },
    { text: "Frontend & Mobile Developer", highlight: true },
    { prompt: "$ ", text: "cat skills.json" },
    { text: '{ "frontend": ["React", "Next.js", "TypeScript"],' },
    { text: '  "mobile": ["Flutter", "React Native"],' },
    { text: '  "backend": ["Node.js", "NestJS", "Python"] }' },
    { prompt: "$ ", text: "echo $STATUS" },
    { text: t("terminal_status"), highlight: true },
  ];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* 3D-сцена (desktop) или CSS blob-анимация (mobile) */}
      <SceneContainer />

      {/* Сетка на фоне */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Левая колонка — текст */}
          <div className="text-center lg:text-left">
            {/* Бейдж */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-sm text-white/60">{t("badge")}</span>
            </div>

            {/* Заголовок — серверный компонент для SEO */}
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>

            {/* TypeWriter — клиентский компонент */}
            <div className="mx-auto mb-10 h-8 max-w-2xl lg:mx-0">
              <TypeWriter
                phrases={typewriterPhrases}
                className="text-lg text-white/60 sm:text-xl"
              />
            </div>

            {/* Скрытый текст для SEO (TypeWriter его не покажет поисковикам) */}
            <p className="sr-only">{subtitle}</p>

            {/* CTA-кнопки — клиентский компонент для hover-анимаций */}
            <HeroButtons />
          </div>

          {/* Правая колонка — терминал (скрыт на мобильных) */}
          <div className="hidden lg:block">
            <Terminal lines={terminalLines} className="w-full" />
          </div>
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

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Contacts } from "@/components/sections/Contacts";
import { getSkills, getProjects, getSettings } from "@/lib/api";

// Fallback-данные на случай, если API недоступен (первый запуск без бэкенда)
const FALLBACK_SETTINGS = {
  hero_title: "Frontend & Mobile Developer",
  hero_subtitle: "Создаю современные веб и мобильные приложения",
  about_text:
    "Я программист-инженер, специализирующийся на фронтенд и мобильной разработке. Создаю быстрые, красивые и удобные интерфейсы.",
  email: "contact@example.com",
  github_url: "https://github.com/NikitaFilippovAleks",
  telegram_url: "",
  linkedin_url: "",
};

async function getPortfolioData(locale: string) {
  try {
    const [skills, projects, settings] = await Promise.all([
      getSkills(locale),
      getProjects(locale),
      getSettings(locale),
    ]);
    return { skills, projects, settings };
  } catch {
    // Если API недоступен — используем fallback
    return {
      skills: [],
      projects: [],
      settings: FALLBACK_SETTINGS,
    };
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { skills, projects, settings } = await getPortfolioData(locale);

  return (
    <main>
      <Hero
        title={settings.hero_title || FALLBACK_SETTINGS.hero_title}
        subtitle={settings.hero_subtitle || FALLBACK_SETTINGS.hero_subtitle}
      />
      <About text={settings.about_text || FALLBACK_SETTINGS.about_text} />
      {skills.length > 0 && <Skills skills={skills} />}
      {projects.length > 0 && <Projects projects={projects} />}
      <Contacts
        email={settings.email || ""}
        githubUrl={settings.github_url || ""}
        telegramUrl={settings.telegram_url || ""}
        linkedinUrl={settings.linkedin_url || ""}
      />

      {/* JSON-LD Structured Data для SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Nikita Filippov",
            jobTitle: "Frontend & Mobile Developer",
            sameAs: [
              settings.github_url,
              settings.linkedin_url,
              settings.telegram_url,
            ].filter(Boolean),
            knowsAbout: [
              "React",
              "Next.js",
              "TypeScript",
              "Flutter",
              "React Native",
              "Node.js",
              "Docker",
            ],
          }),
        }}
      />
    </main>
  );
}

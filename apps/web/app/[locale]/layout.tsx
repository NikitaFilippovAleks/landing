import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { routing } from "@/i18n/routing";
import { getSettings } from "@/lib/api";

// Шрифты
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

// Фолбэк-значения для SEO
const FALLBACK_TITLE = "Nikita Filippov — Frontend & Mobile Developer";
const FALLBACK_DESCRIPTION: Record<string, string> = {
  ru: "Портфолио фронтенд и мобильного разработчика. React, Next.js, Flutter, React Native.",
  en: "Frontend and mobile developer portfolio. React, Next.js, Flutter, React Native.",
};
const FALLBACK_SITE_URL = "https://nikitafilippov.dev";

// Генерация метаданных с учётом локали
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getSettings(locale);

  const siteUrl = settings.site_url || FALLBACK_SITE_URL;
  const title = settings.meta_title || FALLBACK_TITLE;
  const description = settings.meta_description || FALLBACK_DESCRIPTION[locale] || FALLBACK_DESCRIPTION.en;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}/${locale}`,
      locale: locale === "ru" ? "ru_RU" : "en_US",
    },
  };
}

// Статическая генерация для всех локалей
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Проверяем, что локаль поддерживается
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Загружаем все сообщения для текущей локали
  const messages = await getMessages();

  return (
    <div
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}
    >
      <NextIntlClientProvider messages={messages}>
        <LenisProvider>
          <LoadingScreen />
          <CustomCursor />
          <Header />
          {children}
          <Footer />
        </LenisProvider>
      </NextIntlClientProvider>
    </div>
  );
}

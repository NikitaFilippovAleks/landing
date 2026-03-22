import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { routing } from "@/i18n/routing";

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

// Генерация метаданных с учётом локали
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });

  const title = "Nikita Filippov — Frontend & Mobile Developer";
  const description =
    locale === "ru"
      ? "Портфолио фронтенд и мобильного разработчика. React, Next.js, Flutter, React Native."
      : "Frontend and mobile developer portfolio. React, Next.js, Flutter, React Native.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
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

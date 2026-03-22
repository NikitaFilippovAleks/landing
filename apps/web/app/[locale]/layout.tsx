import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

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
    <NextIntlClientProvider messages={messages}>
      <Header />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}

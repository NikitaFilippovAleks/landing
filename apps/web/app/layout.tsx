import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Nikita Filippov — Frontend & Mobile Developer",
  description:
    "Портфолио фронтенд и мобильного разработчика. React, Next.js, Flutter, React Native.",
  openGraph: {
    title: "Nikita Filippov — Frontend & Mobile Developer",
    description:
      "Портфолио фронтенд и мобильного разработчика. React, Next.js, Flutter, React Native.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark scroll-smooth">
      <body
        className={`${inter.className} bg-[#0a0a0f] text-white antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

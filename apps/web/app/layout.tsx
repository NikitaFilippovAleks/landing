import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
};

// Корневой layout — минимальный, без Header/Footer
// Header и Footer находятся в [locale]/layout.tsx с поддержкой i18n
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark scroll-smooth">
      <body className="bg-[#050510] text-white antialiased">{children}</body>
    </html>
  );
}

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Standalone output для Docker-образа
  output: "standalone",
  // Транспиляция workspace-пакетов (TypeScript-исходники)
  transpilePackages: ["@portfolio/shared-types"],
  // Загрузка изображений с внешних источников
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

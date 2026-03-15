import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;

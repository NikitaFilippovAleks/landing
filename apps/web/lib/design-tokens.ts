/**
 * Цветовые токены палитры "Electric Neon".
 * Единый источник правды для всех цветов дизайна.
 */
export const colors = {
  bg: "#050510",
  accent: { from: "#7C3AED", to: "#A855F7" },
  orange: { from: "#F97316", to: "#FB923C" },
  cyan: "#06B6D4",
  text: { primary: "#F8FAFC", secondary: "#94A3B8" },
  surface: "rgba(124, 58, 237, 0.08)",
} as const;

/**
 * Фирменные цвета технологий для секции навыков.
 * Ключ — значение поля skill.icon из API.
 */
export const techBrandColors: Record<string, string> = {
  react: "#61DAFB",
  nextjs: "#FFFFFF",
  typescript: "#3178C6",
  javascript: "#F7DF1E",
  flutter: "#02569B",
  dart: "#0175C2",
  "react-native": "#61DAFB",
  nodejs: "#339933",
  nestjs: "#E0234E",
  python: "#3776AB",
  docker: "#2496ED",
  git: "#F05032",
  postgresql: "#4169E1",
  fastapi: "#009688",
  tailwindcss: "#06B6D4",
  firebase: "#FFCA28",
  redux: "#764ABC",
  graphql: "#E10098",
  figma: "#F24E1E",
};

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * CTA-кнопки Hero-секции с hover-анимациями Framer Motion.
 * Выделены в отдельный клиентский компонент, чтобы Hero оставался серверным.
 */
export function HeroButtons() {
  const t = useTranslations("hero");

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center">
      <motion.a
        href="#projects"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3.5 font-medium transition-shadow hover:shadow-lg hover:shadow-purple-500/25"
      >
        {t("cta_projects")}
      </motion.a>
      <motion.a
        href="#contacts"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 font-medium backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
      >
        {t("cta_contact")}
      </motion.a>
    </div>
  );
}

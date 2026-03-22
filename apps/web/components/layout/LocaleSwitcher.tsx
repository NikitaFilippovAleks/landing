"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

/**
 * Переключатель языка — кнопки RU / EN в glassmorphism-стиле.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
      <button
        onClick={() => switchLocale("ru")}
        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
          locale === "ru"
            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            : "text-white/60 hover:text-white"
        }`}
      >
        RU
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
          locale === "en"
            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            : "text-white/60 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}

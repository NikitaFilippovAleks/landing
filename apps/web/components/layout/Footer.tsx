import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear().toString();

  return (
    <footer className="border-t border-white/5 bg-[#050510]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">
            {t("rights", { year })}
          </p>
          <p className="text-sm text-white/40">
            {t("madeWith")}{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Next.js
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              FastAPI
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

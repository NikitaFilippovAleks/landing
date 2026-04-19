import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSettings } from "@/lib/api";

const FALLBACK_SITE_URL = "https://nikitafilippov.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const siteUrl = settings.site_url || FALLBACK_SITE_URL;

  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },
  }));
}

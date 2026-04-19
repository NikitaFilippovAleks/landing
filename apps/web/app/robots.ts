import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/api";

const FALLBACK_SITE_URL = "https://nikitafilippov.dev";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const siteUrl = settings.site_url || FALLBACK_SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

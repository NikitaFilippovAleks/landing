import type { Skill, Project, SiteSetting } from "@portfolio/shared-types";

// В dev-контейнере Next.js и FastAPI работают в одном контейнере → localhost
// В production будут в разных контейнерах → API_URL задаётся через env
const API_URL = process.env.API_URL || "http://localhost:8000";

async function fetchApi<T>(path: string, locale = "en"): Promise<T> {
  const separator = path.includes("?") ? "&" : "?";
  const url = `${API_URL}${path}${separator}locale=${locale}`;

  const res = await fetch(url, {
    next: { tags: ["portfolio"] },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getSkills(locale = "en"): Promise<Skill[]> {
  return fetchApi<Skill[]>("/api/v1/skills", locale);
}

export async function getProjects(locale = "en"): Promise<Project[]> {
  return fetchApi<Project[]>("/api/v1/projects", locale);
}

export async function getSettings(locale = "en"): Promise<Record<string, string>> {
  const settings = await fetchApi<SiteSetting[]>("/api/v1/settings", locale);
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

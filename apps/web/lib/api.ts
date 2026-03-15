import type { Skill, Project, SiteSetting } from "@portfolio/shared-types";

// В dev-контейнере Next.js и FastAPI работают в одном контейнере → localhost
// В production будут в разных контейнерах → API_URL задаётся через env
const API_URL = process.env.API_URL || "http://localhost:8000";

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { tags: ["portfolio"] },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getSkills(): Promise<Skill[]> {
  return fetchApi<Skill[]>("/api/v1/skills");
}

export async function getProjects(): Promise<Project[]> {
  return fetchApi<Project[]>("/api/v1/projects");
}

export async function getSettings(): Promise<Record<string, string>> {
  const settings = await fetchApi<SiteSetting[]>("/api/v1/settings");
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

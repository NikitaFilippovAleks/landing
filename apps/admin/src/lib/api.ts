import type { Skill, Project, SiteSetting, TokenResponse } from "@portfolio/shared-types";
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearTokens,
} from "./auth";

// В dev: VITE_API_URL=http://localhost:8000 (из docker-compose.dev.yml)
// В prod: VITE_API_URL задаётся при сборке образа (GitHub Actions)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ---------- Базовый fetch с авторизацией ----------

async function fetchApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Если 401 — пробуем обновить access token через refresh
  if (res.status === 401) {
    if (getRefreshToken()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${getAccessToken()}`;
        res = await fetch(`${API_URL}${path}`, { ...options, headers });
      } else {
        clearTokens();
        window.location.href = "/login";
        throw new Error("Сессия истекла");
      }
    } else {
      // Нет refresh token — сессия недействительна
      clearTokens();
      window.location.href = "/login";
      throw new Error("Требуется авторизация");
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Ошибка ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: getRefreshToken() }),
    });
    if (!res.ok) return false;
    const data: TokenResponse = await res.json();
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ---------- Аутентификация ----------

export async function login(email: string, password: string): Promise<void> {
  const data = await fetchApi<TokenResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAccessToken(data.access_token);
  setRefreshToken(data.refresh_token);
}

export function logout() {
  clearTokens();
}

// ---------- Навыки ----------

export async function getSkills(): Promise<Skill[]> {
  return fetchApi<Skill[]>("/api/v1/admin/skills");
}

export async function createSkill(
  data: Omit<Skill, "id">,
): Promise<Skill> {
  return fetchApi<Skill>("/api/v1/admin/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSkill(
  id: string,
  data: Partial<Omit<Skill, "id">>,
): Promise<Skill> {
  return fetchApi<Skill>(`/api/v1/admin/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(id: string): Promise<void> {
  return fetchApi<void>(`/api/v1/admin/skills/${id}`, {
    method: "DELETE",
  });
}

export async function reorderSkills(
  ids: string[],
): Promise<void> {
  return fetchApi<void>("/api/v1/admin/skills/reorder", {
    method: "PATCH",
    body: JSON.stringify({ ids }),
  });
}

// ---------- Проекты ----------

export async function getProjects(): Promise<Project[]> {
  return fetchApi<Project[]>("/api/v1/admin/projects");
}

export async function createProject(
  data: Omit<Project, "id">,
): Promise<Project> {
  return fetchApi<Project>("/api/v1/admin/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id">>,
): Promise<Project> {
  return fetchApi<Project>(`/api/v1/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string): Promise<void> {
  return fetchApi<void>(`/api/v1/admin/projects/${id}`, {
    method: "DELETE",
  });
}

// ---------- Настройки ----------

export async function getSettings(): Promise<SiteSetting[]> {
  return fetchApi<SiteSetting[]>("/api/v1/admin/settings");
}

export async function updateSetting(
  key: string,
  value: string,
): Promise<SiteSetting> {
  return fetchApi<SiteSetting>(`/api/v1/admin/settings/${key}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
  });
}

// Типы, общие для лендинга и админки

// --- Публичные типы (плоские, с подставленным переводом) ---

export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "mobile" | "devops";
  icon: string;
  level: number;
  order: number;
  is_visible: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  short_description: string;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  tags: string[];
  order: number;
  is_visible: boolean;
  is_featured: boolean;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  locale: string | null;
}

// --- Типы переводов (для админки) ---

export interface SkillTranslation {
  locale: string;
  name: string;
}

export interface ProjectTranslation {
  locale: string;
  title: string;
  description: string;
  short_description: string;
  tags: string[];
}

export interface SkillAdmin {
  id: string;
  name: string; // fallback
  category: "frontend" | "backend" | "mobile" | "devops";
  icon: string;
  level: number;
  order: number;
  is_visible: boolean;
  translations: SkillTranslation[];
}

export interface ProjectAdmin {
  id: string;
  title: string; // fallback
  description: string;
  short_description: string;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  tags: string[]; // fallback
  order: number;
  is_visible: boolean;
  is_featured: boolean;
  translations: ProjectTranslation[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

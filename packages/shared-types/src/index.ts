// Типы, общие для лендинга и админки

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
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

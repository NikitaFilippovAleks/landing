import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Навигационные хелперы с поддержкой локалей
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

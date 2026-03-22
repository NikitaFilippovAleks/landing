"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SocialLinkProps {
  href: string;
  label: string;
  children: ReactNode;
}

/**
 * Ссылка на соцсеть с spring hover-анимацией (подъём + увеличение).
 */
export function SocialLink({ href, label, children }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -3, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-white/50 transition-colors hover:border-violet-500/30 hover:bg-violet-500/[0.06] hover:text-violet-300"
    >
      {children}
    </motion.a>
  );
}

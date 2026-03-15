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
      className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/50 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      {children}
    </motion.a>
  );
}

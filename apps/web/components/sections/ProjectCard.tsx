"use client";

import { motion } from "framer-motion";
import type { Project } from "@portfolio/shared-types";

interface ProjectCardProps {
  project: Project;
}

/**
 * Карточка проекта с hover-анимацией (подъём + свечение).
 */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.12)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.07]"
    >
      {/* Превью-изображение */}
      {project.image_url && (
        <div className="aspect-video overflow-hidden border-b border-white/5">
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6">
        {/* Featured бейдж */}
        {project.is_featured && (
          <span className="mb-3 inline-block rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-3 py-1 text-xs font-medium text-purple-300">
            Избранный проект
          </span>
        )}

        <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>

        <p className="mb-4 text-sm leading-relaxed text-white/50">
          {project.is_featured
            ? project.description
            : project.short_description}
        </p>

        {/* Теги */}
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Ссылки */}
        <div className="flex gap-4">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

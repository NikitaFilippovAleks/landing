import type { Project } from "@portfolio/shared-types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { ProjectCard } from "./ProjectCard";

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  // Выделенные проекты первыми
  const sorted = [...projects].sort(
    (a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0),
  );

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      {/* Фоновое свечение */}
      <div className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/5 blur-[128px]" />

      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Проекты</h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid gap-6 md:grid-cols-2">
          {sorted.map((project) => (
            <StaggerItem
              key={project.id}
              className={project.is_featured ? "md:col-span-2" : ""}
            >
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

import Image from "next/image";
import { projects } from "@/data/projects";
import { ScrollReveal } from "./scroll-reveal";

function ProjectCard({ project, layout }: { project: typeof projects[0]; layout: "full" | "half" }) {
  const isFullWidth = layout === "full";

  return (
    <a href={project.href} target="_blank" rel="noopener noreferrer" className="group block">
      <div
        className="rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-muted)] transition-colors"
      >
        {/* Project image */}
        <div
          className={`relative bg-[var(--color-card)] ${
            isFullWidth ? "aspect-[16/9]" : "aspect-[4/3]"
          } overflow-hidden`}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={isFullWidth ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-[var(--color-muted)] text-sm uppercase tracking-widest">
                Image →
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
            Project
          </span>
          <h3 className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold mt-1.5 mb-2 group-hover:text-[var(--color-accent)] transition-colors">
            {project.title}
          </h3>
          <p className="text-[var(--color-muted)] mb-3 leading-relaxed text-sm">
            {project.description}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center text-xs font-medium text-[var(--color-accent)] group-hover:gap-2 transition-all">
            View Project <span className="ml-1">→</span>
          </span>
        </div>
      </div>
    </a>
  );
}

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const regular = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-12">
            Featured Work
          </h2>
        </ScrollReveal>

        <div className="space-y-8">
          {/* First featured project: full width */}
          {featured[0] && (
            <ScrollReveal>
              <ProjectCard project={featured[0]} layout="full" />
            </ScrollReveal>
          )}

          {/* Regular projects: two-column grid */}
          {regular.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regular.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 0.1}>
                  <ProjectCard project={project} layout="half" />
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Last featured project: full width */}
          {featured[1] && (
            <ScrollReveal>
              <ProjectCard project={featured[1]} layout="full" />
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}

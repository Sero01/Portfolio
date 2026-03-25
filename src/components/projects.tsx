import { projects } from "@/data/projects";
import { ScrollReveal } from "./scroll-reveal";

export function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight mb-16">
            Selected Work
          </h2>
        </ScrollReveal>
        <div className="space-y-16">
          {projects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 0.1}>
              <a href={project.href} className="group block">
                <div className="border border-[var(--color-border)] rounded-2xl p-8 sm:p-10 hover:border-[var(--color-muted)] transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl font-bold text-[var(--color-border)] group-hover:text-[var(--color-muted)] transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                      {project.readTime}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[var(--color-muted)] mb-6 max-w-2xl">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.metric && (
                    <div className="pt-6 border-t border-[var(--color-border)]">
                      <span className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold">
                        {project.metric}
                      </span>
                      <span className="ml-3 text-sm text-[var(--color-muted)]">
                        {project.metricLabel}
                      </span>
                    </div>
                  )}
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

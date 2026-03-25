import { projects } from "@/data/projects";
import { ScrollReveal } from "./scroll-reveal";

function ProjectCard({ project, layout }: { project: typeof projects[0]; layout: "full" | "half" }) {
  const isFullWidth = layout === "full";

  return (
    <a href={project.href} className="group block">
      <div
        className={`rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-muted)] transition-colors ${
          isFullWidth ? "" : ""
        }`}
      >
        {/* Image placeholder */}
        <div
          className={`bg-[var(--color-card)] ${
            isFullWidth ? "aspect-[16/9]" : "aspect-[4/3]"
          } flex items-center justify-center`}
        >
          <span className="text-[var(--color-muted)] text-sm uppercase tracking-widest">
            Image →
          </span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Project
          </span>
          <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold mt-2 mb-3 group-hover:text-[var(--color-accent)] transition-colors">
            {project.title}
          </h3>
          <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center text-sm font-medium text-[var(--color-accent)] group-hover:gap-2 transition-all">
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
          <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-16">
            Featured Work
          </h2>
        </ScrollReveal>

        <div className="space-y-12">
          {/* First featured project: full width */}
          {featured[0] && (
            <ScrollReveal>
              <ProjectCard project={featured[0]} layout="full" />
            </ScrollReveal>
          )}

          {/* Regular projects: two-column grid */}
          {regular.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regular.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 0.1}>
                  <ProjectCard project={project} layout="half" />
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Last featured project: full width with purple bg */}
          {featured[1] && (
            <ScrollReveal>
              <div className="bg-[var(--color-purple)] rounded-2xl text-white overflow-hidden">
                <div className="aspect-[16/9] flex items-center justify-center bg-white/10">
                  <span className="text-white/50 text-sm uppercase tracking-widest">
                    Image →
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <span className="text-xs uppercase tracking-widest text-white/60">
                    Project
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold mt-2 mb-3">
                    {featured[1].title}
                  </h3>
                  <p className="text-white/70 mb-4 leading-relaxed">
                    {featured[1].description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {featured[1].tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-white/30 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center text-sm font-medium text-white">
                    View Project <span className="ml-1">→</span>
                  </span>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}

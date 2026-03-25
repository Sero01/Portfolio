import { skills } from "@/data/skills";
import { ScrollReveal } from "./scroll-reveal";

export function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Why Parvez
          </h2>
          <p className="text-[var(--color-muted)] text-lg mb-16 max-w-2xl">
            Technologies and competencies I bring to every project.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((category, index) => (
            <ScrollReveal key={category.category} delay={index * 0.1}>
              <div className="border border-[var(--color-border)] rounded-2xl p-8">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold mb-6 uppercase tracking-wider">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="text-[var(--color-muted)] flex items-center gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

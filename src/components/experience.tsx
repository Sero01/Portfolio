import { experience } from "@/data/experience";
import { ScrollReveal } from "./scroll-reveal";

export function Experience() {
  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight mb-16">
            Experience
          </h2>
        </ScrollReveal>
        <div className="space-y-0">
          {experience.map((item, index) => (
            <ScrollReveal key={`${item.year}-${item.company}`} delay={index * 0.1}>
              <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] gap-6 py-8 border-t border-[var(--color-border)] last:border-b">
                <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-[var(--color-muted)]">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                    {item.role}
                  </h3>
                  <p className="text-[var(--color-muted)] mt-1">{item.company}</p>
                  <p className="text-[var(--color-muted)] mt-3 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

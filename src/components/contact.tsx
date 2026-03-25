import { ScrollReveal } from "./scroll-reveal";

export function Contact() {
  return (
    <section id="contact" className="py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] uppercase">
            Interested in
            <br />
            working together?
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="mt-10">
            <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-3">
              Contact me:
            </p>
            <a
              href="mailto:hello@parvez.dev"
              className="inline-flex items-center gap-2 text-lg sm:text-xl font-medium hover:text-[var(--color-accent)] transition-colors"
            >
              hello@parvez.dev
              <span className="text-2xl">👋</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

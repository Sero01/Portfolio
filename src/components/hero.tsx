import { ScrollReveal } from "./scroll-reveal";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-4">
            Full-Stack Developer
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight max-w-4xl">
            Building modern web experiences with clean code.
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mt-8 text-lg sm:text-xl text-[var(--color-muted)] max-w-2xl leading-relaxed">
            I design and build full-stack applications that are fast, accessible, and delightful to use.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-10 flex gap-4">
            <a
              href="#projects"
              className="inline-flex items-center px-6 py-3 text-sm font-medium bg-[var(--color-fg)] text-[var(--color-bg)] rounded-full hover:opacity-90 transition-opacity"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 text-sm font-medium border border-[var(--color-border)] rounded-full hover:bg-[var(--color-card)] transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

import { ScrollReveal } from "./scroll-reveal";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <ScrollReveal>
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-display)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.95] tracking-tight">
              <span className="block" style={{ WebkitTextStroke: "2px var(--color-fg)", color: "transparent" }}>
                Design,
              </span>
              <span className="block text-[var(--color-accent)]">
                Build,
              </span>
              <span className="block">
                Innovate.
              </span>
            </h1>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-center mt-8 text-lg sm:text-xl text-[var(--color-muted)]">
            Full-Stack Developer crafting web apps &amp; AI-powered tools
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="flex justify-center gap-6 mt-6 text-3xl">
            <span>✨</span>
            <span>🚀</span>
            <span>💻</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

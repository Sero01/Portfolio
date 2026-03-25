import { socialLinks } from "@/data/social";
import { ScrollReveal } from "./scroll-reveal";

export function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Get in Touch
          </h2>
          <p className="text-[var(--color-muted)] text-lg mb-12 max-w-2xl">
            Interested in working together? Let&apos;s connect.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center px-6 py-3 text-sm font-medium border border-[var(--color-border)] rounded-full hover:bg-[var(--color-card)] hover:border-[var(--color-muted)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

import { ScrollReveal } from "./scroll-reveal";

export function Skills() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Bio */}
        <ScrollReveal>
          <div className="max-w-3xl">
            <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed">
              Hi, I am 👋 <strong className="font-[family-name:var(--font-display)]">Parvez</strong>, building apps for 7 years and
              still losing sleep over side projects. Focused on
              building web apps and AI-powered tools. A curious,
              hyperactive developer who&apos;s always got ideas
              brewing. When I&apos;m not shipping code, I&apos;m
              behind a camera 📷.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

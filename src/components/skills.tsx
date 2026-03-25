import { skills, softSkills } from "@/data/skills";
import { ScrollReveal } from "./scroll-reveal";

const sizeClasses = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-5 py-2.5",
  lg: "text-lg px-6 py-3 font-medium",
};

// Slight rotations for organic feel
const rotations = [
  "-rotate-2",
  "rotate-1",
  "-rotate-1",
  "rotate-2",
  "rotate-0",
  "-rotate-3",
  "rotate-3",
  "rotate-0",
  "-rotate-1",
  "rotate-2",
  "-rotate-2",
  "rotate-1",
  "rotate-0",
  "-rotate-1",
];

export function Skills() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Bio */}
        <ScrollReveal>
          <div className="max-w-3xl">
            <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed">
              Hi, I am 👋 <strong className="font-[family-name:var(--font-display)]">Parvez</strong>, coding
              for <span className="inline-flex items-center px-3 py-0.5 rounded-full border border-[var(--color-border)] text-sm font-medium align-middle">7 years</span> and
              still losing sleep over side projects. Focused on
              building web apps 🌐 and AI-powered tools 🤖. A curious,
              hyperactive developer who&apos;s always got ideas
              brewing ☕. When I&apos;m not shipping code, I&apos;m
              behind a camera 📷.
            </p>
          </div>
        </ScrollReveal>

        {/* Skills label */}
        <ScrollReveal delay={0.1}>
          <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mt-16 mb-8">
            with my skills in:
          </p>
        </ScrollReveal>

        {/* Skills cloud */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-3 items-center max-w-4xl">
            {skills.map((skill, i) => (
              <span
                key={skill.label}
                className={`${sizeClasses[skill.size || "md"]} ${rotations[i % rotations.length]} rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors cursor-default`}
              >
                {skill.label}
              </span>
            ))}
          </div>
        </ScrollReveal>

        {/* Soft skills with handwritten feel */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap gap-3 items-center mt-6 max-w-4xl">
            {softSkills.map((skill, i) => (
              <span
                key={skill.label}
                className={`${sizeClasses[skill.size || "md"]} ${rotations[(i + 5) % rotations.length]} italic text-[var(--color-muted)] cursor-default`}
              >
                {skill.label}
              </span>
            ))}
            <span className="text-4xl font-[family-name:var(--font-display)] text-[var(--color-muted)] ml-2">&amp;</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

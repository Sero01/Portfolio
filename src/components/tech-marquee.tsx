const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Spring Boot", icon: "🍃" },
  { name: "JavaScript", icon: "🟨" },
  { name: "Cloudflare", icon: "☁️" },
  { name: "Python", icon: "🐍" },
  { name: "Claude", icon: "🤖" },
];

export function TechMarquee() {
  return (
    <section className="py-12 border-y border-[var(--color-border)] overflow-hidden">
      <div
        className="flex gap-16 hover:[animation-play-state:paused]"
        style={{
          animation: "marquee 20s linear infinite",
          width: "max-content",
        }}
      >
        {/* Duplicate items for seamless loop */}
        {[...techStack, ...techStack, ...techStack, ...techStack].map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex items-center gap-3 text-[var(--color-muted)] whitespace-nowrap"
          >
            <span className="text-2xl">{tech.icon}</span>
            <span className="text-sm uppercase tracking-widest font-[family-name:var(--font-display)] font-medium">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

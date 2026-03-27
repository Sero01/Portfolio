"use client";

import { photos } from "@/data/photography";
import { ScrollReveal } from "./scroll-reveal";

export function Photography() {
  const duplicated = [...photos, ...photos];

  return (
    <section id="photography" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Through My Lens
          </h2>
          <p className="text-[var(--color-muted)] text-lg">
            When I&apos;m not coding, I&apos;m capturing moments.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.1}>
        <div
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div
            className="flex gap-4 hover:[animation-play-state:paused]"
            style={{
              animation: "photo-scroll 60s linear infinite",
              width: "max-content",
            }}
          >
            {duplicated.map((photo, i) => (
              <div key={`${photo.id}-${i}`} className="shrink-0">
                <div className="w-72 sm:w-80 md:w-96 aspect-[3/4] rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden flex items-center justify-center">
                  {photo.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-[var(--color-muted)]">
                      <span className="text-4xl block mb-2">📷</span>
                      <span className="text-xs uppercase tracking-widest">Photo</span>
                    </div>
                  )}
                </div>
                {photo.caption && (
                  <p className="mt-3 text-sm text-[var(--color-muted)] px-1">
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

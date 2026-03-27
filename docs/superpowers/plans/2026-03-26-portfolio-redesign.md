# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign portfolio to match whyramachandran.design's bold, playful aesthetic — orange accent, large typography, organic skills cloud, scrolling marquee, photography deck.

**Architecture:** Modify existing Next.js components in-place. Add 3 new components (TechMarquee, Photography, SkillsCloud replacement). Update CSS variables for new color palette. Restructure data layer for new layouts.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, next-themes

**Spec:** `docs/superpowers/specs/2026-03-26-portfolio-redesign-design.md`

---

### Task 1: Update Color Palette & CSS Variables

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update CSS variables to orange accent palette**

Replace the entire `src/app/globals.css` with:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --color-bg: #fafafa;
  --color-fg: #0a0a0a;
  --color-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-card: #ffffff;
  --color-accent: #FF6B00;
  --color-purple: #7C3AED;
}

.dark {
  --color-bg: #0a0a0a;
  --color-fg: #fafafa;
  --color-muted: #9ca3af;
  --color-border: #27272a;
  --color-card: #141414;
  --color-accent: #FF7A1A;
  --color-purple: #8B5CF6;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
}

body {
  background-color: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
}

::selection {
  background-color: var(--color-accent);
  color: white;
}

/* Tech stack marquee animation */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Photography horizontal scroll */
.photography-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.photography-scroll::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 2: Verify dev server runs with new colors**

Run: `npm run dev`
Expected: Site loads with no CSS errors. Accent color is now orange instead of blue.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: update color palette to orange accent with purple highlight"
```

---

### Task 2: Restructure Data Layer

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/data/skills.ts`
- Create: `src/data/photography.ts`

- [ ] **Step 1: Update projects data with `featured` field and `image` placeholder**

Replace `src/data/projects.ts` with:

```typescript
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  metric?: string;
  metricLabel?: string;
  href: string;
  image?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Project Name One",
    description: "A brief description of this project and the problem it solves. Built to serve thousands of users with a focus on performance and reliability.",
    tags: ["React", "Node.js", "PostgreSQL"],
    metric: "50K+",
    metricLabel: "Users Served",
    href: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Project Name Two",
    description: "A brief description of this project and the problem it solves.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    href: "#",
  },
  {
    id: 3,
    title: "Project Name Three",
    description: "A brief description of this project and the problem it solves.",
    tags: ["Python", "FastAPI", "Docker"],
    href: "#",
  },
  {
    id: 4,
    title: "Project Name Four",
    description: "A brief description of this project and the problem it solves. An augmented reality experience pushing the boundaries of web technology.",
    tags: ["React Native", "Firebase"],
    href: "#",
    featured: true,
  },
];
```

- [ ] **Step 2: Restructure skills data as flat list for cloud layout**

Replace `src/data/skills.ts` with:

```typescript
export interface Skill {
  label: string;
  size?: "sm" | "md" | "lg";
}

export const skills: Skill[] = [
  { label: "React", size: "lg" },
  { label: "Next.js", size: "md" },
  { label: "TypeScript", size: "lg" },
  { label: "Python", size: "md" },
  { label: "Node.js", size: "md" },
  { label: "Spring Boot", size: "md" },
  { label: "PostgreSQL", size: "sm" },
  { label: "Docker", size: "sm" },
  { label: "AWS", size: "sm" },
  { label: "AI/ML", size: "lg" },
  { label: "REST APIs", size: "sm" },
  { label: "GraphQL", size: "sm" },
  { label: "Tailwind CSS", size: "md" },
  { label: "Git", size: "sm" },
];

export const softSkills: Skill[] = [
  { label: "Problem Solving", size: "lg" },
  { label: "System Design", size: "md" },
  { label: "Open Source", size: "md" },
  { label: "Collaboration", size: "lg" },
  { label: "Critical Thinking", size: "md" },
  { label: "Communication", size: "md" },
];
```

- [ ] **Step 3: Create photography data file**

Create `src/data/photography.ts`:

```typescript
export interface Photo {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

export const photos: Photo[] = [
  { id: 1, src: "", alt: "Photo 1", caption: "Caption one" },
  { id: 2, src: "", alt: "Photo 2", caption: "Caption two" },
  { id: 3, src: "", alt: "Photo 3", caption: "Caption three" },
  { id: 4, src: "", alt: "Photo 4", caption: "Caption four" },
  { id: 5, src: "", alt: "Photo 5", caption: "Caption five" },
  { id: 6, src: "", alt: "Photo 6", caption: "Caption six" },
];
```

- [ ] **Step 4: Commit**

```bash
git add src/data/projects.ts src/data/skills.ts src/data/photography.ts
git commit -m "data: restructure projects/skills for new layout, add photography data"
```

---

### Task 3: Redesign Navbar

**Files:**
- Modify: `src/components/navbar.tsx`

- [ ] **Step 1: Rewrite navbar to match reference layout**

Replace `src/components/navbar.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Photography", href: "#photography" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <a
          href="#"
          className="font-[family-name:var(--font-display)] text-sm uppercase tracking-widest font-bold"
        >
          parvez
        </a>

        {/* Center: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: LinkedIn + Theme Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="https://linkedin.com/in/parvez"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            LinkedIn
          </a>
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="15" y2="5" />
                  <line x1="3" y1="9" x2="15" y2="9" />
                  <line x1="3" y1="13" x2="15" y2="13" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://linkedin.com/in/parvez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors sm:hidden"
            >
              LinkedIn
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Verify navbar renders correctly**

Run: `npm run dev`
Expected: Logo left, nav links centered, LinkedIn + theme toggle right. Mobile shows hamburger.

- [ ] **Step 3: Commit**

```bash
git add src/components/navbar.tsx
git commit -m "style: redesign navbar with centered links and LinkedIn CTA"
```

---

### Task 4: Redesign Hero Section

**Files:**
- Modify: `src/components/hero.tsx`

- [ ] **Step 1: Rewrite hero with bold mixed-weight typography**

Replace `src/components/hero.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify hero renders**

Run: `npm run dev`
Expected: Large 3-line headline with "Design," in outline, "Build," in orange, "Innovate." in solid. Subtitle and emoji decorations below.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero.tsx
git commit -m "style: redesign hero with bold mixed-weight typography"
```

---

### Task 5: Create Tech Stack Marquee

**Files:**
- Create: `src/components/tech-marquee.tsx`

- [ ] **Step 1: Create the marquee component**

Create `src/components/tech-marquee.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify marquee scrolls continuously**

Run: `npm run dev`
Expected: Horizontal scrolling strip of tech names with icons. Infinite loop, pauses on hover.

- [ ] **Step 3: Commit**

```bash
git add src/components/tech-marquee.tsx
git commit -m "feat: add scrolling tech stack marquee component"
```

---

### Task 6: Redesign About/Bio with Skills Cloud

**Files:**
- Modify: `src/components/skills.tsx`

- [ ] **Step 1: Rewrite skills as about section with bio and organic cloud**

Replace `src/components/skills.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify about section renders with bio and cloud**

Run: `npm run dev`
Expected: Casual bio paragraph with emojis, "with my skills in:" label, organic scattered skill tags with slight rotations, soft skills in italic.

- [ ] **Step 3: Commit**

```bash
git add src/components/skills.tsx
git commit -m "style: redesign skills as about section with bio and organic cloud"
```

---

### Task 7: Redesign Projects Section

**Files:**
- Modify: `src/components/projects.tsx`

- [ ] **Step 1: Rewrite projects with featured cards and two-column grid**

Replace `src/components/projects.tsx` with:

```tsx
import { projects } from "@/data/projects";
import { ScrollReveal } from "./scroll-reveal";

function ProjectCard({ project, layout }: { project: typeof projects[0]; layout: "full" | "half" }) {
  const isFullWidth = layout === "full";

  return (
    <a href={project.href} className="group block">
      <div
        className={`rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-muted)] transition-colors ${
          isFullWidth ? "" : ""
        }`}
      >
        {/* Image placeholder */}
        <div
          className={`bg-[var(--color-card)] ${
            isFullWidth ? "aspect-[16/9]" : "aspect-[4/3]"
          } flex items-center justify-center`}
        >
          <span className="text-[var(--color-muted)] text-sm uppercase tracking-widest">
            Image →
          </span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Project
          </span>
          <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold mt-2 mb-3 group-hover:text-[var(--color-accent)] transition-colors">
            {project.title}
          </h3>
          <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center text-sm font-medium text-[var(--color-accent)] group-hover:gap-2 transition-all">
            View Project <span className="ml-1">→</span>
          </span>
        </div>
      </div>
    </a>
  );
}

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const regular = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-16">
            Featured Work
          </h2>
        </ScrollReveal>

        <div className="space-y-12">
          {/* First featured project: full width */}
          {featured[0] && (
            <ScrollReveal>
              <ProjectCard project={featured[0]} layout="full" />
            </ScrollReveal>
          )}

          {/* Regular projects: two-column grid */}
          {regular.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regular.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 0.1}>
                  <ProjectCard project={project} layout="half" />
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Last featured project: full width */}
          {featured[1] && (
            <ScrollReveal>
              <div className="bg-[var(--color-purple)] rounded-2xl text-white overflow-hidden">
                <div className="aspect-[16/9] flex items-center justify-center bg-white/10">
                  <span className="text-white/50 text-sm uppercase tracking-widest">
                    Image →
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <span className="text-xs uppercase tracking-widest text-white/60">
                    Project
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold mt-2 mb-3">
                    {featured[1].title}
                  </h3>
                  <p className="text-white/70 mb-4 leading-relaxed">
                    {featured[1].description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {featured[1].tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-white/30 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center text-sm font-medium text-white">
                    View Project <span className="ml-1">→</span>
                  </span>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify projects render with new layouts**

Run: `npm run dev`
Expected: "Featured Work" large heading. First featured project full-width, two regular projects in a grid, last featured project with purple background.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects.tsx
git commit -m "style: redesign projects with featured cards and two-column grid"
```

---

### Task 8: Create Photography Deck

**Files:**
- Create: `src/components/photography.tsx`

- [ ] **Step 1: Create horizontal scrolling photography component**

Create `src/components/photography.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { photos } from "@/data/photography";
import { ScrollReveal } from "./scroll-reveal";

export function Photography() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
          ref={scrollRef}
          className="photography-scroll flex gap-4 overflow-x-auto px-6 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        >
          {/* Left spacer for alignment */}
          <div className="shrink-0 w-[calc((100vw-72rem)/2)]" />

          {photos.map((photo) => (
            <div
              key={photo.id}
              className="shrink-0 snap-start"
            >
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

          {/* Right spacer */}
          <div className="shrink-0 w-6" />
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Verify photography deck scrolls horizontally**

Run: `npm run dev`
Expected: "Through My Lens" heading, horizontally scrollable photo cards with placeholder content. Snaps to each card.

- [ ] **Step 3: Commit**

```bash
git add src/components/photography.tsx
git commit -m "feat: add horizontal scrolling photography deck"
```

---

### Task 9: Redesign Contact CTA

**Files:**
- Modify: `src/components/contact.tsx`

- [ ] **Step 1: Rewrite contact as bold CTA section**

Replace `src/components/contact.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify CTA renders**

Run: `npm run dev`
Expected: Large bold "INTERESTED IN WORKING TOGETHER?" centered text with email below and waving hand emoji.

- [ ] **Step 3: Commit**

```bash
git add src/components/contact.tsx
git commit -m "style: redesign contact as bold CTA section"
```

---

### Task 10: Redesign Footer

**Files:**
- Modify: `src/components/footer.tsx`

- [ ] **Step 1: Rewrite footer with three-column layout**

Replace `src/components/footer.tsx` with:

```tsx
export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted)]">
        <p>Designed &amp; Developed by Parvez</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/parvez"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-muted)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/parvez"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-muted)] transition-colors"
          >
            LinkedIn
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} &middot; All Rights Reserved</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify footer renders**

Run: `npm run dev`
Expected: Three-column footer with attribution left, social pills center, copyright right.

- [ ] **Step 3: Commit**

```bash
git add src/components/footer.tsx
git commit -m "style: redesign footer with social pills and three-column layout"
```

---

### Task 11: Compose Page — Wire Up All Sections

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update page to include new sections, remove Experience**

Replace `src/app/page.tsx` with:

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TechMarquee } from "@/components/tech-marquee";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Photography } from "@/components/photography";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <Skills />
        <Projects />
        <Photography />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run build to verify no errors**

Run: `npm run build`
Expected: Build succeeds with no TypeScript or lint errors.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No lint errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: compose redesigned page with all new sections"
```

---

### Task 12: Final Visual Verification

- [ ] **Step 1: Run dev server and verify all sections**

Run: `npm run dev`

Verify in browser:
1. Navbar: logo left, links center, LinkedIn right, mobile hamburger works
2. Hero: 3-line headline with outline/orange/solid styles, subtitle, emojis
3. Marquee: scrolling tech strip, pauses on hover
4. About: casual bio with emojis, organic skills cloud with rotations
5. Featured Work: full-width featured card, two-column grid, purple card
6. Photography: horizontal scroll deck with placeholder cards
7. CTA: large bold text, email link, waving hand
8. Footer: three-column with social pills
9. Dark/light mode toggle works correctly with orange accent throughout

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds, no errors.

- [ ] **Step 3: Add .superpowers to .gitignore if not present**

Check if `.superpowers/` is in `.gitignore`. If not, add it:

```bash
echo ".superpowers/" >> .gitignore
git add .gitignore
git commit -m "chore: add .superpowers to gitignore"
```

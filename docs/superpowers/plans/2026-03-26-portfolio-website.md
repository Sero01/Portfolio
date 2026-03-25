# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimalist, high-quality portfolio website for Parvez (Full-Stack Developer) with dark/light mode, inspired by whyramachandran.design's clean aesthetic.

**Architecture:** Next.js 15 App Router with Tailwind CSS v4. Single-page portfolio with smooth scroll navigation. Sections: Hero, Projects (numbered case study cards), Skills, Experience (timeline), and Contact. Theme toggle using next-themes. Framer Motion for subtle scroll animations.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, next-themes, Framer Motion, TypeScript

---

## File Structure

```
src/
  app/
    layout.tsx          — Root layout: fonts, theme provider, metadata
    page.tsx            — Home page: composes all sections
    globals.css         — Tailwind imports, CSS custom properties for theme colors
  components/
    theme-provider.tsx  — next-themes ThemeProvider wrapper
    navbar.tsx          — Sticky top nav with links + theme toggle
    hero.tsx            — Hero section with name, title, tagline
    projects.tsx        — Numbered project cards section
    skills.tsx          — Skills/competencies grid
    experience.tsx      — Timeline of work experience
    contact.tsx         — Contact section with email + social links
    footer.tsx          — Minimal footer with copyright
    theme-toggle.tsx    — Dark/light mode toggle button
    scroll-reveal.tsx   — Reusable scroll animation wrapper
  data/
    projects.ts         — Project data array
    skills.ts           — Skills data array
    experience.ts       — Experience timeline data array
    social.ts           — Social links data
```

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Create Next.js project with TypeScript and Tailwind**

```bash
cd /home/parvez/Project/Portfolio
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack
```

Expected: Project scaffolded with `src/app/` directory structure.

- [ ] **Step 2: Install dependencies**

```bash
npm install next-themes framer-motion
```

- [ ] **Step 3: Install Inter and a display font via next/font**

No package needed — `next/font/google` is built into Next.js.

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Server running on localhost:3000.

- [ ] **Step 5: Commit**

```bash
git init
git add -A
git commit -m "chore: initialize Next.js 15 project with Tailwind and dependencies"
```

---

### Task 2: Set Up Theme System and Global Styles

**Files:**
- Create: `src/components/theme-provider.tsx`, `src/components/theme-toggle.tsx`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

- [ ] **Step 1: Create theme provider component**

Create `src/components/theme-provider.tsx`:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Create theme toggle button**

Create `src/components/theme-toggle.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  );
}
```

- [ ] **Step 3: Set up global CSS with theme variables**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --color-bg: #fafafa;
  --color-fg: #0a0a0a;
  --color-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-card: #ffffff;
  --color-accent: #2563eb;
}

.dark {
  --color-bg: #0a0a0a;
  --color-fg: #fafafa;
  --color-muted: #9ca3af;
  --color-border: #27272a;
  --color-card: #141414;
  --color-accent: #3b82f6;
}

body {
  background-color: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
}
```

- [ ] **Step 4: Update root layout with fonts and theme provider**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Parvez — Full-Stack Developer",
  description: "Portfolio of Parvez, a Full-Stack Developer building modern web applications.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify theme toggle works**

```bash
npm run dev
```

Visit localhost:3000, confirm page loads with dark background. (Visual check only at this stage.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add theme system with dark/light toggle and global styles"
```

---

### Task 3: Create Data Layer

**Files:**
- Create: `src/data/projects.ts`, `src/data/skills.ts`, `src/data/experience.ts`, `src/data/social.ts`

- [ ] **Step 1: Create projects data**

Create `src/data/projects.ts`:

```ts
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  metric?: string;
  metricLabel?: string;
  readTime: string;
  href: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Project Name One",
    description: "A brief description of this project and the problem it solves.",
    tags: ["React", "Node.js", "PostgreSQL"],
    metric: "50K+",
    metricLabel: "Users Served",
    readTime: "5 min read",
    href: "#",
  },
  {
    id: 2,
    title: "Project Name Two",
    description: "A brief description of this project and the problem it solves.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    metric: "99.9%",
    metricLabel: "Uptime",
    readTime: "4 min read",
    href: "#",
  },
  {
    id: 3,
    title: "Project Name Three",
    description: "A brief description of this project and the problem it solves.",
    tags: ["Python", "FastAPI", "Docker"],
    metric: "3x",
    metricLabel: "Performance Gain",
    readTime: "6 min read",
    href: "#",
  },
  {
    id: 4,
    title: "Project Name Four",
    description: "A brief description of this project and the problem it solves.",
    tags: ["React Native", "Firebase"],
    readTime: "3 min read",
    href: "#",
  },
];
```

- [ ] **Step 2: Create skills data**

Create `src/data/skills.ts`:

```ts
export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Python", "PostgreSQL", "REST APIs", "GraphQL"],
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "Git", "CI/CD", "AWS", "Linux"],
  },
];
```

- [ ] **Step 3: Create experience data**

Create `src/data/experience.ts`:

```ts
export interface Experience {
  year: string;
  role: string;
  company: string;
  description: string;
}

export const experience: Experience[] = [
  {
    year: "2024",
    role: "Full-Stack Developer",
    company: "Company Name",
    description: "Brief description of role and impact.",
  },
  {
    year: "2023",
    role: "Software Engineer",
    company: "Company Name",
    description: "Brief description of role and impact.",
  },
  {
    year: "2022",
    role: "Junior Developer",
    company: "Company Name",
    description: "Brief description of role and impact.",
  },
];
```

- [ ] **Step 4: Create social links data**

Create `src/data/social.ts`:

```ts
export interface SocialLink {
  label: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/parvez" },
  { label: "LinkedIn", href: "https://linkedin.com/in/parvez" },
  { label: "Email", href: "mailto:hello@parvez.dev" },
];
```

- [ ] **Step 5: Commit**

```bash
git add src/data/
git commit -m "feat: add project, skills, experience, and social data"
```

---

### Task 4: Build Scroll Animation Wrapper

**Files:**
- Create: `src/components/scroll-reveal.tsx`

- [ ] **Step 1: Create scroll reveal component**

Create `src/components/scroll-reveal.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/scroll-reveal.tsx
git commit -m "feat: add scroll reveal animation wrapper"
```

---

### Task 5: Build Navbar Component

**Files:**
- Create: `src/components/navbar.tsx`

- [ ] **Step 1: Create navbar with sticky positioning and theme toggle**

Create `src/components/navbar.tsx`:

```tsx
"use client";

import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
          Parvez
        </a>
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex items-center gap-6">
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
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/navbar.tsx
git commit -m "feat: add sticky navbar with navigation links and theme toggle"
```

---

### Task 6: Build Hero Section

**Files:**
- Create: `src/components/hero.tsx`

- [ ] **Step 1: Create hero with large display typography**

Create `src/components/hero.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/hero.tsx
git commit -m "feat: add hero section with display typography and CTAs"
```

---

### Task 7: Build Projects Section

**Files:**
- Create: `src/components/projects.tsx`

- [ ] **Step 1: Create numbered project cards section**

Create `src/components/projects.tsx`:

```tsx
import { projects } from "@/data/projects";
import { ScrollReveal } from "./scroll-reveal";

export function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight mb-16">
            Selected Work
          </h2>
        </ScrollReveal>
        <div className="space-y-16">
          {projects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 0.1}>
              <a href={project.href} className="group block">
                <div className="border border-[var(--color-border)] rounded-2xl p-8 sm:p-10 hover:border-[var(--color-muted)] transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl font-bold text-[var(--color-border)] group-hover:text-[var(--color-muted)] transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                      {project.readTime}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[var(--color-muted)] mb-6 max-w-2xl">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.metric && (
                    <div className="pt-6 border-t border-[var(--color-border)]">
                      <span className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold">
                        {project.metric}
                      </span>
                      <span className="ml-3 text-sm text-[var(--color-muted)]">
                        {project.metricLabel}
                      </span>
                    </div>
                  )}
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/projects.tsx
git commit -m "feat: add numbered project cards section"
```

---

### Task 8: Build Skills Section

**Files:**
- Create: `src/components/skills.tsx`

- [ ] **Step 1: Create skills grid**

Create `src/components/skills.tsx`:

```tsx
import { skills } from "@/data/skills";
import { ScrollReveal } from "./scroll-reveal";

export function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Why Parvez
          </h2>
          <p className="text-[var(--color-muted)] text-lg mb-16 max-w-2xl">
            Technologies and competencies I bring to every project.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((category, index) => (
            <ScrollReveal key={category.category} delay={index * 0.1}>
              <div className="border border-[var(--color-border)] rounded-2xl p-8">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold mb-6 uppercase tracking-wider">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="text-[var(--color-muted)] flex items-center gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/skills.tsx
git commit -m "feat: add skills section with categorized grid"
```

---

### Task 9: Build Experience Timeline Section

**Files:**
- Create: `src/components/experience.tsx`

- [ ] **Step 1: Create timeline layout**

Create `src/components/experience.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/experience.tsx
git commit -m "feat: add experience timeline section"
```

---

### Task 10: Build Contact Section and Footer

**Files:**
- Create: `src/components/contact.tsx`, `src/components/footer.tsx`

- [ ] **Step 1: Create contact section**

Create `src/components/contact.tsx`:

```tsx
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
```

- [ ] **Step 2: Create footer**

Create `src/components/footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted)]">
        <p>&copy; {new Date().getFullYear()} Parvez. All rights reserved.</p>
        <p>Built with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/contact.tsx src/components/footer.tsx
git commit -m "feat: add contact section and footer"
```

---

### Task 11: Compose Home Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Compose all sections into home page**

Replace `src/app/page.tsx` with:

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Experience } from "@/components/experience";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify full page renders**

```bash
npm run dev
```

Visit localhost:3000. Verify: all sections render, theme toggle works, smooth scroll on nav links, responsive at different breakpoints.

- [ ] **Step 3: Run build to verify no errors**

```bash
npm run build
```

Expected: Build completes successfully with no type or lint errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: compose all sections into home page"
```

---

### Task 12: Add Smooth Scroll and Polish

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add smooth scroll and selection styles**

Add to `src/app/globals.css`:

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
}

::selection {
  background-color: var(--color-accent);
  color: white;
}
```

- [ ] **Step 2: Final build and verify**

```bash
npm run build
```

Expected: Clean build, no warnings.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add smooth scroll and selection styles"
```

---

### Task 13: Set Up Project Structure (CLAUDE.md, memory, etc.)

**Files:**
- Create: `CLAUDE.md`, `memory/2026-03-26-memory.md`, `user/preferences.md`, `skills/skills.md`, `tasks/lessons.md`, `plans/`, `.gitignore` updates

- [ ] **Step 1: Create CLAUDE.md**

Create `CLAUDE.md` in project root with project-specific guidance (commands, architecture, conventions).

- [ ] **Step 2: Create project structure directories and files**

```bash
mkdir -p memory user skills tasks plans .tmp
```

Create `memory/2026-03-26-memory.md`, `user/preferences.md`, `skills/skills.md`, `tasks/lessons.md` with standard templates from init guide.

- [ ] **Step 3: Update .gitignore to exclude .tmp and .env**

Add to `.gitignore`:

```
.tmp/
.env
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md memory/ user/ skills/ tasks/ .gitignore
git commit -m "chore: add project structure (CLAUDE.md, memory, tasks, etc.)"
```

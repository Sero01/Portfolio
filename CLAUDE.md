# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session Start
Before doing anything else:
1. Read `tasks/lessons.md` — internalize all active rules before touching any code
2. Read the last 3 files in `memory/` — understand current project state and open questions
3. Read `user/preferences.md` — re-establish user context and working style
4. Summarize active context and open questions to yourself in 2–3 lines before proceeding

## Project Overview
Minimalist portfolio website for Parvez (Full-Stack Developer), inspired by whyramachandran.design's clean aesthetic. Single-page with smooth scroll navigation.

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 with CSS custom properties for theming
- **Animation:** Framer Motion (scroll reveal animations)
- **Theme:** next-themes (dark/light mode toggle)
- **Fonts:** Inter (body via --font-sans), Space Grotesk (display via --font-display), Array (hero display font)

## Commands
- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build
- `npm run lint` — ESLint

## Architecture
- `src/app/` — Next.js App Router (layout.tsx, page.tsx, globals.css)
- `src/components/` — React components (navbar, hero, tech-marquee, projects, skills, experience, photography, contact, footer, theme-toggle, scroll-reveal, theme-provider)
- `src/data/` — Static data arrays (projects.ts, skills.ts, experience.ts, photography.ts, social.ts)
- Theme colors defined as CSS custom properties in globals.css (--color-bg, --color-fg, --color-muted, --color-border, --color-card, --color-accent)

## Conventions
- All theme colors use CSS variables, not Tailwind color classes directly
- Display font applied via `font-[family-name:var(--font-display)]`
- Sections use `max-w-6xl mx-auto px-6` for consistent container width
- Scroll animations wrapped in `<ScrollReveal>` component (framer-motion, `"use client"`)
- Navigation uses anchor links (#projects, #about, #contact) + external Resume link (/resume.pdf)
- Dark mode via `@custom-variant dark (&:where(.dark, .dark *))` in globals.css (class-based, not media query)
- Hydration-safe client detection uses `useSyncExternalStore` pattern (not useState+useEffect — triggers lint error)
- `next-themes` ThemeProvider wraps app in layout.tsx with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`
- `suppressHydrationWarning` required on `<html>` for next-themes compatibility
- ESLint uses `eslint-config-next` with `core-web-vitals` and `typescript` — includes React compiler rules (`react-hooks/set-state-in-effect`)

## Data Layer
- All content data lives in `src/data/` as typed arrays with exported interfaces
- Experience data is real (Northern Trust, Skoda VW). Projects and skills are placeholder — replace with real content
- Photography images stored in public/photography/ (14 photos)
- Project cards support optional `metric`/`metricLabel` fields for key stats
- Social links conditionally open in new tab for external URLs

## Project Structure
- `memory/` — daily logs: decisions, bugs, learnings, open questions
- `user/` — user preferences and working style
- `skills/` — registry of reusable code and prompt patterns
- `tasks/` — lessons log (distilled rulebook) and task tracking
- `plans/` — implementation plans with checkable steps
- `.tmp/` — intermediate files, never committed, always regeneratable
- `.env` — environment variables and API keys

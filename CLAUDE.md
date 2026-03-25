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
- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 with CSS custom properties for theming
- **Animation:** Framer Motion (scroll reveal animations)
- **Theme:** next-themes (dark/light mode toggle)
- **Fonts:** Inter (body via --font-sans), Space Grotesk (display via --font-display)

## Commands
- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build
- `npm run lint` — ESLint

## Architecture
- `src/app/` — Next.js App Router (layout.tsx, page.tsx, globals.css)
- `src/components/` — React components (navbar, hero, projects, skills, experience, contact, footer, theme-toggle, scroll-reveal, theme-provider)
- `src/data/` — Static data arrays (projects.ts, skills.ts, experience.ts, social.ts)
- Theme colors defined as CSS custom properties in globals.css (--color-bg, --color-fg, --color-muted, --color-border, --color-card, --color-accent)

## Conventions
- All theme colors use CSS variables, not Tailwind color classes directly
- Display font applied via `font-[family-name:var(--font-display)]`
- Sections use `max-w-6xl mx-auto px-6` for consistent container width
- Scroll animations wrapped in `<ScrollReveal>` component
- Navigation uses anchor links (#projects, #skills, #experience, #contact)

## Project Structure
- `memory/` — daily logs: decisions, bugs, learnings, open questions
- `user/` — user preferences and working style
- `skills/` — registry of reusable code and prompt patterns
- `tasks/` — lessons log (distilled rulebook) and task tracking
- `plans/` — implementation plans with checkable steps
- `.tmp/` — intermediate files, never committed, always regeneratable
- `.env` — environment variables and API keys

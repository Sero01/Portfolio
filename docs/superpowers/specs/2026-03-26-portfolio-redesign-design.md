# Portfolio Redesign — whyramachandran.design Style

## Overview

Redesign Parvez's portfolio to near-identically match the layout, typography, and visual language of whyramachandran.design, adapted for a Full-Stack Developer. Replace the current minimal blue-accented design with a bold, playful, orange-accented aesthetic with high visual energy.

## Color Palette

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--color-bg` | `#fafafa` | `#0a0a0a` |
| `--color-fg` | `#0a0a0a` | `#fafafa` |
| `--color-muted` | `#6b7280` | `#9ca3af` |
| `--color-border` | `#e5e7eb` | `#27272a` |
| `--color-card` | `#ffffff` | `#141414` |
| `--color-accent` | `#FF6B00` (orange) | `#FF7A1A` (lighter orange) |
| `--color-purple` | `#7C3AED` | `#8B5CF6` |

The orange accent replaces the current blue. Purple is used for featured/highlighted project cards.

## Typography

- **Display font**: Space Grotesk (already in project) — used for all headings
- **Body font**: Inter (already in project) — used for body text
- **Hero headline**: Very large (6xl–9xl responsive), mixed font-weight (some words bold, some light) to create visual contrast, matching the reference's dynamic typography
- **Section headings**: Large (4xl–6xl), bold, Space Grotesk

## Sections (Top to Bottom)

### 1. Navbar

Matches reference layout:
- **Left**: "parvez" in lowercase, display font
- **Center**: Navigation links — Work, About, Photography, Contact (anchor links)
- **Right**: "LINKEDIN" text link (opens in new tab)
- Fixed position with backdrop blur (keep existing behavior)
- Mobile: hamburger menu or simplified layout

### 2. Hero

Matches reference's bold, playful hero:
- **Headline**: "Design, Build, Innovate." in large mixed-weight display typography
  - Consider: "Design" in outline/stroke style, "Build" in solid bold, "Innovate" with accent color — to create the visual variety seen in the reference
- **Subtitle**: "Full-Stack Developer" or similar descriptor below
- **Decorative elements**: CSS-based geometric shapes (circles, lines) and inline emoji (e.g., ✨, 🚀) placed around the headline text to add playfulness. No external image assets — pure CSS and Unicode
- Full viewport height (`min-h-screen`), vertically centered
- ScrollReveal animations on entrance

### 3. Tech Stack Marquee

New component — continuously scrolling horizontal strip:
- Logos/icons for: React, Spring Boot, JavaScript, Cloudflare, Python, Claude
- Infinite scroll animation using CSS `@keyframes` (duplicate items for seamless loop)
- Subtle styling — grayscale or muted, with hover revealing full color (optional)
- Sits between hero and about section as a trust/credibility strip
- Auto-scrolling, no user interaction needed
- Pauses on hover (optional nice-to-have)

### 4. About / Bio

Matches reference's casual, emoji-rich intro section:

**Bio paragraph** (casual tone, with emojis):
> Hi, I am 👋 Parvez, coding for 7 years and still losing sleep over side projects. Focused on building web apps 🌐 and AI-powered tools 🤖. A curious, hyperactive developer who's always got ideas brewing ☕. When I'm not shipping code, I'm behind a camera 📷.

- Large readable text (xl–2xl)
- Emojis inline with text
- "with my skills in:" subheading below

**Skills cloud** (organic/scattered layout):
- Skill tags arranged in a non-grid, organic cloud pattern matching the reference
- Tags include: React, Next.js, TypeScript, Python, Node.js, Spring Boot, PostgreSQL, Docker, AWS, AI/ML, REST APIs, GraphQL, Tailwind CSS, Git
- Some tags slightly rotated, different sizes, scattered positioning
- Handwritten-style labels like "Empathy" and "Collaboration" in the reference become developer equivalents like "Problem Solving", "System Design", "Open Source"
- Border-radius pills with border styling

### 5. Featured Work

Matches reference's project showcase:

**Section heading**: "Featured Work" in very large display font (matching reference's massive heading)

**Project cards** — two layouts alternating:

1. **Full-width featured card** (like the first/last project in reference):
   - Large image placeholder area (16:9 or similar aspect ratio)
   - Below image: "PROJECT" label, bold title, description, tech tags
   - "View Project →" CTA link in accent color
   - Optional: purple background variant for one featured card

2. **Two-column card grid** (like the middle projects in reference):
   - Two cards side-by-side on desktop, stacked on mobile
   - Smaller image placeholder
   - Same content structure: label, title, description, tags, CTA

**Card content structure**:
- Small "PROJECT" uppercase label
- Project title (bold, large)
- Description paragraph
- Tech tags as small pills
- "View Project →" link

Image placeholders: Gray boxes with aspect ratio maintained, ready for real screenshots later.

### 6. Photography

New section not in reference — horizontal scrolling deck:
- Section heading: "Photography" or "Through My Lens"
- Horizontally scrollable container with snap points
- Photo cards with consistent height, variable width (based on aspect ratio)
- Placeholder images initially (gray boxes or gradient placeholders)
- Smooth scroll behavior, optional drag-to-scroll
- Subtle shadow/border on cards
- No pagination dots needed — natural scroll interaction
- Overflow visible on sides to hint at more content

### 7. CTA (Call to Action)

Matches reference's bold CTA section:
- Large bold text: "INTERESTED IN WORKING TOGETHER?" in display font
- All caps, very large (5xl–7xl responsive)
- Decorative element (emoji or icon, like the reference's waving hand)
- Below: "Contact me:" label with email address as a clickable link
- Centered layout with generous vertical padding

### 8. Footer

Minimal footer matching reference:
- **Left**: "Designed & Developed by Parvez"
- **Center**: Social links as bordered pill buttons — GitHub, LinkedIn
- **Right**: "© 2026 · All Rights Reserved"
- Top border separator
- Small text, muted color

## Animations

Keep existing Framer Motion ScrollReveal pattern:
- Fade-up on viewport entry for all sections
- Staggered delays within sections
- Marquee uses pure CSS animation (not Framer Motion)
- Hover transitions on cards, links, and tags (border-color, color changes)

## Responsive Behavior

- **Desktop (lg+)**: Full layout as described, two-column project grids
- **Tablet (md)**: Single-column projects, smaller hero text, marquee still scrolls
- **Mobile (sm)**: Stacked everything, hamburger nav, hero text scales down, photography scroll works via touch swipe

## Data Layer Changes

### New data files needed:
- `src/data/photography.ts` — array of photo objects (id, src, alt, optional caption)

### Modified data files:
- `src/data/projects.ts` — add `image` field (optional string path), add `featured` boolean to flag full-width cards
- `src/data/skills.ts` — restructure for cloud layout (flat list with optional category, size hint)

### Unchanged:
- `src/data/social.ts` — keep as-is
- `src/data/experience.ts` — no longer displayed (timeline removed) but keep file for future use

## New Components

| Component | File | Purpose |
|-----------|------|---------|
| TechMarquee | `src/components/tech-marquee.tsx` | Scrolling tech stack strip |
| PhotographyDeck | `src/components/photography.tsx` | Horizontal scrolling photo deck |
| SkillsCloud | replaces current skills.tsx | Organic scattered skill tags |

## Modified Components

| Component | Changes |
|-----------|---------|
| Navbar | Restructure to match reference layout (logo left, links center, LinkedIn right) |
| Hero | Complete redesign — bold mixed-weight typography, decorative elements |
| Projects | New card layouts (full-width featured + two-column grid), image placeholders |
| Contact | Redesign as big bold CTA section |
| Footer | Restructure to match reference (three-column layout) |

## Removed from View

- Experience section (keep data file, remove from page)
- Current skills grid layout (replaced by cloud)

## Files to Modify

1. `src/app/globals.css` — update color variables (orange accent, add purple)
2. `src/app/page.tsx` — reorder sections, add TechMarquee and Photography, remove Experience
3. `src/components/navbar.tsx` — restructure layout
4. `src/components/hero.tsx` — complete redesign
5. `src/components/skills.tsx` — rewrite as organic cloud
6. `src/components/projects.tsx` — new card layouts with image support
7. `src/components/contact.tsx` — redesign as bold CTA
8. `src/components/footer.tsx` — restructure layout
9. `src/data/projects.ts` — add image and featured fields
10. `src/data/skills.ts` — restructure for cloud layout

## Files to Create

1. `src/components/tech-marquee.tsx` — scrolling tech strip
2. `src/components/photography.tsx` — horizontal scroll deck
3. `src/data/photography.ts` — photo data

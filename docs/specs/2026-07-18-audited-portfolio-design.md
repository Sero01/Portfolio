# The Audited Portfolio — design spec

**Date:** 2026-07-18 · **Status:** approved by Parvez (verbal, this session)
**Live target:** https://parvez-ahmed.pages.dev (Cloudflare Pages project `parvez-ahmed`)

## Decision context

Two portfolios existed: the ledger-paper pitch one-pager built 2026-07-18
(`~/Projects/portfolio-site`, live) and an undeployed Next.js personal site
(`~/Project/Portfolio`, design disliked). Decision: **one site**. Merge the
Next.js site's content (experience, earlier projects, photography) into a
redesigned static page here; retire the Next.js repo. Zero content overlap
made the merge additive.

## Concept

One long-scroll page that reads like a beautifully typeset financial
statement — annual-report typography, ruled paper, mono figures — that a
human auditor has gone through with a red pen. Machine precision carries the
professionalism; the red ink carries the personality. Direction chosen over
Swiss minimalism (anonymous) and dark terminal (template-saturated).

Personality kit (all four, applied with restraint):
1. **Red-pen auditor marks** — handwriting-font marginalia in auditor red:
   one hero underline, a circled figure, 2–3 margin notes. SVG strokes.
2. **Witty ledger microcopy** — "Transaction history" (experience),
   "Off-ledger assets" (photography), "E&OE" small print. Dry, never
   breaking the professional frame.
3. **Photography as a feature** — full-bleed horizontal film-strip with
   mono frame numbers; the one deliberate break from the grid.
4. **Tasteful motion & easter eggs** — stamp slam on load, figures tick up
   on first scroll into view, gentle section reveals. Easter egg: clicking
   the hero stamp runs an "audit pass" that draws all red-pen marks in
   sequence. All gated by `prefers-reduced-motion`. Nothing follows the
   cursor; no particles; no marquees.

## Stack

Static, zero build step: `index.html` + `assets/` (WebP photos). Fonts:
IBM Plex Sans / Sans Condensed / Mono (kept) + Caveat (red-pen accent),
via Google Fonts. Deploy with wrangler as documented in README. Repo gets
`git init` (the deployed site was previously unversioned).

## Page structure

1. **Masthead** — "STATEMENT OF WORK · PARVEZ AHMED" + mono nav (kept).
2. **Hero** — condensed uppercase headline, pitch, HELD-OUT·VERIFIED stamp;
   red-pen underline beneath the key phrase.
3. **Reconciliation report** — claims-vs-evidence table (kept verbatim in
   substance); red-pen circle on one number + margin scribble.
4. **Artifacts** — DocVal / ReconMatch / eval case study with
   figures-in-margin; numbers tick up on scroll.
5. **Transaction history** — experience as ledger entries with posting
   dates, content from resume (real numbers, not placeholders):
   - Senior Analyst — AI Engineer, Northern Trust, Apr 2026–present:
     agentic RAG over AS/400 (Azure OpenAI + Neo4j, LLM-driven Cypher);
     ML model automating TLM reconciliation breaks (1-to-many /
     many-to-many); 16 microservices Java 8→21 / Boot 2→3, 800+ CVEs.
   - Analyst, Software Engineer, NT, Aug 2024–Mar 2026: 21-service
     zero-downtime Boot migration; TLM HTML→XLSX tool (minutes→<5 s,
     adopted company-wide); ISO→CAMT.053 pipeline (~9 min→<50 s, −82%);
     CI/CD −40% deploy time; RHEL7→8.
   - Front-End Intern, NT, Jun–Sep 2023: Lighthouse +25%.
   - Full-Stack Intern, Skoda VW Academy, Oct 2022–Mar 2023: DSS
     (Django/React/PostgreSQL/Docker) for 100+ dealership branches.
6. **Earlier entries** — compact one-line ledger rows with GitHub links:
   Norman (local agent, <3 s tool-use), agentguides.dev (1.3K+ requests),
   WhispnoteAI (voice→note <4 s), Watch Party (WebRTC sync).
7. **Off-ledger assets** — photography film strip (~14 photos, WebP
   ~1200 px long edge, lazy-loaded).
8. **Contact + footer** — CTA headline, links (email / GitHub / LinkedIn —
   real URL: linkedin.com/in/parvez-ahmed-b47680124), small print:
   "No number on this page is unpublished or unverifiable. E&OE."

## Preserved plumbing

HTML-comment slots carry over: `POST-EVAL` ×2 (held-out eval re-run in
flight), `RECONMATCH-URL` (Render deploy pending), `WRITEUP-URL`.
`LINKEDIN-URL` slot is resolved by this redesign (real URL from resume).

## Non-goals

Multi-page routing, CMS, analytics, dark mode, blog. The Next.js repo is
retired, not deleted; its GitHub remote (Sero01/Portfolio) untouched.

## Acceptance

- Renders correctly at 1440 px and 390 px (screenshot-verified) with no
  horizontal scroll; photos lazy-load; page weight sane (photos < ~150 KB
  each).
- All links resolve; the four slot comments present/updated as above.
- Motion disabled cleanly under `prefers-reduced-motion`.
- Deploy to parvez-ahmed.pages.dev only after Parvez approves screenshots.

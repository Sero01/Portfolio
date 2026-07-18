# Side Project Gallery Wall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the uniform hover-reveal side-project grid with a varied, image-first gallery wall whose seven tiles appear at 500 ms intervals.

**Architecture:** Keep project data and generated markup in `script.js`, layout and animation in `styles.css`, and navigation copy in `index.html`. Source-contract tests protect the project list, assets, markup, layout hooks, animation cadence, and reduced-motion behavior.

**Tech Stack:** HTML5, CSS Grid, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Show Speculum, Memory Wiki, Norman, Inklink, Pickpath, Watchparty, and Agent Guides in that order.
- Remove Emma and WhispnoteAI.
- Pickpath links to `https://pickpath-presell.pages.dev/`.
- Images and GIFs are always visible; no hover reveal or hover movement.
- Each successive project begins its reveal 500 ms after the previous project.
- Reduced-motion users see the gallery immediately.
- Add no dependencies.

---

### Task 1: Gallery content and markup contract

**Files:**
- Create: `tests/gallery-wall.test.js`
- Modify: `script.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: the existing `galleryWall` array and `wallHtml()` renderer.
- Produces: project objects with `name`, `meta`, `img`, `href`, `alt`, and `size`; anchors with `frame--<size>` classes and always-visible images.

- [ ] **Step 1: Write failing content and markup tests**

Create tests that read `script.js` and `index.html`, extract the gallery region, and assert the seven required names and assets, the Pickpath URL, absence of Emma and WhispnoteAI, `frame--wide`/`frame--tall` hooks, image alt text, and absence of `frame-cover` and hover instructions.

- [ ] **Step 2: Run the new test and verify RED**

Run: `node --test tests/gallery-wall.test.js`

Expected: failures for the old projects, missing Pickpath, old asset extensions, hover copy, and missing size/alt hooks.

- [ ] **Step 3: Implement the content and markup**

Update `galleryWall` to the approved seven objects and assets, add `alt` and `size` values, render `frame--${p.size}` and an always-present `<img>` before the placard, remove cover/description markup, update the explanatory paragraph, and change the sidebar summary to `Speculum · Pickpath · Inklink +4`.

- [ ] **Step 4: Run the new test and verify GREEN**

Run: `node --test tests/gallery-wall.test.js`

Expected: all gallery content/markup tests pass.

### Task 2: Varied layout and staggered reveal

**Files:**
- Modify: `tests/gallery-wall.test.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.wall`, `.frame`, `.frame--wide`, `.frame--tall`, `.frame--large`, `.frame-plate`, `.frame-placard`, and cascade `--i` values.
- Produces: a four-column editorial mosaic, responsive two/one-column fallbacks, and `animation-delay:calc(var(--i) * 500ms)` for frames.

- [ ] **Step 1: Write failing style tests**

Assert that CSS defines dense four-column grid placement, distinct wide/tall/large spans, visible image plates, no `.frame:hover` rules, a 500 ms index-based reveal delay, responsive span resets, and immediate reduced-motion visibility.

- [ ] **Step 2: Run the new test and verify RED**

Run: `node --test tests/gallery-wall.test.js`

Expected: failures against the existing uniform four-column hover grid.

- [ ] **Step 3: Implement the gallery CSS**

Replace the old frame styles with image-first tiles, explicit size spans/aspect ratios, persistent gradient-backed placards, `galleryReveal` animation using the cascade index at 500 ms increments, responsive grid/span rules, and reduced-motion overrides.

- [ ] **Step 4: Run the new test and verify GREEN**

Run: `node --test tests/gallery-wall.test.js`

Expected: all gallery tests pass.

### Task 3: Regression and browser verification

**Files:**
- Verify: `index.html`
- Verify: `script.js`
- Verify: `styles.css`
- Verify: `tests/gallery-wall.test.js`

**Interfaces:**
- Consumes: the complete static site and Node test suite.
- Produces: verified responsive gallery behavior without regressions.

- [ ] **Step 1: Run the full automated suite**

Run: `node --test tests/*.test.js`

Expected: zero failures.

- [ ] **Step 2: Check asset references**

Run a script that extracts `assets/projects/...` paths from the gallery and verifies every referenced file exists.

Expected: all seven files exist.

- [ ] **Step 3: Inspect the final diff**

Run: `git diff --check && git diff -- index.html script.js styles.css tests/gallery-wall.test.js`

Expected: no whitespace errors; changes are limited to the approved gallery behavior and navigation copy.

### Task 4: Native-ratio masonry expansion

**Files:**
- Modify: `tests/gallery-wall.test.js`
- Modify: `script.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: the `render(key)` section key, `.thread`, `.wall`, `.frame`, and `.frame-plate`.
- Produces: `.thread--projects`, an 1185 px project-only content width, responsive three/two/one-column masonry, and uncropped `width:100%; height:auto` media.

- [ ] **Step 1: Write failing native-ratio masonry tests**

Assert that project rendering adds `.thread--projects`, its width is `min(1185px,100%)`, the wall uses three CSS columns with responsive two/one-column fallbacks, frames avoid column breaks, media uses `height:auto`, and fixed grid/object-fit rules are absent.

- [ ] **Step 2: Run the gallery tests and verify RED**

Run: `node --test tests/gallery-wall.test.js`

Expected: failures for the current 790 px fixed-row grid and full-height contained media.

- [ ] **Step 3: Implement the minimal masonry conversion**

Add the project thread modifier in `render(key)`. Replace gallery grid sizing and span rules with CSS columns and `break-inside:avoid`; make frames inline blocks with full width and bottom margin; render plates in normal flow at `width:100%; height:auto`; and update responsive column counts.

- [ ] **Step 4: Verify gallery and full-suite GREEN**

Run: `node --test tests/gallery-wall.test.js && node --test tests/*.test.js && git diff --check`

Expected: zero failures and no whitespace errors.

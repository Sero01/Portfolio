# Experience Message Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the Experience intro and four roles as five separate assistant messages joined by one visual timeline.

**Architecture:** Split the existing Experience HTML into queue entries and attach `timeline: "first" | "middle" | "last"` metadata to role entries. `addAssistantMsg` maps that metadata to row classes; CSS draws line segments across message gaps and keeps one dot on each role.

**Tech Stack:** HTML strings in browser JavaScript, CSS pseudo-elements, Node.js built-in test runner.

## Global Constraints

- The existing user prompt and all role copy remain unchanged.
- The Experience intro is its own assistant message.
- Each of four roles is a separate assistant message with its own `P` mark.
- One vertical connector and four orange dots remain visually continuous.
- Existing queue cancellation and reduced-motion behavior remain intact.
- Role details are permanently visible; no hover or click disclosure behavior remains.

---

### Task 1: Split Experience into timeline messages

**Files:**
- Create: `tests/experience.test.js`
- Modify: `script.js:68-82, 248-310`
- Modify: `styles.css:287-307, 380-402`

**Interfaces:**
- Consumes: `content.experience.thread`, `addAssistantMsg`, and `.role`.
- Produces: `timeline` message metadata and `.timeline-message.timeline-first|timeline-middle|timeline-last` rows.

- [ ] Write a failing test that extracts the Experience content and asserts four timeline-tagged role entries, all role titles, row-class mapping, and connector CSS.
- [ ] Run `node --test tests/experience.test.js`; expect failure because Experience is still one message.
- [ ] Split the intro and roles into separate `{ a: ... }` entries, tagging roles `first`, `middle`, `middle`, and `last`.
- [ ] Extend `addAssistantMsg` with a `timeline` option, add the corresponding row classes, and pass `msg.timeline` from `render`.
- [ ] Replace the nested `.timeline` connector with answer-level pseudo-elements that bridge message gaps and trim at the first and last dots.
- [ ] Run `node --test`, `node --check script.js`, and `git diff --check`; expect all to pass.
- [ ] Verify desktop and 390 px screenshots show five assistant messages, one continuous line, and four dots.

### Task 2: Make role details static

**Files:**
- Modify: `tests/experience.test.js`
- Modify: `script.js:70, 328-336`
- Modify: `styles.css:295-312`

**Interfaces:**
- Consumes: The four `.role` messages from Task 1.
- Produces: Permanently visible `.story` content with no role disclosure event.

- [ ] Add a failing test requiring no disclosure hint, no role click branch, a visible `.story`, and no hover/open story selector.
- [ ] Run `node --test tests/experience.test.js`; expect failure on the current interactive disclosure behavior.
- [ ] Remove the hint from the Experience intro and the `.role` branch from the document click listener.
- [ ] Style roles as static cards and set `.story` to a permanently expanded grid row; remove hover/open expansion selectors and pointer cursor.
- [ ] Run `node --test`, `node --check script.js`, and `git diff --check`; expect all to pass.

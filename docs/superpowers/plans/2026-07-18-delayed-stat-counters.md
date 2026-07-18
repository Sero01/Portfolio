# Delayed Stat Counters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Start every portfolio stat count-up one second after its containing answer becomes visible.

**Architecture:** Keep timing centralized in `tickUpStats(answer)`. Each numeric stat initializes at zero immediately, waits for the shared 1,000 ms delay, then uses the existing 700 ms requestAnimationFrame interpolation.

**Tech Stack:** Browser JavaScript and Node.js built-in test runner.

## Global Constraints

- The delay applies to every `.stat b` counter across the portfolio.
- The delay begins when the answer is inserted and visible.
- The delay is exactly 1,000 ms.
- Existing reduced-motion behavior remains unchanged.

---

### Task 1: Delay all stat count-ups

**Files:**
- Create: `tests/animations.test.js`
- Modify: `script.js:212-231`

**Interfaces:**
- Consumes: `tickUpStats(answer)` and numeric `.stat b` elements.
- Produces: `STAT_DELAY` and delayed invocation of the existing counter animation.

- [ ] Add a failing static regression test asserting `STAT_DELAY = 1000`, zero initialization, and `setTimeout(..., STAT_DELAY)` inside `tickUpStats`.
- [ ] Run `node --test tests/animations.test.js` and confirm it fails because the delay does not exist.
- [ ] Add `const STAT_DELAY = 1000`, initialize matched stats to their formatted zero value, and start each current animation from a `setTimeout` callback.
- [ ] Run `node --test` and confirm all tests pass.
- [ ] Run `node --check script.js && git diff --check` and confirm both checks pass.

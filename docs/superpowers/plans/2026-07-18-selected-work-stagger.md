# Selected Work One-Second Stagger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reveal Selected Work cards at zero, one, and two seconds while leaving all other section timings unchanged.

**Architecture:** Reuse the `--i` indices assigned by the existing `cascadeBlocks` function. Add a narrowly scoped CSS override for `.work-card.rise`, with a static test guarding the exact selector and one-second multiplier.

**Tech Stack:** HTML, CSS, browser JavaScript, Node.js built-in test runner

## Global Constraints

- The first Selected Work card appears immediately, the second after one second, and the third after two seconds.
- Other sections retain their existing reveal timing.
- Reduced-motion mode continues to display cards immediately.
- Do not add JavaScript timers or scroll-following behavior.

---

### Task 1: Selected Work reveal timing

**Files:**
- Modify: `tests/selected-works.test.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `cascadeBlocks`' existing numeric `--i` custom property on each `.work-card.rise` element
- Produces: `.work-card.rise { animation-delay: calc(var(--i) * 1s) }`

- [ ] **Step 1: Write the failing test**

Add this test to `tests/selected-works.test.js`:

```js
test('Selected Work cards reveal one second apart', () => {
  assert.match(css, /\.work-card\.rise\s*\{[^}]*animation-delay:\s*calc\(var\(--i\) \* 1s\)/s);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/selected-works.test.js`

Expected: FAIL because `styles.css` does not yet contain the scoped one-second delay.

- [ ] **Step 3: Add the minimal CSS override**

Add immediately after the `.work-card` rule in `styles.css`:

```css
.work-card.rise{animation-delay:calc(var(--i) * 1s)}
```

- [ ] **Step 4: Run focused and full tests**

Run: `node --test tests/selected-works.test.js`

Expected: all Selected Work tests PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS with no failures.

- [ ] **Step 5: Commit**

```bash
git add tests/selected-works.test.js styles.css docs/superpowers/plans/2026-07-18-selected-work-stagger.md
git commit -m "feat: stagger selected work reveals"
```

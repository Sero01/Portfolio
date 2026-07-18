# Selected Work Scroll-Follow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Smoothly follow each Selected Work card as it reveals at zero, one, and two seconds.

**Architecture:** Add a focused `followWorkReveals(answer, seq)` helper alongside `followProjectReveals`. It uses the card's zero-based index for timer scheduling, checks `renderSeq` to cancel stale work, and handles reduced motion immediately.

**Tech Stack:** Browser JavaScript, Node.js built-in test runner

## Global Constraints

- Follow cards at zero, one, and two seconds.
- Scroll smoothly and align each arriving card to the end of the viewport.
- Cancel callbacks after section navigation.
- Under reduced motion, immediately show the final card.
- Do not change existing reveal timing or project-gallery scrolling.

---

### Task 1: Follow Selected Work card reveals

**Files:**
- Modify: `tests/selected-works.test.js`
- Modify: `script.js`

**Interfaces:**
- Consumes: `.work-list .work-card`, `reduced`, and the current `renderSeq`
- Produces: `followWorkReveals(answer, seq): void`

- [ ] **Step 1: Write the failing test**

Add a test that extracts `followWorkReveals` and asserts it selects `.work-list .work-card`, handles reduced motion via the final card, schedules `index * 1000`, rejects stale sequence IDs, scrolls smoothly with `block: 'end'`, and is called from assistant completion.

- [ ] **Step 2: Verify the test fails**

Run: `node --test tests/selected-works.test.js`

Expected: FAIL because `followWorkReveals` does not exist.

- [ ] **Step 3: Implement the helper**

Add to `script.js` before `followProjectReveals`:

```js
function followWorkReveals(answer, seq){
  const cards = [...answer.querySelectorAll('.work-list .work-card')];
  if (!cards.length) return;
  if (reduced){ cards.at(-1).scrollIntoView({ behavior: 'instant', block: 'end' }); return; }
  cards.forEach((card, index) => setTimeout(() => {
    if (seq !== renderSeq) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, index * 1000));
}
```

Call `followWorkReveals(answer, seq);` immediately before `followProjectReveals(answer, seq);` in assistant completion.

- [ ] **Step 4: Verify focused and full tests**

Run: `node --test tests/selected-works.test.js`

Expected: all focused tests PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS with no failures.

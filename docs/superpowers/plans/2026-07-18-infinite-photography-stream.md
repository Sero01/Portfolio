# Infinite Photography Stream Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Continuously append all 14 photography messages in order, loop indefinitely, and remove photo messages that have fully left the top of the chat viewport.

**Architecture:** Keep the ordered photo data in `script.js`. Start a render-sequence-scoped recursive loop after the Photography heading queue completes; reuse `addAssistantMsg` for the existing typing/reveal cadence and add a focused pruning function for offscreen loop messages.

**Tech Stack:** Vanilla JavaScript, HTML/CSS, Node.js built-in test runner.

## Global Constraints

- Use all 14 supplied captions exactly and in numeric order.
- Append approximately one photo per second.
- Restart at photo 1 after photo 14.
- Remove only looped photo messages fully above the chat viewport.
- Stop appending after the active portfolio render changes.
- Add no dependencies.

---

### Task 1: Ordered photo data and loop contract

**Files:**
- Create: `tests/photography.test.js`
- Modify: `script.js`

**Interfaces:**
- Consumes: `photoSet`, `content.photos`, `addAssistantMsg`, `renderSeq`, `chat`.
- Produces: `photoHtml(photo)`, `pruneOffscreenPhotos()`, and `startPhotoLoop(thread, seq)`.

- [ ] **Step 1: Write failing tests**

Assert all 14 exact `[number, caption]` entries; verify Photography no longer expands a finite photo thread; verify modulo wraparound, render-sequence cancellation, 400 ms think plus 380 ms gap, scroll-enabled assistant messages, and pruning based on message-bottom versus chat-top geometry.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/photography.test.js`

Expected: failures for the six-photo finite implementation and missing loop/pruning functions.

- [ ] **Step 3: Implement the stream**

Replace `photoSet` with all 14 captions, extract reusable photo markup, keep only the heading in `content.photos`, implement viewport pruning for `.photo-loop-message`, and implement a recursive modulo-index loop that marks each inserted row, scrolls it, prunes after rendering, and schedules the next item.

- [ ] **Step 4: Start the loop when the Photography queue finishes**

Update `render(key)` so an exhausted Photography queue calls `startPhotoLoop(thread, seq)` once; other sections retain their existing termination behavior.

- [ ] **Step 5: Verify GREEN and regressions**

Run: `node --test tests/photography.test.js && node --test tests/*.test.js && git diff --check`

Expected: zero failures and no whitespace errors.

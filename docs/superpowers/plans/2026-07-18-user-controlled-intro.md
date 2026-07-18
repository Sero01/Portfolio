# User-Controlled Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the intro lead with “Hi, I am Parvez,” guide attention with a pulsating pixel-hand cursor, and render the portfolio only after Send activation.

**Architecture:** Preserve the static `index.html` + `styles.css` + `script.js` structure. A dependency-free Node test reads those assets and asserts the public markup, styling, and launch wiring before the minimal production edits are applied.

**Tech Stack:** HTML5, CSS, browser JavaScript, Node.js built-in test runner.

## Global Constraints

- `What would you like to know?` is a smaller supporting line above the heading.
- `Hi, I am Parvez` is the large primary heading below it.
- The simulated cursor uses a locally vendored Pixelarticons `pointer` SVG, moves to Send, and pulsates until Send is clicked.
- Portfolio content must not render before Send activation.
- Background clicks, Enter, and Escape must not launch the portfolio.
- Reduced-motion mode hides the decorative cursor but still requires Send activation.
- No dependencies or build step may be added.

---

### Task 1: User-controlled intro gate

**Files:**
- Create: `tests/intro.test.js`
- Modify: `index.html:41-45`
- Modify: `styles.css:109-156`
- Modify: `script.js:144-187`

**Interfaces:**
- Consumes: Existing `#intro`, `#app`, `#introSend`, `#demoCursor`, `typeIntro()`, `animateCursor()`, and `launch()` elements/functions.
- Produces: An intro where `#introSend` is the sole launch event source and `.demo-cursor` is a pulsating pixel-hand visual.

- [ ] **Step 1: Write the failing behavior tests**

Create `tests/intro.test.js` with Node assertions that read the three static assets and verify:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const introLogic = js.slice(js.indexOf('/* ---------- intro ---------- */'), js.indexOf('/* ---------- message rendering ---------- */'));

test('intro uses Parvez greeting as its primary heading', () => {
  assert.match(html, /<h1 class="intro-greeting">[\s\S]*?<span>Hi, I am Parvez<\/span>[\s\S]*?<\/h1>\s*<p class="intro-question">What would you like to know\?<\/p>/);
});

test('only the Send button launches the portfolio', () => {
  assert.match(introLogic, /send\.addEventListener\('click', launch\)/);
  assert.doesNotMatch(introLogic, /intro\.addEventListener\('click'/);
  assert.doesNotMatch(introLogic, /document\.addEventListener\('keydown'/);
  assert.doesNotMatch(introLogic, /later\(launch/);
});

test('demo cursor is a pixelated hand that pulses while waiting', () => {
  assert.match(css, /\.demo-cursor\s*\{[^}]*image-rendering:pixelated/s);
  assert.match(css, /\.demo-cursor\.waiting\s*\{[^}]*animation:cursorPulse/s);
  assert.match(introLogic, /cursor\.classList\.add\('waiting'\)/);
});
```

- [ ] **Step 2: Run tests and verify the expected failure**

Run: `node --test tests/intro.test.js`

Expected: three failing subtests because the old heading order, automatic launch, and dot cursor are still present.

- [ ] **Step 3: Implement the minimal markup and styles**

In `index.html`, replace the greeting wrapper and old heading with:

```html
<h1 class="intro-greeting">
  <svg viewBox="0 0 24 24" class="wave" aria-hidden="true"><use href="#i-wave"/></svg>
  <span>Hi, I am Parvez</span>
</h1>
<p class="intro-question">What would you like to know?</p>
```

Update the intro CSS so `.intro-greeting` carries the large responsive serif heading, `.intro-question` carries the smaller muted supporting copy, and `.demo-cursor` uses an embedded pixel-art hand SVG as its background with `image-rendering:pixelated`. Add `.demo-cursor.waiting { animation:cursorPulse 1.1s ease-in-out infinite; }` and a `cursorPulse` keyframe that varies scale and drop shadow without simulating a click.

- [ ] **Step 4: Remove automatic and indirect launch paths**

Change `animateCursor()` so it ends by adding both visual states and never schedules `launch()`:

```js
requestAnimationFrame(() => {
  cursor.style.left = `${rect.left + rect.width / 2 - 6}px`;
  cursor.style.top = `${rect.top + rect.height / 2 - 3}px`;
  later(() => cursor.classList.add('waiting'), 1000);
});
```

Keep only:

```js
send.addEventListener('click', launch);
```

Delete the intro background-click listener and the Enter/Escape document listener. In reduced-motion mode, `typeIntro()` must still stop after filling the prompt without calling `animateCursor()` or `launch()`.

- [ ] **Step 5: Run focused tests and verify green**

Run: `node --test tests/intro.test.js`

Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Run full static verification**

Run: `node --test && git diff --check`

Expected: all tests pass and `git diff --check` exits with no output.

- [ ] **Step 7: Review the final diff**

Run: `git diff -- index.html styles.css script.js tests/intro.test.js`

Confirm the app retains `aria-hidden="true"` initially, `render('home')` remains inside `launch()`, reduced-motion still hides `.demo-cursor`, and no unrelated portfolio content changed.

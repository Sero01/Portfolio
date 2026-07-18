const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

test('tour order lists every section in walkthrough sequence', () => {
  assert.match(
    script,
    /const TOUR_ORDER = \['home', 'work', 'experience', 'projects', 'photos', 'contact'\];/
  );
});

test('nextSection walks the tour order and stops at contact', () => {
  assert.match(script, /function nextSection\(key\)/);
  // Derived from TOUR_ORDER, not a hand-written map, so contact yields null.
  assert.match(script, /TOUR_ORDER\.indexOf\(key\)/);
  assert.match(script, /TOUR_ORDER\[[^\]]+\+ 1\] \|\| null/);
});

test('prefill text is reused from the destination section opening bubble', () => {
  assert.match(script, /content\[next\]\.thread\[0\]\.u/);
});

test('section completion drives the composer prefill from the render queue', () => {
  assert.match(script, /function onSectionComplete\(key, seq\)/);
  // Fired at the queue-empty terminal, covering the photos loop start.
  assert.match(script, /onSectionComplete\(key, seq\)/);
  assert.match(script, /const next = nextSection\(key\)/);
});

test('composer types the next prompt guarded against stale renders', () => {
  assert.match(script, /function typeComposer\(text, seq\)/);
  assert.match(script, /if \(seq !== renderSeq\) return;/);
  // Pulse only starts once the prompt finishes typing.
  assert.match(script, /composerSend\.classList\.add\('pulse'\)/);
  assert.match(script, /pendingNext = next/);
});

test('reduced motion sets the prompt instantly and skips the pulse', () => {
  assert.match(
    script,
    /if \(reduced\)\{[^}]*composerText\.textContent = text;[^}]*return;[^}]*\}/s
  );
});

test('every render resets the composer and clears the pending target', () => {
  assert.match(script, /composerSend\.classList\.remove\('pulse'\)/);
  assert.match(script, /composer\.classList\.remove\('has-prompt'\)/);
  assert.match(script, /pendingNext = null/);
});

test('clicking composer send advances to the pending section', () => {
  assert.match(script, /composerSend\.addEventListener\('click'/);
  assert.match(script, /if \(pendingNext\) render\(pendingNext\)/);
});

test('composer send reuses the intro pulse animation', () => {
  assert.match(css, /\.composer-send\.pulse\s*\{[^}]*animation:sendPulse/s);
});

test('send pulse only ripples outward and never returns to size', () => {
  const keyframe = css.match(/@keyframes sendPulse\{[\s\S]*?\n\}/)[0];
  // No transform:scale — the scale-back-to-1 bounce is what felt odd.
  assert.doesNotMatch(keyframe, /transform:scale/);
  // Ring starts tight and opaque, ends expanded and fully transparent, so the loop reset is invisible.
  assert.match(keyframe, /0%\{box-shadow:0 0 0 0 rgba\(var\(--orange-rgb\),\.5\)\}/);
  assert.match(keyframe, /100%\{box-shadow:0 0 0 \d+px rgba\(var\(--orange-rgb\),0\)\}/);
});

test('composer reveals typed prompt text and caret only when a prompt is pending', () => {
  assert.match(css, /\.composer\.has-prompt\s+\.composer-placeholder\s*\{[^}]*color:var\(--ink\)/s);
  assert.match(css, /\.composer-caret/);
});

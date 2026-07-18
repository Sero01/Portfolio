const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const script = fs.readFileSync(path.resolve(__dirname, '..', 'script.js'), 'utf8');
const photoData = script.slice(
  script.indexOf('const photoSet = ['),
  script.indexOf('function wallHtml()')
);
const photoContent = script.slice(
  script.indexOf('photos: { title: "Photography"'),
  script.indexOf('contact: { title:')
);
const photoLoop = script.slice(
  script.indexOf('function photoHtml'),
  script.indexOf('function render(key)')
);
const renderLogic = script.slice(
  script.indexOf('function render(key)'),
  script.indexOf('/* work card')
);

test('photography includes all 14 supplied captions in order', () => {
  const captions = [
    'Bangalore traffic', 'Koi fish', 'Sinhagargh, Pune', 'Melancholic dusk',
    'Street lamp', 'Marigold', 'Muscat view point', 'Bandar Al Khairan',
    "Sultan's cruise", 'Between the walls', 'Flowers beyond', 'Sonder',
    'The fishermen', 'The arch'
  ];
  captions.forEach((caption, index) => {
    const escaped = caption.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(photoData, new RegExp(`\\[${index + 1}, "${escaped}"\\]`));
  });
});

test('photography content renders its heading before starting the live stream', () => {
  assert.doesNotMatch(photoContent, /\.\.\.photoSet\.map/);
  assert.match(renderLogic, /if \(!queue\.length\)\{[\s\S]*?key === 'photos'[\s\S]*?startPhotoLoop\(thread, seq\)/);
});

test('photo stream loops at roughly one photo every two seconds and stops when stale', () => {
  assert.match(photoLoop, /function startPhotoLoop\(thread, seq\)/);
  assert.match(photoLoop, /if \(seq !== renderSeq\) return;/);
  assert.match(photoLoop, /photoSet\[index % photoSet\.length\]/);
  assert.match(photoLoop, /think: 400/);
  assert.match(photoLoop, /scroll: true/);
  assert.match(photoLoop, /setTimeout\(appendNext, 1380\)/);
});

test('photography images are twenty percent smaller than their original maximum', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '..', 'styles.css'), 'utf8');
  assert.match(css, /\.photo-msg img\{[^}]*max-width:min\(384px,100%\)/s);
});

test('photo stream removes only loop messages fully above the chat viewport', () => {
  assert.match(photoLoop, /function pruneOffscreenPhotos\(\)/);
  assert.match(photoLoop, /chat\.getBoundingClientRect\(\)\.top/);
  assert.match(photoLoop, /querySelectorAll\('\.photo-loop-message'\)/);
  assert.match(photoLoop, /row\.getBoundingClientRect\(\)\.bottom < chatTop/);
  assert.match(photoLoop, /row\.remove\(\)/);
});

test('pruning preserves the visible scroll position', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '..', 'styles.css'), 'utf8');
  assert.match(css, /\.chat\{[^}]*overflow-anchor:none/s);
  assert.match(photoLoop, /const previousHeight = chat\.scrollHeight;/);
  assert.match(photoLoop, /const previousScrollTop = chat\.scrollTop;/);
  assert.match(photoLoop, /const removedHeight = previousHeight - chat\.scrollHeight;/);
  assert.match(photoLoop, /chat\.scrollTop = Math\.max\(0, previousScrollTop - removedHeight\);/);
});

test('photo stream scrolls to the latest photo after pruning', () => {
  assert.match(photoLoop, /done: answer => \{\s*pruneOffscreenPhotos\(\);\s*scrollChatToEnd\(\);/s);
});

test('photo stream scrolls again after the latest image finishes loading', () => {
  assert.match(photoLoop, /if \(done\) done\(answer\);/);
  assert.match(photoLoop, /done: answer => \{/);
  assert.match(photoLoop, /const image = answer\.querySelector\('img'\);/);
  assert.match(photoLoop, /if \(image && !image\.complete\) image\.addEventListener\('load', scrollChatToEnd, \{ once: true \}\);/);
});

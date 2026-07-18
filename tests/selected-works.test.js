const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.resolve(__dirname, '..', 'styles.css'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, '..', 'script.js'), 'utf8');

test('Selected Works know-more labels use the orange theme color', () => {
  assert.match(css, /^\.work-more\s*\{[^}]*color:var\(--orange\)/m);
});

test('Selected Work cards reveal one second apart', () => {
  assert.match(script, /targets\.forEach\(\(t, groupIndex\) => \{[^}]*--group-i[^}]*groupIndex/s);
  assert.match(css, /\.work-card\.rise\s*\{[^}]*animation-delay:\s*calc\(var\(--group-i\) \* 1s\)/s);
});

test('chat follows each Selected Work card as it reveals', () => {
  assert.match(script, /function followWorkReveals\(answer, seq\)/);
  assert.match(script, /answer\.querySelectorAll\('\.work-list \.work-card'\)/);
  assert.match(script, /if \(reduced\)\{ cards\.at\(-1\)\.scrollIntoView\(\{ behavior: 'instant', block: 'end' \}\); return; \}/);
  assert.match(script, /setTimeout\(\(\) => \{[\s\S]*?index \* 1000\)/);
  assert.match(script, /if \(seq !== renderSeq\) return;/);
  assert.match(script, /card\.scrollIntoView\(\{ behavior: 'smooth', block: 'end' \}\)/);
  assert.match(script, /followWorkReveals\(answer, seq\);[\s\S]*?followProjectReveals\(answer, seq\);/);
});

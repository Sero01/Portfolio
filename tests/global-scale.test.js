const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.resolve(__dirname, '..', 'styles.css'), 'utf8');

test('the interface is scaled up twenty percent via body zoom', () => {
  const body = css.match(/^body\{[^}]*\}/m)[0];
  assert.match(body, /zoom:1\.2/);
});

test('body is not size-compensated, so it fills the zoomed viewport', () => {
  // Standardized `zoom` already resolves percentages in the zoomed
  // coordinate space, so a `1/1.2` compensation would leave gaps.
  const body = css.match(/^body\{[^}]*\}/m)[0];
  assert.doesNotMatch(body, /83\.333333%/);
});

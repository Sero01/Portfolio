const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const script = fs.readFileSync(path.resolve(__dirname, '..', 'script.js'), 'utf8');
const tickLogic = script.slice(
  script.indexOf('function tickUpStats'),
  script.indexOf("const chat = document.querySelector('#chat')")
);

test('all stat counters wait one second after becoming visible', () => {
  assert.match(script, /const STAT_DELAY = 1000;/);
  assert.match(tickLogic, /el\.textContent = \(0\)\.toFixed\(decimals\) \+ suffix;/);
  assert.match(tickLogic, /setTimeout\([\s\S]*?requestAnimationFrame\(step\);[\s\S]*?STAT_DELAY\);/);
});

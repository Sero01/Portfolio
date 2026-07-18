const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const introLogic = js.slice(
  js.indexOf('/* ---------- intro ---------- */'),
  js.indexOf('/* ---------- message rendering ---------- */')
);

test('intro uses Parvez greeting as its primary heading', () => {
  assert.match(
    html,
    /<p class="intro-question">What would you like to know\?<\/p>\s*<h1 class="intro-greeting">[\s\S]*?<span>Hi, I am Parvez<\/span>[\s\S]*?<\/h1>/
  );
});

test('only the Send button launches the portfolio', () => {
  assert.match(introLogic, /send\.addEventListener\('click', launch\)/);
  assert.doesNotMatch(introLogic, /intro\.addEventListener\('click'/);
  assert.doesNotMatch(introLogic, /document\.addEventListener\('keydown'/);
  assert.doesNotMatch(introLogic, /later\(launch/);
});

test('demo cursor is an arrow pointer and the Send button pulses while waiting', () => {
  assert.match(css, /\.demo-cursor\s*\{[\s\S]*?mask:url\("assets\/icons\/cursor-pointer\.svg"\)/);
  assert.match(css, /\.send-button\.pulse\s*\{[^}]*animation:sendPulse/s);
  assert.doesNotMatch(css, /cursorPulse/);
  assert.match(introLogic, /send\.classList\.add\('pulse'\)/);
});

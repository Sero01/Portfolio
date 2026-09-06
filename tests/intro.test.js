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

test('intro leads with the Parvez greeting, nothing above it', () => {
  assert.match(
    html,
    /<div class="intro-hero">[\s\S]*?<p class="intro-kicker">Hi, I am<\/p>[\s\S]*?<h1 class="intro-masthead">Parvez<\/h1>/
  );
  assert.doesNotMatch(html, /intro-question|What would you like to know/);
});

test('on phones the theme menu is anchored to the card, not the toggle', () => {
  // the menu is ~300px wide; the toggle sits ~260px from the left edge on a
  // 360px screen, so right:0 on .model-wrap hangs it off the left of the
  // viewport. Below 480px it anchors to .intro-prompt / .composer instead.
  assert.match(css, /\.model-menu\{[\s\S]*?right:0/);
  assert.match(
    css,
    /@media\(max-width:480px\)[\s\S]*?\.model-wrap\{position:static\}[\s\S]*?\.model-menu\{left:0;right:0;min-width:0\}/
  );
  assert.match(css, /@media\(max-width:480px\)[\s\S]*?\.composer\{position:relative\}/);
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

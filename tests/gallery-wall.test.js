const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const gallery = script.slice(
  script.indexOf('const galleryWall = ['),
  script.indexOf('const photoSet = [')
);
const wallRenderer = script.slice(
  script.indexOf('function wallHtml()'),
  script.indexOf('const content = {')
);
const projectsSection = script.slice(
  script.indexOf("projects: { title: \"Side projects\""),
  script.indexOf("photos: { title: \"Photography\"")
);
const renderLogic = script.slice(
  script.indexOf('function render(key)'),
  script.indexOf('/* work card')
);

test('gallery contains the approved seven image-first projects', () => {
  const names = ['Speculum', 'Memory Wiki', 'Norman', 'Inklink', 'Pickpath', 'Watchparty', 'Agent Guides'];
  names.forEach(name => assert.match(gallery, new RegExp(`name: "${name}"`)));
  assert.doesNotMatch(gallery, /Emma|WhispnoteAI/);
  assert.match(gallery, /assets\/projects\/speculum\.gif/);
  assert.match(gallery, /assets\/projects\/memory-wiki\.gif/);
  assert.match(gallery, /assets\/projects\/Norman\.webp/);
  assert.match(gallery, /assets\/projects\/inklink\.gif/);
  assert.match(gallery, /assets\/projects\/pickpath\.gif/);
  assert.match(gallery, /assets\/projects\/watchparty\.webp/);
  assert.match(gallery, /assets\/projects\/agentguides\.webp/);
  assert.match(gallery, /https:\/\/pickpath-presell\.pages\.dev\//);
});

test('gallery markup uses visible accessible images', () => {
  assert.match(gallery, /alt: "/);
  assert.match(wallRenderer, /class="frame"/);
  assert.match(wallRenderer, /<img class="frame-plate" src="\$\{p\.img\}" alt="\$\{p\.alt\}"/);
  assert.doesNotMatch(wallRenderer, /frame-cover|frame--text|frame-plate--desc/);
  assert.doesNotMatch(projectsSection, /Hover a frame/);
});

test('sidebar summary reflects the new project wall', () => {
  assert.match(html, /Speculum · Pickpath · Inklink \+4/);
  assert.doesNotMatch(html, /Emma · Norman · inkling \+5/);
});

test('gallery CSS creates a horizontal-first two-column wall at the standard section width', () => {
  assert.match(renderLogic, /chat\.innerHTML = `<div class="thread"><\/div>`/);
  assert.doesNotMatch(css, /\.thread--projects/);
  assert.match(css, /\.wall\{[^}]*display:grid[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)[^}]*gap:18px/s);
  assert.match(css, /\.frame\{[^}]*align-self:start[^}]*width:100%/s);
  assert.match(css, /\.frame-plate\{[^}]*opacity:1/s);
  assert.doesNotMatch(css, /\.frame:hover/);
  assert.doesNotMatch(css, /grid-auto-rows|frame--wide|frame--tall|frame--large/);
  assert.doesNotMatch(css, /[;{]columns:/);
  assert.match(css, /@media\(max-width:480px\)[\s\S]*?\.wall\{grid-template-columns:1fr/);
});

test('gallery media preserves its full intrinsic aspect ratio without cropping', () => {
  const framePlateCss = css.match(/\.frame-plate\{([^}]*)\}/s)?.[1] || '';
  assert.match(framePlateCss, /width:100%[^}]*height:auto/s);
  assert.doesNotMatch(framePlateCss, /object-fit|height:100%/);
});

test('project tiles reveal every 500ms and reduced motion removes the delay', () => {
  assert.match(css, /\.frame\.rise\{[^}]*animation-delay:calc\(var\(--i\) \* 500ms\)/s);
  assert.match(css, /@keyframes galleryReveal/);
  const reducedMotion = css.slice(css.indexOf('@media(prefers-reduced-motion:reduce)'));
  assert.match(reducedMotion, /\.frame\.rise\{[^}]*animation:none[^}]*opacity:1/s);
});

test('chat follows each project 2 seconds after its 500ms reveal point', () => {
  assert.match(script, /function followProjectReveals\(answer, seq\)/);
  assert.match(script, /answer\.querySelectorAll\('\.wall \.frame'\)/);
  assert.match(script, /setTimeout\([\s\S]*?2000 \+ index \* 500\)/);
  assert.match(script, /if \(seq !== renderSeq\) return;/);
  assert.match(script, /frame\.scrollIntoView\(\{ behavior: 'smooth', block: 'end' \}\)/);
  assert.match(script, /followProjectReveals\(answer, seq\);/);
  assert.doesNotMatch(script, /scheduleProjectScroll/);
  const followLogic = script.slice(
    script.indexOf('function followProjectReveals'),
    script.indexOf('function addUserMsg')
  );
  assert.doesNotMatch(followLogic, /scrollChatToEnd\(\)/);
});

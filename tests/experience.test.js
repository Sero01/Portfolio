const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const experience = script.slice(
  script.indexOf('experience: {'),
  script.indexOf('projects: {')
);

test('experience roles are four separate timeline messages', () => {
  assert.equal((experience.match(/timeline: "(?:first|middle|last)"/g) || []).length, 4);
  assert.match(experience, /timeline: "first"/);
  assert.equal((experience.match(/timeline: "middle"/g) || []).length, 2);
  assert.match(experience, /timeline: "last"/);
  for (const title of [
    'Senior Analyst — AI Engineer',
    'Analyst, Software Engineer',
    'Front-End Engineering Intern',
    'Full-Stack Developer Intern'
  ]) assert.match(experience, new RegExp(title));
});

test('assistant rows map timeline metadata to connector classes', () => {
  assert.match(script, /timeline-message/);
  assert.match(script, /`timeline-\$\{timeline\}`/);
  assert.match(script, /timeline: msg\.timeline/);
  assert.match(css, /\.timeline-message \.answer::before/);
  assert.match(css, /\.timeline-message\.timeline-first \.answer::before/);
  assert.match(css, /\.timeline-message\.timeline-last \.answer::before/);
});

test('experience details render immediately without disclosure interaction', () => {
  assert.doesNotMatch(experience, /Hover a role|hint-line/);
  assert.doesNotMatch(script, /const role = e\.target\.closest\('\.role'\)/);
  assert.match(css, /\.story\s*\{[^}]*grid-template-rows:1fr/s);
  assert.doesNotMatch(css, /\.role:hover \.story|\.role\.open \.story/);
  assert.doesNotMatch(css, /\.role\s*\{[^}]*cursor:pointer/s);
});

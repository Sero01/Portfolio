const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const contact = script.slice(
  script.indexOf('contact: { title: "Let’s talk"'),
  script.indexOf("const reduced = matchMedia")
);

test('contact form posts the required fields to Formspree', () => {
  assert.match(contact, /<form class="contact-form" action="https:\/\/formspree\.io\/f\/xdaqgnvj" method="POST">/);
  assert.match(contact, /<label for="contact-name">Name<\/label>[\s\S]*?<input[^>]*id="contact-name"[^>]*name="name"[^>]*required/);
  assert.match(contact, /<label for="contact-email">Email<\/label>[\s\S]*?<input[^>]*type="email"[^>]*id="contact-email"[^>]*name="email"[^>]*required/);
  assert.match(contact, /<label for="contact-service">Service Needed \?<\/label>[\s\S]*?<select[^>]*id="contact-service"[^>]*name="service"[^>]*required/);
  assert.match(contact, /<textarea[^>]*id="contact-message"[^>]*name="message"/);
  assert.doesNotMatch(contact.match(/<textarea[^>]*>/)?.[0] || '', /required/);
});

test('contact form contains the approved service choices and inline status', () => {
  ['Build agentic systems', 'AI Automations', 'Frontend design', 'Backend Development', 'Others']
    .forEach(option => assert.match(contact, new RegExp(`<option value="${option}">${option}</option>`)));
  assert.match(contact, /class="contact-status"[^>]*aria-live="polite"/);
  assert.match(contact, /Email me ↗[\s\S]*GitHub ↗[\s\S]*LinkedIn ↗/);
});

test('contact form submits asynchronously and reports the result inline', () => {
  assert.match(script, /async function submitContactForm\(form\)/);
  assert.match(script, /fetch\(form\.action, \{[\s\S]*method: 'POST'[\s\S]*body: new FormData\(form\)[\s\S]*'Accept': 'application\/json'/);
  assert.match(script, /if \(response\.ok\)[\s\S]*form\.reset\(\)[\s\S]*Message sent/);
  assert.match(script, /Something went wrong/);
  assert.match(script, /chat\.addEventListener\('submit'/);
  assert.match(script, /target\.matches\('\.contact-form'\)/);
});

test('contact form follows the reference layout responsively', () => {
  assert.match(css, /\.contact-fields\{[^}]*display:grid[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/s);
  assert.match(css, /\.contact-field--wide\{[^}]*grid-column:1\/-1/s);
  assert.match(css, /\.contact-control\{[^}]*border-radius:[^;}]+[^}]*background:var\(--bubble\)/s);
  assert.match(css, /@media\(max-width:480px\)[\s\S]*?\.contact-fields\{grid-template-columns:1fr\}/);
});

# Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive Formspree contact form with inline success and error feedback to the “Let’s talk” section.

**Architecture:** Render semantic form markup inside the existing dynamic contact answer, style it with scoped theme-aware CSS, and use delegated submission handling on `#chat` because section content is recreated on navigation. Preserve native Formspree submission as the no-JavaScript fallback.

**Tech Stack:** HTML templates in JavaScript, CSS, browser Fetch API, Formspree, Node.js built-in test runner

## Global Constraints

- Endpoint: `https://formspree.io/f/xdaqgnvj` using `POST`.
- Name, Email, and Service Needed are required; Message is optional.
- Service choices are Build agentic systems, AI Automations, Frontend design, Backend Development, and Others.
- Success and failure feedback appear inline.
- Existing contact links remain.

---

### Task 1: Contact form behavior and presentation

**Files:**
- Create: `tests/contact-form.test.js`
- Modify: `script.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: submit events bubbling through `#chat`
- Produces: `.contact-form` markup and `submitContactForm(form): Promise<void>`

- [ ] **Step 1: Write failing static tests**

Test the endpoint, POST method, labeled named fields, required attributes, exact select choices, optional textarea, live status region, delegated submit handler, JSON Formspree request, inline success/error behavior, reset-on-success only, responsive two-column layout, and retained contact links.

- [ ] **Step 2: Verify tests fail**

Run: `node --test tests/contact-form.test.js`

Expected: FAIL because the form is absent.

- [ ] **Step 3: Add semantic form markup**

Replace the contact card content with a `.contact-form` posting to the approved endpoint. Add Name, Email, Service Needed, optional Message, submit button, live status, and the existing link row.

- [ ] **Step 4: Add scoped responsive styles**

Create a two-column `.contact-fields` grid, full-width service/message fields, rounded theme-aware controls, focus/disabled/status states, and a single-column mobile override.

- [ ] **Step 5: Add delegated async submission**

Listen for submit on `chat`, identify `.contact-form`, validate, send `FormData` with `Accept: application/json`, reset and report success for `response.ok`, and preserve values/report failure otherwise.

- [ ] **Step 6: Verify focused and full suites**

Run: `node --test tests/contact-form.test.js`

Expected: all contact-form tests PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS with no failures.

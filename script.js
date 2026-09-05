/* ---------- content ---------- */
const workDetails = {
  docval: { name: "DocVal", ask: "Tell me more about DocVal", html: `
    <p class="lead">DocVal ingests any bank statement — native PDF or phone-camera scan — and returns typed, validated transactions.</p>
    <p>Two extraction paths land in one schema: a deterministic parser for native PDFs, and a vision model for scans with a per-page fallback that rescues the dense statements a full-document pass garbles. Every row then has to survive arithmetic — opening balance + credits − debits must equal closing, per page and per statement. If the math doesn't hold, the extraction doesn't ship.</p>
    <div class="stat-grid"><div class="stat"><b>0.63</b><small>held-out transaction F1</small></div><div class="stat"><b>0.92</b><small>synthetic docs F1</small></div><div class="stat"><b>0.42</b><small>real phone scans F1</small></div><div class="stat"><b>1%</b><small>error rate, down from 13%</small></div></div>
    <p>The honest part: real scans are genuinely hard, and 0.42 is published right next to the pretty synthetic number. Cost is tracked beside accuracy — about $0.008 per document — and CI regression gates re-run the eval on every push.</p>
    <p>Under DocVal — and ReconMatch — sits one eval harness, and it's the part nobody demos: schema validation, then arithmetic checks, then a held-out benchmark the models never train or prompt against, cost a first-class metric next to accuracy, and CI refusing any push that regresses either. It's what earns the numbers. It caught what eyeballing never would — silent output truncation on long statements, nondeterminism at temperature zero, a provider injecting errors mid-stream, and a commercial benchmark whose scoring API was broken server-side, which I reported upstream rather than quietly dropping the comparison. Benchmarks lie; a good harness is how you catch them doing it.</p>
    <p class="card-links"><a href="/docval/">How it works →</a> · <a href="/eval-case-study/">Eval case study →</a> · <a href="https://docval-yy4s.onrender.com" target="_blank" rel="noopener">Live demo ↗</a> · <a href="https://github.com/Sero01/docval" target="_blank" rel="noopener">GitHub ↗</a></p>`},
  reconmatch: { name: "ReconMatch", ask: "Tell me more about ReconMatch", html: `
    <p class="lead">ReconMatch pairs two transaction ledgers and explains every decision it makes.</p>
    <p>Matching runs in tiers — exact, date-windowed, then split matching for the one-to-many cases that break naive joins. Nothing is a black box: every match carries its reasoning, and every unmatched line is classified as a typed break with a suggested resolution instead of being dumped into an "exceptions" pile.</p>
    <div class="stat-grid"><div class="stat"><b>95.9%</b><small>auto-match rate</small></div><div class="stat"><b>1.00</b><small>precision at that rate</small></div><div class="stat"><b>0.98</b><small>pair F1</small></div><div class="stat"><b>100%</b><small>matches explainable</small></div></div>
    <p>Precision 1.00 is the number that matters: at a 95.9% auto-match rate it makes zero wrong pairings on the held-out set, because a reconciliation tool that guesses is worse than no tool at all.</p>
    <p>I then took the approach to <b>BenchRec</b> (ICAIF 2023), a third-party reconciliation benchmark with a published baseline. One frozen held-out run, strict exact-set scoring, nothing tuned against it: <b>88.65% versus the published baseline's 62.45%</b>, and the first method to score above zero on many-to-many groups — 70.4% against 0.00%. The same work also proved a 99.8% auto-accept bar is <em>unreachable</em> on that dataset, because group membership there is genuinely underdetermined from the observable fields. So those matches ship as review-grade suggestions, and that research lives in a branch — it is not yet folded into the live demo.</p>
    <p class="card-links"><a href="/reconmatch/">How it works →</a> · <a href="https://reconmatch-aa9c.onrender.com" target="_blank" rel="noopener">Live demo ↗</a> · <a href="https://github.com/Sero01/reconmatch" target="_blank" rel="noopener">GitHub ↗</a></p>`},
  tinyrouter: { name: "the Inbox Firewall", ask: "Tell me more about the Inbox Firewall", html: `
    <p class="lead">I started with a simple question: <b>how small can an AI model be before it stops being safe to let it act on your inbox?</b></p>
    <p>I built a system where every email had to become one of five actions: ignore it, mark it urgent, archive it, draft a reply, or escalate it to a human. A hand-written validator parses every action, never <code>eval</code>, and a tier policy decides what may auto-execute. I tested it on 1,028 messages, keeping the difficult and malicious ones hidden until the final test. Even a simple rules-based router performed surprisingly well, correctly routing 88.1% of messages while handling about 75% automatically.</p>
    <figure class="card-figure"><img src="assets/photos/tiny-router-diagram.png" width="1774" height="887" alt="The pipeline: message, router, typed DSL line, validator, tier policy, execute or draft, with an escalate path branching out for low-confidence, malformed, untrusted or ambiguous messages." loading="lazy"><figcaption>Anything low-confidence, malformed, untrusted, or ambiguous leaves by the escalate path instead of acting.</figcaption></figure>
    <p>Then I found the 11: messages the router acted on confidently that it should have handed to a human. Six were prompt injections, the rest phishing. Every one produced a perfectly well-formed action, so the validator was powerless. The obvious fix was calibration, and it failed in an interesting way. Fitting the confidence scores on held-out clean data drove calibration error from 0.245 to 0.000, but unsafe executions were still at 11, because calibration maps nearly every confident score to ~1.0 and the gate ends up waving the injections through. <b>Being confident, even being well-calibrated, doesn't mean you're safe when an attacker controls the input.</b></p>
    <p>What did move it was a security layer that treats the email itself as untrusted and looks for signs it is trying to manipulate the AI: unsafe 11 to 7, prompt-injection failures 6 to 2, for a small drop in coverage. The remaining failures are harder phishing and social engineering, a different threat needing a different layer. I couldn't benchmark the tiny 26M model because my hardware wasn't sufficient, but that didn't change the conclusion: the model determines how much I can automate, while the safety boundary needs to live outside the model, in strict rules and security checks. Built collaboratively in <b>Council</b> (Claude Code + Codex, its own card below).</p>
    <p class="card-links"><a href="/inbox-firewall/">Case study &amp; live lab →</a> &middot; <a href="https://github.com/Sero01/tiny-router-poc" target="_blank" rel="noopener">GitHub ↗</a></p>`},
  council: { name: "Council", ask: "Tell me more about Council", html: `
    <p class="lead">Council is a terminal chat where Claude Code and Codex work the same repo alongside me — group-chat style.</p>
    <p>Both agents run through my own logged-in CLIs, see each other's replies, and can answer one another for a capped number of hops before the floor returns to me. Files and commands are theirs to touch. What makes it produce real work instead of two bots talking past each other is <b>ownership</b>: each agent owns a slice of the codebase — one the action DSL, corpus, harness and baselines; the other the model adapter, confidence, calibration and tests — and neither edits the other's files without a handoff in the chat.</p>
    <p>The Inbox Firewall above is what I put it to work on: a full safety study the two agents built end to end while I steered. Council itself is public and runs locally — there's no hosted demo, since the interesting artifact is the study it produced.</p>
    <p class="card-links"><a href="https://github.com/Sero01/council" target="_blank" rel="noopener">GitHub ↗</a></p>`}
};

const galleryWall = [
  { name: "Speculum", meta: "2026 · introspection", img: "assets/projects/speculum.gif", href: "https://github.com/Sero01/speculum", alt: "Speculum agent introspection dashboard" },
  { name: "Memory Wiki", meta: "2026 · knowledge base", img: "assets/projects/memory-wiki.gif", href: "https://github.com/Sero01/memory-wiki", alt: "Memory Wiki searchable conversation archive" },
  { name: "Norman", meta: "2025 · sniper agent", img: "assets/projects/Norman.webp", href: "https://github.com/Sero01/Norman", alt: "Norman offline agent interface" },
  { name: "Inklink", meta: "2026 · generative type", img: "assets/projects/inklink.gif", href: "https://github.com/Sero01/inkling", alt: "Inklink generative typography journal" },
  { name: "Pickpath", meta: "2026 · decision tool", img: "assets/projects/pickpath.gif", href: "https://pickpath-presell.pages.dev/", alt: "Pickpath guided decision experience" },
  { name: "Watchparty", meta: "2026 · realtime", img: "assets/projects/watchparty.webp", href: "https://github.com/Sero01/watchparty", alt: "Watchparty synchronized video streaming interface" },
  { name: "Agent Guides", meta: "2026 · writing", img: "assets/projects/agentguides.webp", href: "https://github.com/Sero01/ai-agents-guide", alt: "Agent Guides field guide website" }
];

const photoSet = [
  [1, "Bangalore traffic"], [2, "Koi fish"], [3, "Sinhagargh, Pune"],
  [4, "Melancholic dusk"], [5, "Street lamp"], [6, "Marigold"],
  [7, "Muscat view point"], [8, "Bandar Al Khairan"], [9, "Sultan's cruise"],
  [10, "Between the walls"], [11, "Flowers beyond"], [12, "Sonder"],
  [13, "The fishermen"], [14, "The arch"]
];

function wallHtml(){
  return `<div class="wall">${galleryWall.map(p => `
    <a class="frame" href="${p.href}" target="_blank" rel="noopener">
      <img class="frame-plate" src="${p.img}" alt="${p.alt}" loading="lazy">
      <span class="frame-placard"><b>${p.name}</b><small>${p.meta}</small></span>
    </a>`).join('')}</div>`;
}

function photoHtml([n, caption]){
  const id = String(n).padStart(2, '0');
  return `<figure class="photo-msg"><img src="assets/photos/photo-${id}.webp" alt="${caption}" loading="lazy"><figcaption>FR-${id} · ${caption}</figcaption></figure>`;
}

const content = {
  home: { title: "Hi, I am Parvez", thread: [
    { u: "Tell me about yourself" },
    { a: `
    <div class="eyebrow">Parvez Ahmed · AI engineer · Bengaluru</div>
    <h1>I design, build, and <em>ship </em>systems </h1>
    <p class="lead">Agents, document intelligence, designs, realtime apps, and automations. Everything here is shipped, measured, and public.</p>
    <div class="stat-grid"><div class="stat"><b>10+</b><small>systems shipped &amp; live</small></div><div class="stat"><b>95.9%</b><small>auto-match @ precision 1.00</small></div><div class="stat"><b>16</b><small>services modernized</small></div><div class="stat"><b>800+</b><small>CVEs closed</small></div></div>
    <div class="pills"><span class="pill">Agents &amp; RAG</span><span class="pill">Document AI</span><span class="pill">Voice &amp; local-first</span><span class="pill">Realtime · WebRTC</span><span class="pill">Java · Python</span></div>
    <p>By day I'm an AI engineer at a global bank — agentic RAG over legacy systems, reconciliation ML, and the unglamorous migrations that keep it all running. After hours I run a small fleet of my own: local agents with their own memory and dashboards, voice tools, a generative-typography journal, a watch-party app. </p>` }
  ]},
  work: { title: "Selected work", thread: [
    { u: "Show me your strongest work" },
    { a: `
    <div class="eyebrow">Selected work · live, tested, numbered</div><h2>Systems built for trust, not demos.</h2><p>Click any card and I'll go deeper.</p>
    <div class="work-list">
      <button class="work-card" data-detail="docval"><span class="work-head"><h3>DocVal</h3><b>0.92 F1</b></span><p>Bank statements — native or scanned — into validated, typed transactions.</p><span class="work-more">Click to know more →</span></button>
      <button class="work-card" data-detail="reconmatch"><span class="work-head"><h3>ReconMatch</h3><b>95.9% @ P 1.00</b></span><p>Two ledgers in, explained matches and classified breaks out.</p><span class="work-more">Click to know more →</span></button>
      <button class="work-card" data-detail="tinyrouter"><span class="work-head"><h3>Inbox Firewall</h3><b>26M router</b></span><p>How small can a model get before local automation stops being safe? A tiny router, a typed DSL, a hard safety boundary.</p><span class="work-more">Click to know more →</span></button>
      <button class="work-card" data-detail="council"><span class="work-head"><h3>Council</h3><b>2 agents, 1 repo</b></span><p>Claude Code + Codex working the same repo in my terminal, group-chat style.</p><span class="work-more">Click to know more →</span></button>
    </div>` }
  ]},
  experience: { title: "Experience", thread: [
    { u: "Walk me through your experience" },
    { a: `
    <div class="eyebrow">Professional experience · newest first</div><h2>Production engineering, with measurable outcomes.</h2>` },
    { a: `<div class="role"><div class="role-line"><span class="date">APR 2026 — PRESENT</span><h3>Senior Analyst — AI Engineer</h3><span class="org">Northern Trust · Bengaluru</span></div><div class="story"><div><ul><li>Agentic RAG over legacy AS/400 code using Azure OpenAI, Neo4j, and LLM-generated Cypher.</li><li>ML matching for the one-to-many and many-to-many reconciliation breaks TLM cannot auto-resolve.</li><li>Upgraded 16 microservices from Java 8 → 21 and Spring Boot 2 → 3; remediated 800+ CVEs across a validation layer processing 500–600 daily files from 30+ upstreams, catching ~10–15 loading errors/day before TLM ingestion.</li></ul></div></div></div>`, timeline: "first" },
    { a: `<div class="role"><div class="role-line"><span class="date">AUG 2024 — MAR 2026</span><h3>Analyst, Software Engineer</h3><span class="org">Northern Trust · Bengaluru</span></div><div class="story"><div><ul><li>Zero-downtime migration of 21 Spring Boot services.</li><li>TLM HTML → XLSX in under 5 seconds; adopted company-wide.</li><li>ISO → CAMT.053 pipeline reduced from ~9 minutes to under 50 seconds (−82%).</li><li>GitHub Actions cut deployment time 40%; production RHEL 7 → 8 migration.</li></ul></div></div></div>`, timeline: "middle" },
    { a: `<div class="role"><div class="role-line"><span class="date">JUN — SEP 2023</span><h3>Front-End Engineering Intern</h3><span class="org">Northern Trust · Bengaluru</span></div><div class="story"><div><ul><li>Improved Lighthouse scores 25% through audits, code splitting, and accessibility fixes.</li></ul></div></div></div>`, timeline: "middle" },
    { a: `<div class="role"><div class="role-line"><span class="date">OCT 2022 — MAR 2023</span><h3>Full-Stack Developer Intern</h3><span class="org">Škoda Volkswagen Training Academy · Pune</span></div><div class="story"><div><ul><li>Built a Django, React, PostgreSQL decision system for 100+ dealership branches.</li></ul></div></div></div>`, timeline: "last" }
  ]},
  projects: { title: "Side projects", thread: [
    { u: "What do you build outside work?" },
    { a: `
    <div class="eyebrow">The gallery · experiments that shipped</div><h2>Curiosity, made executable.</h2><p>A wall of the systems I built to answer my own questions. Each frame opens the project.</p>
    ${wallHtml()}` }
  ]},
  photos: { title: "Photography", thread: [
    { u: "Show me the world through your eyes" },
    { a: `<div class="eyebrow">Off-ledger assets · photography</div><h2>Light, motion, and quieter systems.</h2><p>What I notice when I'm not thinking about token costs. The stream stays open —</p>` }
  ]},
  contact: { title: "Let’s talk", thread: [
    { u: "How can I reach you?" },
    { a: `
    <div class="eyebrow">Open items</div><h1>Let’s build something<br><em>together.</em></h1><p class="lead">If you're working on something that has to actually work — documents, agents, matching, realtime — I'd like to hear about it.</p>
    <div class="contact-card">
      <form class="contact-form" action="https://formspree.io/f/xdaqgnvj" method="POST">
        <div class="contact-fields">
          <div class="contact-field"><label for="contact-name">Name</label><input class="contact-control" type="text" id="contact-name" name="name" placeholder="John Smith" autocomplete="name" required></div>
          <div class="contact-field"><label for="contact-email">Email</label><input class="contact-control" type="email" id="contact-email" name="email" placeholder="johnsmith@gmail.com" autocomplete="email" required></div>
          <div class="contact-field contact-field--wide"><label for="contact-service">Service Needed ?</label><select class="contact-control" id="contact-service" name="service" required><option value="" selected disabled>Select…</option><option value="Build agentic systems">Build agentic systems</option><option value="AI Automations">AI Automations</option><option value="Frontend design">Frontend design</option><option value="Backend Development">Backend Development</option><option value="Others">Others</option></select></div>
          <div class="contact-field contact-field--wide"><label for="contact-message">What can I help you… <span>Optional</span></label><textarea class="contact-control" id="contact-message" name="message" rows="5" placeholder="Hello, I'd like to enquire about…"></textarea></div>
        </div>
        <div class="contact-actions"><button class="contact-submit" type="submit">Send message →</button><p class="contact-status" aria-live="polite"></p></div>
      </form>
      <div class="contact-links"><a href="mailto:126ahmedparvez@gmail.com">Email me ↗</a><a href="https://github.com/Sero01" target="_blank" rel="noopener">GitHub ↗</a><a href="https://www.linkedin.com/in/parvez-ahmed-b47680124/" target="_blank" rel="noopener">LinkedIn ↗</a></div>
    </div>` }
  ]}
};

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- theme ---------- */
const THEME_KEY = 'portfolio-theme';
function applyTheme(theme){
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  document.querySelector('#metaTheme').content = theme === 'dark' ? '#262624' : '#f7f6f2';
  const next = theme === 'dark' ? 'light' : 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach(b => b.setAttribute('aria-label', `Switch to ${next} mode`));
  document.querySelectorAll('[data-model-label]').forEach(l => l.textContent = theme === 'dark' ? 'Dark' : 'Light');
  document.querySelectorAll('.model-menu [data-set-theme]').forEach(o => o.classList.toggle('current', o.dataset.setTheme === theme));
}
function closeModelMenus(){
  document.querySelectorAll('.model-menu').forEach(m => m.hidden = true);
  document.querySelectorAll('[data-model-select]').forEach(b => b.setAttribute('aria-expanded','false'));
}
document.querySelectorAll('[data-theme-toggle]').forEach(btn =>
  btn.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')));
document.querySelectorAll('[data-model-select]').forEach(btn =>
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const menu = btn.parentElement.querySelector('.model-menu');
    const willOpen = menu.hidden;
    closeModelMenus();
    menu.hidden = !willOpen;
    btn.setAttribute('aria-expanded', String(willOpen));
  }));
document.querySelectorAll('.model-menu [data-set-theme]').forEach(opt =>
  opt.addEventListener('click', e => { e.stopPropagation(); applyTheme(opt.dataset.setTheme); closeModelMenus(); }));
document.addEventListener('click', () => closeModelMenus());
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModelMenus(); });
applyTheme(document.documentElement.dataset.theme || 'light');

/* ---------- intro ---------- */
const intro = document.querySelector('#intro');
const app = document.querySelector('#app');
const introText = document.querySelector('#introText');
const send = document.querySelector('#introSend');
const cursor = document.querySelector('#demoCursor');
const promptBox = document.querySelector('#introPrompt');
const INTRO_LINE = 'Tell me about yourself';
let launched = false;
const introTimers = [];
const later = (fn, ms) => { const id = setTimeout(fn, ms); introTimers.push(id); return id; };

function typeIntro(){
  if (reduced){ introText.textContent = INTRO_LINE; promptBox.classList.add('ready'); return; }
  let i = 0;
  const timer = setInterval(() => {
    introText.textContent = INTRO_LINE.slice(0, ++i);
    if (i === INTRO_LINE.length){
      clearInterval(timer);
      promptBox.classList.add('ready');
      later(animateCursor, 350);
    }
  }, 55);
  introTimers.push(timer);
}
function animateCursor(){
  // getBoundingClientRect returns visual (post-zoom) coordinates, but the
  // cursor's left/top live in the zoomed body's local space, so divide by
  // the body zoom factor to keep the pointer aligned with the Send button.
  const zoom = parseFloat(getComputedStyle(document.body).zoom) || 1;
  const rect = send.getBoundingClientRect();
  cursor.style.left = `${innerWidth * .72 / zoom}px`;
  cursor.style.top = `${innerHeight * .78 / zoom}px`;
  cursor.classList.add('move');
  requestAnimationFrame(() => {
    cursor.style.left = `${(rect.left + rect.width / 2) / zoom - 10}px`;
    cursor.style.top = `${(rect.top + rect.height / 2) / zoom - 10}px`;
    later(() => send.classList.add('pulse'), 1000);
  });
}
function launch(){
  if (launched) return;
  launched = true;
  introTimers.forEach(clearTimeout);
  introText.textContent = INTRO_LINE;
  intro.classList.add('exit');
  app.classList.add('visible');
  app.setAttribute('aria-hidden', 'false');
  setTimeout(() => { intro.hidden = true; render('home'); }, reduced ? 0 : 600);
}
send.addEventListener('click', launch);

/* ---------- composer guided tour ---------- */
const TOUR_ORDER = ['home', 'work', 'experience', 'projects', 'photos', 'contact'];
const COMPOSER_IDLE = 'Ask about my work…';
const composer = document.querySelector('.composer');
const composerText = document.querySelector('#composerText');
const composerSend = document.querySelector('.composer-send');
let pendingNext = null;
let composerTimer;

function nextSection(key){
  const i = TOUR_ORDER.indexOf(key);
  return i === -1 ? null : (TOUR_ORDER[i + 1] || null);
}

/* Reset the composer to its idle placeholder and drop any pending target. */
function resetComposer(){
  clearInterval(composerTimer);
  composerSend.classList.remove('pulse');
  composer.classList.remove('has-prompt');
  composerText.textContent = COMPOSER_IDLE;
  pendingNext = null;
}

/* Type the next-section prompt into the composer, then pulse the send button. */
function typeComposer(text, seq){
  clearInterval(composerTimer);
  composer.classList.add('has-prompt');
  if (reduced){ composerText.textContent = text; return; }
  composerText.textContent = '';
  let i = 0;
  composerTimer = setInterval(() => {
    if (seq !== renderSeq){ clearInterval(composerTimer); return; }
    composerText.textContent = text.slice(0, ++i);
    if (i === text.length){
      clearInterval(composerTimer);
      composerSend.classList.add('pulse');
    }
  }, 45);
}

/* Called when a section finishes rendering: prefill the next prompt, or rest at the terminus. */
function onSectionComplete(key, seq){
  if (seq !== renderSeq) return;
  const next = nextSection(key);
  if (!next) return;
  pendingNext = next;
  typeComposer(content[next].thread[0].u, seq);
}

composerSend.addEventListener('click', () => { if (pendingNext) render(pendingNext); });

/* ---------- message rendering ---------- */
function animateWords(root){
  if (reduced) return;
  root.querySelectorAll('h1,h2,.lead').forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
    let w = 0;
    nodes.forEach(node => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        const s = document.createElement('span');
        s.textContent = part;
        s.className = 'token';
        s.style.animationDelay = `${(w++) * 24}ms`;
        frag.appendChild(s);
      });
      node.replaceWith(frag);
    });
  });
}

function cascadeBlocks(answer){
  const groups = ['.stat-grid', '.work-list', '.wall', '.timeline', '.pills', '.side-list'];
  let i = 0;
  [...answer.children].forEach(child => {
    const targets = groups.some(sel => child.matches(sel)) ? [...child.children] : [child];
    targets.forEach((t, groupIndex) => {
      t.style.setProperty('--i', i++);
      t.style.setProperty('--group-i', groupIndex);
      t.classList.add('rise');
    });
  });
}

const STAT_DELAY = 1000;

function tickUpStats(answer){
  if (reduced) return;
  const stats = [];
  answer.querySelectorAll('.stat b').forEach(el => {
    const raw = el.textContent;
    const m = raw.match(/^([\d.]+)(.*)$/);
    if (!m) return;
    const target = parseFloat(m[1]);
    const decimals = (m[1].split('.')[1] || '').length;
    const suffix = m[2];
    el.textContent = (0).toFixed(decimals) + suffix;
    stats.push({ el, target, decimals, suffix });
  });
  setTimeout(() => {
    stats.forEach(({ el, target, decimals, suffix }) => {
      const t0 = performance.now(), dur = 700;
      const step = now => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, STAT_DELAY);
}

const chat = document.querySelector('#chat');
let renderSeq = 0;

function scrollChatToEnd(){
  chat.scrollTo({ top: chat.scrollHeight, behavior: reduced ? 'instant' : 'smooth' });
}

async function submitContactForm(form){
  const button = form.querySelector('.contact-submit');
  const status = form.querySelector('.contact-status');
  button.disabled = true;
  button.textContent = 'Sending…';
  status.textContent = '';
  status.className = 'contact-status';
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok){
      form.reset();
      status.textContent = 'Message sent — I’ll get back to you soon.';
      status.classList.add('is-success');
    } else {
      status.textContent = 'Something went wrong. Please try again.';
      status.classList.add('is-error');
    }
  } catch {
    status.textContent = 'Something went wrong. Please check your connection and try again.';
    status.classList.add('is-error');
  } finally {
    button.disabled = false;
    button.textContent = 'Send message →';
  }
}

chat.addEventListener('submit', event => {
  const target = event.target;
  if (!target.matches('.contact-form')) return;
  event.preventDefault();
  submitContactForm(target);
});

function followWorkReveals(answer, seq){
  const cards = [...answer.querySelectorAll('.work-list .work-card')];
  if (!cards.length) return;
  if (reduced){ cards.at(-1).scrollIntoView({ behavior: 'instant', block: 'end' }); return; }
  cards.forEach((card, index) => setTimeout(() => {
    if (seq !== renderSeq) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, index * 1000));
}

function followProjectReveals(answer, seq){
  const frames = [...answer.querySelectorAll('.wall .frame')];
  if (!frames.length) return;
  if (reduced){ frames.at(-1).scrollIntoView({ behavior: 'instant', block: 'end' }); return; }
  frames.forEach((frame, index) => setTimeout(() => {
    if (seq !== renderSeq) return;
    frame.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 2000 + index * 500));
}

function addUserMsg(thread, text){
  thread.insertAdjacentHTML('beforeend',
    `<div class="user-row"><div class="user-bubble">${text}</div></div>`);
}

/* Appends an assistant message: typing dots first, then the content. */
function addAssistantMsg(thread, html, seq, { think = 550, scroll = false, timeline = '', done } = {}){
  thread.insertAdjacentHTML('beforeend',
    `<div class="assistant-row"><div class="assistant-mark">P</div><div class="answer-slot"></div></div>`);
  const row = thread.lastElementChild;
  if (timeline) row.classList.add('timeline-message', `timeline-${timeline}`);
  const finish = () => {
    if (seq !== renderSeq) return;
    row.querySelector('.answer-slot').outerHTML = `<div class="answer">${html}</div>`;
    const answer = row.querySelector('.answer');
    animateWords(answer);
    cascadeBlocks(answer);
    tickUpStats(answer);
    followWorkReveals(answer, seq);
    followProjectReveals(answer, seq);
    if (scroll) scrollChatToEnd();
    if (done) done(answer);
  };
  if (reduced){ finish(); return row; }
  setTimeout(() => {
    if (seq !== renderSeq) return;
    row.querySelector('.answer-slot').innerHTML = `<div class="typing-dots"><i></i><i></i><i></i></div>`;
    if (scroll) scrollChatToEnd();
    setTimeout(finish, think);
  }, 220);
  return row;
}

function pruneOffscreenPhotos(){
  const previousHeight = chat.scrollHeight;
  const previousScrollTop = chat.scrollTop;
  const chatTop = chat.getBoundingClientRect().top;
  chat.querySelectorAll('.photo-loop-message').forEach(row => {
    if (row.getBoundingClientRect().bottom < chatTop) row.remove();
  });
  const removedHeight = previousHeight - chat.scrollHeight;
  chat.scrollTop = Math.max(0, previousScrollTop - removedHeight);
}

function startPhotoLoop(thread, seq){
  let index = 0;
  const appendNext = () => {
    if (seq !== renderSeq) return;
    const photo = photoSet[index % photoSet.length];
    const row = addAssistantMsg(thread, photoHtml(photo), seq, {
      think: 400,
      scroll: true,
      done: answer => {
        pruneOffscreenPhotos();
        scrollChatToEnd();
        const image = answer.querySelector('img');
        if (image && !image.complete) image.addEventListener('load', scrollChatToEnd, { once: true });
        setTimeout(appendNext, 1380);
      }
    });
    row.classList.add('photo-loop-message');
    index++;
  };
  appendNext();
}

function render(key){
  const item = content[key];
  if (!item) return;
  const seq = ++renderSeq;
  document.querySelectorAll('.history-item').forEach(b => b.classList.toggle('active', b.dataset.section === key));
  document.querySelector('#conversationTitle').firstChild.textContent = item.title + ' ';
  document.querySelector('#sidebar').classList.remove('open');
  resetComposer();

  chat.innerHTML = `<div class="thread"></div>`;
  chat.scrollTop = 0;
  const thread = chat.querySelector('.thread');

  const queue = [...item.thread];
  const next = (isFirstAnswer) => {
    if (seq !== renderSeq) return;
    if (!queue.length){
      if (key === 'photos') startPhotoLoop(thread, seq);
      onSectionComplete(key, seq);
      return;
    }
    const msg = queue.shift();
    if (msg.u !== undefined){
      addUserMsg(thread, msg.u);
      setTimeout(() => next(true), reduced ? 0 : 300);
    } else {
      const scroll = !isFirstAnswer;                     // keep the opening answer anchored at top
      const gap = msg.photo ? 380 : (reduced ? 0 : 150); // photos: 220+400+380 ≈ 1s cadence
      addAssistantMsg(thread, msg.a, seq, {
        think: msg.photo ? 400 : 550,
        scroll,
        timeline: msg.timeline,
        done: () => setTimeout(() => next(false), gap)
      });
    }
  };
  next(false);
}

/* work card → follow-up exchange in the same thread */
function askDetail(key){
  const d = workDetails[key];
  if (!d) return;
  const thread = chat.querySelector('.thread');
  if (!thread) return;
  const existing = thread.querySelector(`[data-detail-answer="${key}"]`);
  if (existing){ existing.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' }); return; }
  const seq = renderSeq;
  addUserMsg(thread, d.ask);
  scrollChatToEnd();
  addAssistantMsg(thread, d.html, seq, { think: 700, scroll: true, done: () => {
    const rows = thread.querySelectorAll('.assistant-row');
    rows[rows.length - 1].setAttribute('data-detail-answer', key);
  }});
}

document.addEventListener('click', e => {
  const card = e.target.closest('[data-detail]');
  if (card){ askDetail(card.dataset.detail); return; }
  const b = e.target.closest('[data-section]');
  if (b && launched) render(b.dataset.section);
});
document.querySelector('#openMenu').onclick = () => document.querySelector('#sidebar').classList.add('open');
document.querySelector('#closeMenu').onclick = () => document.querySelector('#sidebar').classList.remove('open');
window.addEventListener('load', () => setTimeout(typeIntro, reduced ? 50 : 400));

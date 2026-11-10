/* The cursor. One disc follows the pointer a little behind it, so it carries
   weight the way the page does, and grows over big type and over links. It is
   the difference of whatever is under it (cursor.css), so the words it passes
   over turn to the other half of the day. Mice only: touch, pens and keyboards
   never see it, and the system cursor stays until the mouse first moves. */
(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  // Someone who has asked the system for a cursor they can find keeps it.
  if (matchMedia('(forced-colors: active), (prefers-contrast: more)').matches) return;

  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const REST = 14;      // px across, over nothing in particular
  const LINK = 44;      // over a link or a button
  const OPEN = 68;      // over a card's shot, carrying the arrow
  const POINT = 6;      // over a pill, which turns over by itself
  const DISPLAY = 30;   // type at least this many px tall counts as big type
  const TYPE = 0.8;     // over big type: this share of its size,
  const TYPE_MIN = 56;  // within these bounds
  const TYPE_MAX = 132;
  const FOLLOW = 12;    // catching-up rate per second; lower is heavier
  const SWELL = 10;     // resizing rate per second
  const PRESS = 0.8;    // its size while the button is down

  const FIELDS = 'input, textarea, select, iframe, [contenteditable=""], [contenteditable="true"]';
  const OPENS = 'a.build .build-media';
  // These fill in on hover; a disc over them would turn them back.
  const FILLED = '.pill, .feature .project-links a, .demo-go, .segmented button, .stream-controls button, .message-tab';
  const LINKS = 'a, button, summary, [role="button"]';
  const PHOTOS = '.shot';

  const disc = document.createElement('div');
  disc.className = 'cursor';
  disc.setAttribute('aria-hidden', 'true');
  document.body.append(disc);

  /* ---------- what is under the pointer ---------- */

  let fontSizes = new WeakMap();
  function fontSize(el) {
    let px = fontSizes.get(el);
    if (px === undefined) fontSizes.set(el, px = parseFloat(getComputedStyle(el).fontSize) || 0);
    return px;
  }
  addEventListener('resize', () => { fontSizes = new WeakMap(); });

  // A heading's box runs the width of its column; only its words count.
  const range = document.createRange();
  function overWords(el, px, py) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) return true;
      }
    }
    return false;
  }

  // The first that applies wins: [size, look, hidden].
  function read(el) {
    if (!el || !el.closest) return [REST, '', false];
    if (el.closest(FIELDS)) return [REST, '', true];
    if (el.closest(OPENS)) return [OPEN, 'is-open', false];
    if (el.closest(FILLED)) return [POINT, '', false];
    const px = fontSize(el);
    if (px >= DISPLAY && overWords(el, x, y)) return [clamp(px * TYPE, TYPE_MIN, TYPE_MAX), '', false];
    if (el.closest(LINKS)) return [LINK, '', false];
    if (el.closest(PHOTOS)) return [REST, 'is-plain', false];
    return [REST, '', false];
  }

  /* ---------- the disc ---------- */

  let x = 0;          // where the pointer is
  let y = 0;
  let cx = 0;         // where the disc is
  let cy = 0;
  let size = REST;    // how large it is, and how large it is headed
  let want = REST;
  let look = '';
  let pressed = false;
  let shown = false;
  let running = false;
  let lastFrame = 0;
  let lastSize = '';
  let lastEl = null;
  let lastWasType = false;

  function aim(el) {
    // Within big type the answer changes from word to gap; elsewhere only
    // when the element does.
    if (el === lastEl && !lastWasType) return;
    lastEl = el;
    lastWasType = !!el && el.nodeType === 1 && fontSize(el) >= DISPLAY;
    const [nextSize, nextLook, hidden] = read(el);
    want = nextSize;
    if (nextLook !== look) {
      if (look) disc.classList.remove(look);
      if (nextLook) disc.classList.add(nextLook);
      look = nextLook;
    }
    disc.classList.toggle('is-on', !hidden);
  }

  function paint() {
    const d = size.toFixed(1);
    if (d !== lastSize) disc.style.width = disc.style.height = `${lastSize = d}px`;
    disc.style.transform = `translate3d(${(cx - size / 2).toFixed(1)}px, ${(cy - size / 2).toFixed(1)}px, 0)`;
  }

  function frame(now) {
    // The first frame after a rest has nothing to measure from; a frame that
    // starts before the move that woke it must not run time backwards.
    const dt = lastFrame ? clamp((now - lastFrame) / 1000, 0, 0.05) : 1 / 60;
    lastFrame = now;
    const still = reduceMotion.matches;
    const follow = still ? 1 : 1 - Math.exp(-FOLLOW * dt);
    const swell = still ? 1 : 1 - Math.exp(-SWELL * dt);
    const goal = want * (pressed ? PRESS : 1);
    cx += (x - cx) * follow;
    cy += (y - cy) * follow;
    size += (goal - size) * swell;
    if (Math.abs(x - cx) < 0.1 && Math.abs(y - cy) < 0.1 && Math.abs(goal - size) < 0.1) {
      cx = x;
      cy = y;
      size = goal;
      running = false;
    }
    paint();
    if (running) requestAnimationFrame(frame);
  }

  function wake() {
    if (running) return;
    running = true;
    lastFrame = 0;
    requestAnimationFrame(frame);
  }

  // It arrives where the pointer is, not from wherever it was last seen.
  function show() {
    shown = true;
    cx = x;
    cy = y;
    lastEl = null;
    root.classList.add('has-cursor');
  }

  function hide() {
    shown = false;
    pressed = false;
    disc.classList.remove('is-on');
  }

  /* ---------- the pointer ---------- */

  addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    x = event.clientX;
    y = event.clientY;
    if (!shown) show();
    aim(event.target);
    wake();
  }, { passive: true });

  addEventListener('pointerdown', event => {
    // A finger on a screen that also has a mouse: the disc gets out of the way.
    if (event.pointerType !== 'mouse') return hide();
    pressed = true;
    wake();
  }, { passive: true });

  ['pointerup', 'pointercancel', 'dragend'].forEach(type => addEventListener(type, () => {
    pressed = false;
    if (shown) wake();
  }, { passive: true }));

  // The page moving under a still pointer changes what it is over.
  let rereading = false;
  addEventListener('scroll', () => {
    if (!shown || rereading) return;
    rereading = true;
    requestAnimationFrame(() => {
      rereading = false;
      if (!shown) return;
      aim(document.elementFromPoint(x, y));
      wake();
    });
  }, { passive: true });

  document.addEventListener('mouseleave', hide);
  addEventListener('blur', hide);

  /* ---------- from page to page ---------- */

  // A link followed with the mouse: the next page opens with the disc already
  // where the pointer is, instead of the system cursor until it next moves.
  const HANDOVER = 'cursor-at';
  const FRESH = 5000;  // ms a handover stays good for

  addEventListener('pagehide', () => {
    try {
      if (shown) sessionStorage.setItem(HANDOVER, `${x},${y},${Date.now()}`);
      else sessionStorage.removeItem(HANDOVER);
    } catch {}
  });

  function arrive() {
    try {
      const [hx, hy, at] = (sessionStorage.getItem(HANDOVER) || '').split(',').map(Number);
      sessionStorage.removeItem(HANDOVER);
      if (Date.now() - at < FRESH) {
        x = hx;
        y = hy;
        show();
        aim(document.elementFromPoint(x, y));
        wake();
        return;
      }
    } catch {}
    // Nothing handed over: the system cursor, until the mouse moves.
    hide();
    root.classList.remove('has-cursor');
  }

  arrive();
  // A page brought back by the back button is as it was left, disc and all.
  addEventListener('pageshow', event => { if (event.persisted) arrive(); });
})();

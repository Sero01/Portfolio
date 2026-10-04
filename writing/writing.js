/* Essays: the paragraph at the reading line, a little above the middle of the
   screen, is brought forward and the rest fall back. The nearest paragraph wins,
   so the first is lit at the top of the page and the last at the bottom. */
(() => {
  const paras = [...document.querySelectorAll('.essay .prose > p')];
  if (!paras.length) return;

  document.documentElement.classList.add('focus-read');
  let current = null;

  function update() {
    const line = innerHeight * 0.42;
    let best = null;
    let bestDistance = Infinity;
    for (const p of paras) {
      const r = p.getBoundingClientRect();
      const distance = r.top > line ? r.top - line : r.bottom < line ? line - r.bottom : 0;
      if (distance < bestDistance) { best = p; bestDistance = distance; }
    }
    if (best === current) return;
    if (current) current.classList.remove('is-focus');
    best.classList.add('is-focus');
    current = best;
  }

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();
})();

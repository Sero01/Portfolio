/* Story pages. The clock in the bar runs through the evening as the story is
   read, the drawings draw themselves in, chapters and charts arrive once, and
   a project with a demo on Render's free tier gets it woken while you read. */
(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- clock: reading progress mapped onto an hour of the night ---------- */

  const clock = document.querySelector('.bar-clock');
  const [from, to] = (document.body.dataset.hours || '21:00-22:00')
    .split('-')
    .map(t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; });
  const span = (to - from + 1440) % 1440 || 1440;
  let lastTime = '';

  function tick() {
    const room = root.scrollHeight - innerHeight;
    const progress = room > 0 ? Math.min(1, Math.max(0, scrollY / room)) : 0;
    const minutes = (from + Math.round(progress * span)) % 1440;
    const time = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    if (time !== lastTime) clock.textContent = lastTime = time;
  }

  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; tick(); });
  }, { passive: true });
  addEventListener('resize', tick);
  tick();

  /* ---------- drawings: each stroke in turn ---------- */

  document.querySelectorAll('.draw').forEach(svg => {
    svg.querySelectorAll('[pathLength]').forEach((el, i) => el.style.setProperty('--i', i));
  });

  /* ---------- arrivals: shown once, a beat after they come into view ---------- */

  const arrivals = [...document.querySelectorAll('.chapter, .chart, .draw')];
  const show = el => el.classList.add(el.matches('.draw') ? 'is-drawn' : 'is-shown');

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    arrivals.forEach(show);
  } else {
    // Whatever is already on screen shows at once; the rest waits below.
    arrivals.forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight * 0.9) show(el);
    });
    requestAnimationFrame(() => root.classList.add('can-reveal'));

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    arrivals.forEach(el => {
      if (!el.classList.contains('is-shown') && !el.classList.contains('is-drawn')) io.observe(el);
    });
  }

  /* ---------- demo: wake it while the story is read ----------

     The demo runs on Render's free tier, which spins the instance down after 15
     idle minutes and takes about a minute to boot. Firing a request the moment
     this page opens means it is usually up by the time anyone reaches the
     button. The response is opaque and never read; only the request arriving at
     Render matters, and it still resolves once the server has answered. */

  const demo = document.querySelector('.demo[data-wake]');
  const status = demo && demo.querySelector('.demo-status span');
  if (demo && status && window.fetch) {
    const wake = () => fetch(demo.dataset.wake, { mode: 'no-cors', cache: 'no-store' });
    wake().then(() => {
      status.textContent = 'Awake, it will open straight away';
      demo.dataset.state = 'ready';
    }).catch(() => {
      status.textContent = 'It may take a minute to wake';
    });
    // A slow read can outlast the 15-minute idle timer, so keep it up.
    setInterval(wake, 10 * 60 * 1000);
  }
})();

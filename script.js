/* The page is one day, read top to bottom.
   Scroll position fades the hero out, sets the time in the bar and brings the
   night in as a box that grows to fill the screen, where the featured projects
   stack as cards. Work and Experience rows
   draw in as they arrive. The photographs roll on their own, a little faster
   while the page is moving, and project videos play while in view. The
   wheel eases the whole page along, so it carries some weight. */
(() => {
  const root = document.documentElement;
  const $ = selector => document.querySelector(selector);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const bar = $('.bar');
  const hero = $('.hero');
  const nightfall = $('.nightfall');
  const features = [...document.querySelectorAll('.feature')];
  const photos = $('.photos');
  const reelWindow = $('.reels');
  const reels = [...document.querySelectorAll('.reel')];
  const clock = $('.bar-clock');
  const themeColor = $('meta[name="theme-color"]');

  const clamp01 = v => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);

  let barHeight = 0;

  /* ---------- hero: the words fall behind the page and fade as it moves on ---------- */

  // The portrait keeps pace with the page while the name and line lag behind
  // it, so they sink away from the face rather than climbing over it. Each
  // fades over its own share of the hero, the name last, as the bar takes it.
  const HANDOFF = 0.7;  // share of the hero scrolled when the name moves to the bar
  const heroLayers = [
    { el: $('.hero-line'), lag: 0.3, fade: [0, 0.4] },
    { el: $('.hero-portrait'), lag: 0, fade: [0.1, 0.6] },
    { el: $('.hero-name'), lag: 0.2, fade: [0.1, HANDOFF] },
  ];

  function paintHero(y, heroHeight) {
    const still = reduceMotion.matches;
    heroLayers.forEach(layer => {
      const [from, to] = layer.fade;
      // Past its own fade a layer stops lagging, so it never reaches the Work title.
      const travel = Math.min(Math.max(0, y), to * heroHeight);
      const opacity = (1 - smooth(clamp01((travel / heroHeight - from) / (to - from)))).toFixed(3);
      const shift = still || !layer.lag ? '' : `0 ${(travel * layer.lag).toFixed(1)}px`;
      if (opacity !== layer.opacity) layer.el.style.opacity = layer.opacity = opacity;
      if (shift !== layer.shift) layer.el.style.translate = layer.shift = shift;
    });
  }

  /* ---------- nightfall: Projects rises as a faded box and fills the screen ---------- */

  const BOX_SCALE = 0.84;  // the box's width, as a share of the screen, when it first shows
  const BOX_RADIUS = 20;   // on-screen px, held all the way to full screen
  const BOX_FADE = 0.18;   // its opacity at that moment

  bar.style.setProperty('--night-radius', `${BOX_RADIUS}px`);

  let lastBox = '';
  let lastEdge = '';
  let isNight = null;

  function paintNightfall(top, vh) {
    // 0 as the box's top edge enters at the bottom, 1 once it reaches the bar.
    const e = smooth(clamp01((vh - top) / Math.max(1, vh - barHeight)));
    const s = reduceMotion.matches ? 1 : lerp(BOX_SCALE, 1, e);
    const box = `${s.toFixed(4)}|${lerp(BOX_FADE, 1, e).toFixed(3)}`;
    if (box !== lastBox) {
      lastBox = box;
      nightfall.style.transform = `scale(${s.toFixed(4)})`;
      nightfall.style.opacity = lerp(BOX_FADE, 1, e).toFixed(3);
      // Divided by the scale so the corners hold their size as the box grows.
      nightfall.style.borderRadius = `${(BOX_RADIUS / s).toFixed(1)}px`;
    }

    // The bar's night layer starts where the box's edge is, and keeps its
    // corners until they have passed the top of the screen.
    const edge = `${Math.min(barHeight, Math.max(-BOX_RADIUS, top)).toFixed(1)}px`;
    if (edge !== lastEdge) bar.style.setProperty('--night-top', lastEdge = edge);

    const night = top < barHeight / 2;
    if (night !== isNight) {
      isNight = night;
      root.classList.toggle('is-night', night);
      themeColor.content = night ? '#161513' : '#e7e9ee';
    }
  }

  /* ---------- featured projects: each card sinks back as the next covers it ---------- */

  const COVERED_SCALE = 0.8;  // a card's size once the next has covered it
  const COVERED_DROP = 0.1;   // how far it sinks meanwhile, as a share of its height
  const covers = features.map(() => '');
  const drops = features.map(() => 0);

  // Heights are untransformed and the cards scale from their top edge; the
  // drop last applied is taken back off each top, so moving a card never
  // feeds back into the next frame's reading. Sunk and shrunk, a covered
  // card still ends inside the one on top of it.
  function paintFeatures(tops, heights) {
    let changed = false;
    const layoutTops = tops.map((top, i) => top - drops[i]);
    features.forEach((card, i) => {
      const next = layoutTops[i + 1];
      const p = next === undefined ? 0 : clamp01((layoutTops[i] + heights[i] - next) / heights[i]);
      const cover = p.toFixed(3);
      if (cover === covers[i]) return;
      covers[i] = cover;
      card.style.setProperty('--cover', cover);
      const still = reduceMotion.matches || !p;
      drops[i] = still ? 0 : +(heights[i] * COVERED_DROP * p).toFixed(1);
      card.style.transform = still ? '' : `translateY(${drops[i]}px) scale(${lerp(1, COVERED_SCALE, p).toFixed(4)})`;
      const covered = p > 0.99;
      if (covered !== card.classList.contains('is-covered')) {
        card.classList.toggle('is-covered', covered);
        changed = true;
      }
    });
    // A video under another card is out of sight but still intersecting.
    if (changed) playVisible();
  }

  /* ---------- clock: scroll position mapped onto the hours of a day ---------- */

  let hours = [];
  function measureHours() {
    const vh = innerHeight;
    const top = el => el.getBoundingClientRect().top + scrollY;
    const nightTop = top(nightfall);
    const marks = [
      [0, 8 * 60],
      [top($('#work')) - vh / 2, 9 * 60 + 30],
      [top($('#experience')) - vh / 2, 13 * 60],
      [nightTop - vh, 17 * 60 + 30],
      [nightTop - barHeight, 19 * 60 + 30],
      [top(photos) - vh / 2, 21 * 60 + 30],
      [top($('#contact')) - vh / 2, 23 * 60],
      [root.scrollHeight - vh, 23 * 60 + 45],
    ];
    hours = marks.reduce((kept, [y, minutes]) => {
      const prev = kept[kept.length - 1];
      if (!prev || y > prev[0]) kept.push([y, minutes]);
      return kept;
    }, []);
  }

  let lastTime = '';
  function paintClock(y) {
    let i = 1;
    while (i < hours.length - 1 && y > hours[i][0]) i++;
    const [y0, m0] = hours[i - 1];
    const [y1, m1] = hours[i];
    const minutes = Math.round(lerp(m0, m1, clamp01((y - y0) / (y1 - y0))));
    const time = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    if (time !== lastTime) clock.textContent = lastTime = time;
  }

  /* ---------- photographs: three reels, rolling up, down, up ---------- */

  const REEL_PACE = [1, 0.8, 1.15];  // relative speeds, so the reels drift out of step
  let reelLayout = '';
  let stripRequested = false;

  function layoutReels() {
    const roll = !reduceMotion.matches;
    root.classList.toggle('is-rolling', roll);
    const key = `${roll}|${reels[0].offsetWidth}|${reelWindow.clientHeight}`;
    if (key === reelLayout) return;
    reelLayout = key;

    reels.forEach((reel, i) => {
      reel.querySelectorAll('.reel-copy').forEach(copy => copy.remove());
      if (!roll) return;
      const set = reel.firstElementChild;
      const loop = set.offsetHeight;
      // One loop is one set; add copies until the window never runs short mid-loop.
      const copies = Math.max(2, Math.ceil(reelWindow.clientHeight / loop) + 1);
      for (let k = 1; k < copies; k++) {
        const copy = set.cloneNode(true);
        copy.classList.add('reel-copy');
        copy.setAttribute('aria-hidden', 'true');
        copy.querySelectorAll('img').forEach(img => {
          img.alt = '';
          if (stripRequested) img.loading = 'eager';
        });
        reel.append(copy);
      }
      // About a tenth of the reel's width per second, whatever the screen.
      const speed = reel.offsetWidth * 0.1 * REEL_PACE[i];
      reel.style.setProperty('--copies', copies);
      reel.style.setProperty('--roll', `${(loop / speed).toFixed(1)}s`);
    });
  }

  // The window clips the reels, so native lazy loading would only fetch a
  // photo as it rolls into view. Fetch them all while the section approaches.
  function requestStrip() {
    stripRequested = true;
    photos.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
  }

  // Scrolling past the reels spins them up; they ease back to their own pace.
  let boost = 0;
  let settling = false;

  function kickReels(dy) {
    boost = Math.min(4, boost + Math.abs(dy) / 80);
    if (settling) return;
    settling = true;
    requestAnimationFrame(settleReels);
  }

  function settleReels() {
    boost = boost < 0.02 ? 0 : boost * 0.92;
    reels.forEach(reel => reel.getAnimations()[0]?.updatePlaybackRate(1 + boost));
    if (boost) requestAnimationFrame(settleReels);
    else settling = false;
  }

  function paintPhotos(r, vh, dy) {
    if (!stripRequested && r.top < vh * 2.5) requestStrip();
    const onStage = r.bottom > 0 && r.top < vh;
    photos.classList.toggle('is-offstage', !onStage);
    if (onStage && dy && root.classList.contains('is-rolling')) kickReels(dy);
  }

  /* ---------- project videos: play only while on screen ---------- */

  // preload="none" keeps them off the network until they first come into view.
  const videos = [...document.querySelectorAll('video')];
  const onScreen = new Set();

  function playVisible() {
    videos.forEach(video => {
      if (onScreen.has(video) && !video.closest('.is-covered') && !reduceMotion.matches) video.play().catch(() => {});
      else video.pause();
    });
  }

  const watcher = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) onScreen.add(target);
      else onScreen.delete(target);
    });
    playVisible();
  }, { threshold: 0.35 });

  videos.forEach(video => watcher.observe(video));
  reduceMotion.addEventListener('change', playVisible);

  /* ---------- rows: Work and Experience draw in once, as they arrive ---------- */

  const revealer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(({ target }, i) => {
      target.style.setProperty('--stagger', `${i * 0.09}s`);
      target.classList.add('is-shown');
      revealer.unobserve(target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  // Rows already on or above the screen are left as they are.
  document.querySelectorAll('.project, .role').forEach(row => {
    if (row.getBoundingClientRect().top < innerHeight) row.classList.add('is-shown');
    else revealer.observe(row);
  });
  root.classList.add('can-reveal');

  /* ---------- weight: the wheel eases the page along instead of jumping it ---------- */

  // Each notch travels a little less than the browser's own step, and the page
  // glides after it and settles, so it reads as heavy. Touch, keys, the
  // scrollbar and links keep the browser's own scrolling.
  const WHEEL_STEP = 0.7;  // share of the browser's distance per notch
  const GLIDE = 4;         // settling rate per second; lower is heavier

  let glideTarget = 0;
  let glideAt = 0;
  let gliding = false;
  let lastFrame = 0;

  function glide(now) {
    // Something else moved the page (a key, the scrollbar, a link): let it.
    if (Math.abs(scrollY - glideAt) > 2) {
      gliding = false;
      return;
    }
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    glideAt = lerp(glideAt, glideTarget, 1 - Math.exp(-GLIDE * dt));
    if (Math.abs(glideTarget - glideAt) < 0.5) glideAt = glideTarget;
    scrollTo({ top: glideAt, behavior: 'instant' });
    if (glideAt !== glideTarget) requestAnimationFrame(glide);
    else gliding = false;
  }

  function onWheel(event) {
    if (reduceMotion.matches || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (!gliding) glideAt = glideTarget = scrollY;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const end = root.scrollHeight - innerHeight;
    glideTarget = Math.min(end, Math.max(0, glideTarget + event.deltaY * unit * WHEEL_STEP));
    if (gliding) return;
    gliding = true;
    lastFrame = performance.now();
    requestAnimationFrame(glide);
  }

  addEventListener('wheel', onWheel, { passive: false });

  /* ---------- loop ---------- */

  let queued = false;
  let lastY = scrollY;

  function paint() {
    queued = false;
    // Read layout first, then write, so a frame never forces a second layout.
    const y = scrollY;
    const vh = innerHeight;
    const heroHeight = hero.offsetHeight;
    const nightTop = nightfall.getBoundingClientRect().top;
    const photosRect = photos.getBoundingClientRect();
    const featureTops = features.map(card => card.getBoundingClientRect().top);
    const featureHeights = features.map(card => card.offsetHeight);
    const dy = y - lastY;
    lastY = y;

    root.classList.toggle('is-past-hero', y > heroHeight * HANDOFF);
    paintHero(y, heroHeight);
    paintNightfall(nightTop, vh);
    paintFeatures(featureTops, featureHeights);
    paintClock(y);
    paintPhotos(photosRect, vh, dy);
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(paint);
  }

  let lastWidth = 0;
  function refresh() {
    lastWidth = innerWidth;
    barHeight = bar.offsetHeight;
    root.style.setProperty('--bar-h', `${barHeight}px`);
    layoutReels();
    measureHours();
    paint();
  }

  // A phone's URL bar changes only the height; the reels are sized in svh and
  // keep their copies, so only the clock's marks move.
  function onResize() {
    if (innerWidth !== lastWidth || reelWindow.clientHeight !== +reelLayout.split('|')[2]) return refresh();
    measureHours();
    schedule();
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', onResize);
  reduceMotion.addEventListener('change', () => {
    covers.fill('');
    refresh();
  });
  document.fonts?.ready.then(refresh);
  addEventListener('load', refresh);
  refresh();
})();

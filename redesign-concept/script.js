/* The page is one day, read top to bottom.
   Scroll position sets the time in the bar and brings the night in as a box
   that grows to fill the screen. The photographs roll on their own, a little
   faster while the page is moving, and project videos play while in view. */
(() => {
  const root = document.documentElement;
  const $ = selector => document.querySelector(selector);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const bar = $('.bar');
  const hero = $('.hero');
  const nightfall = $('.nightfall');
  const photos = $('.photos');
  const reelWindow = $('.reels');
  const reels = [...document.querySelectorAll('.reel')];
  const clock = $('.bar-clock');
  const themeColor = $('meta[name="theme-color"]');

  const clamp01 = v => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);

  let barHeight = 0;

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
      if (onScreen.has(video) && !reduceMotion.matches) video.play().catch(() => {});
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

  /* ---------- loop ---------- */

  let queued = false;
  let lastY = scrollY;

  function paint() {
    queued = false;
    // Read layout first, then write, so a frame never forces a second layout.
    const y = scrollY;
    const vh = innerHeight;
    const pastHero = y > hero.offsetHeight * 0.7;
    const nightTop = nightfall.getBoundingClientRect().top;
    const photosRect = photos.getBoundingClientRect();
    const dy = y - lastY;
    lastY = y;

    root.classList.toggle('is-past-hero', pastHero);
    paintNightfall(nightTop, vh);
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
  reduceMotion.addEventListener('change', refresh);
  document.fonts?.ready.then(refresh);
  addEventListener('load', refresh);
  refresh();
})();

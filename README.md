# portfolio-site

One-page portfolio (roadmap Weeks 1–8 parallel task). Single static
`index.html`, no build step, Google Fonts only external dependency.

**Live: https://parvez-ahmed.com** — custom domain on Cloudflare Pages,
project **`portfolio`** (build URL `portfolio-4ye.pages.dev`), which is
Git-connected to this repo with **`static`** as its production branch.
Pushing to `static` builds production; `main` and `master` only produce
preview deployments, so keep all three in step:

```sh
git push origin main:main main:static main:master
```

The homepage is the day-to-night page (`index.html`, `styles.css`,
`script.js`), which replaced the chat-style one on 2026-09-23. The chat-style
homepage and its `tests/` live on in the **`v0`** branch.

There is a second, older Pages project called `parvez-ahmed` serving
`parvez-ahmed.pages.dev` from a direct upload. It is not what the custom
domain points at — don't deploy there expecting the live site to change.

## Slots still to fill

None outstanding.

Resolved: `POST-EVAL` (DocVal held-out F1 is in), `RECONMATCH-URL` (live
Render demo linked), `LINKEDIN-URL` (2026-07-18), `WRITEUP-URL` (2026-08-22 —
the eval case study is hosted here, see below).

## The eval case study

`/eval-case-study/` carries the text of
`docval/docs/writeups/eval-case-study.md` verbatim, minus the draft header. It
is set like the story pages (it loads `/story.css` and `/story.js`), with a
small inline `<style>` for what only it has: a title long enough to need its
own size, a dateline in the left column, plain lists and a code block. It
shares DocVal's hour on the clock, 23:00, and ends on the DocVal story. The
DocVal card links to it.

If the writeup changes in `docval`, the page does not follow automatically —
re-copy the changed prose by hand.

## The project pages

`/inbox-firewall/`, `/waypoint/`, `/docval/` and `/reconmatch/` are the story pages the
project cards link to as "Story". They are set in the homepage's night: Mona Sans,
the same tokens, and no light/dark toggle. They share `/story.css` and
`/story.js`, so they need the site served from its root:

- The opening redraws the card's SVG inline, cropped with its own `viewBox`.
  Every stroke carries `pathLength="1"` so it can draw itself in.
- Each chapter's heading stays pinned on the left while its text scrolls past.
  Below 900px everything stacks into one column.
- The bar's clock runs through one hour as the story is read: 21:00 for Inbox
  Firewall, 22:00 for Waypoint, 23:00 for DocVal and 00:00 for ReconMatch, set with `data-hours` on
  `<body>`. Each page ends on the next story's name, in the homepage's card order.

Inbox Firewall also keeps its lab: `inbox-firewall/app.js` with `data.json`,
styled by `inbox-firewall/styles.css`. The chart colours in `app.js` are
hard-coded, so keep them in step with the tokens. The old diagram,
`assets/photos/tiny-router-diagram.png`, is no longer linked from anywhere.
The page itself draws the pipeline as inline SVG.

## Writing

`/writing/` lists the essays, newest first; each one lives in its own folder,
`/writing/<slug>/index.html`. They use the story pages' layout (they load
`/story.css` and `/story.js`), but are set in the homepage's day:
`/writing/writing.css` turns the story tokens over, so `--night` is the haze
page and `--moon` the ink text. The bar's clock runs through the morning from
07:00. On an essay, `/writing/writing.js` brings the paragraph at the reading
line forward and fades the rest; it acts on `.essay .prose > p`, so the
`<article>` needs the `essay` class. The homepage links here from the bar and
from the contact links (the bar's nav is hidden on phones).

To add a piece: copy `writing/a-tuesday-in-the-park/` to a new slug, change the
text, title, date and read time, update its canonical, Open Graph and JSON-LD,
and then add it in three places: an `.entry` at the top of the list in
`writing/index.html` (plus a `blogPost` item in that page's JSON-LD), a line in
`sitemap.xml`, and a social card in `assets/social/<slug>.jpg`.

## The cursor

Every page loads `/cursor.css` and `/cursor.js` (the homepage by relative
path). With a mouse, the pointer is a disc that follows a beat behind and
turns over whatever it crosses: ink on the haze, moonlight at night. Touch,
pens, forced colours and `prefers-contrast: more` keep the native pointer, and
reduced motion drops the lag.

- The disc is white with `mix-blend-mode: difference`, so it has to stay a
  direct child of `<body>`. Inside anything that makes its own stacking
  context it would stop blending with the page.
- It grows over the words of display type, which it finds by computed size
  (30px and up), so new headings need nothing. It only grows over the letters
  themselves, not the empty part of a heading's box.
- The rest goes by the selector lists at the top of `cursor.js`. Keep them in
  step when adding things: `FILLED` for anything that fills in on hover (the
  disc shrinks to a point so it doesn't fight the fill), `OPENS` for card
  thumbnails (the disc carries the arrow, and `styles.css` stands the corner
  bubble down for mouse hover), `PHOTOS` for images it shouldn't invert.
- A new page needs both tags, `cursor.css` after its other stylesheets and
  `cursor.js` last.

- The disc carries across a page change: `cursor.js` leaves its position in
  `sessionStorage` (`cursor-at`) on the way out and picks it up on arrival, so
  it doesn't vanish until the mouse next moves.

The clock's digits each sit in a cell as wide as a 0 (`.bar-clock span`, set
by `script.js` and `story.js`) so the time doesn't shuffle as it runs. That is
instead of `tabular-nums`, because Mona Sans's tabular figures have a slashed
zero.

## The homepage's finish

- **The portrait.** `assets/parvez.jpg` has the tee's printed text retouched
  out, because the "ed" of Ahmed sat on top of it. The untouched photo is in
  git history (before November 2026). `assets/parvez-cutout.png`, in the
  contact section, still has the print; nothing crosses it there.
- **Featured cards draw themselves.** The cards are `<img>` tags in the HTML.
  `script.js` fetches each SVG and swaps it in inline, marking every stroke
  `.stroke` (with `pathLength="1"`) or `.dash` (already dashed, so it fades in
  instead), and `styles.css` draws them when the card is half in view. A card
  already on screen at load is left still. With reduced motion, or if the fetch
  fails, the `<img>` stays. A new card drawing needs nothing beyond being an
  SVG of strokes.
- **Small cards are grey at rest.** Their thumbnails come up in colour on
  hover or focus. On touch there is no hover, so `script.js` adds `is-lit` to
  whichever cards are in the middle of the screen.
- **Dusk.** From 14:30 to 18:00 on the clock the haze warms from `#e7e9ee`
  toward `#ede3d6` (`HAZE` and `DUSK` in `script.js`), set as `--day` on the
  root; the page background, the bar and `theme-color` follow it. To change how
  warm the afternoon gets, change `DUSK`.
- **Grain.** `body::after` in `styles.css` and `story.css` lays a faint noise
  tile (an inline SVG `feTurbulence`) over every page except the 404. It sits
  above the bar and below the cursor, and is off for `prefers-contrast: more`
  and print. Its strength is the `opacity` on that rule.

## Between pages

`styles.css` and `story.css` opt in to cross-document view transitions
(`@view-transition`), so pages cross-fade in browsers that have them (Chrome,
Edge, Safari 18.2+) and change as before elsewhere. Reduced motion turns it
off.

Opening a story from its card, the card's drawing travels to the story's
opening and back again on return. Both sides name it `drawing`
(`view-transition-name`): the story's `.story-art` always, the card's
`.feature-media` only for the navigation that concerns it. The story crops the
drawing tighter than the card shows it, so each side leaves a note for the
other in `sessionStorage` (`vt-drawing`) on `pageswap` — the card its drawing's
size, the story its `viewBox` — and on `pagereveal` the arriving page turns
that into `--vt-zoom`, `--vt-card-x/y` and `--vt-art-x/y`, which the keyframes
at the end of both stylesheets use to keep the two drawings in register. A
story arrived at this way skips drawing itself in (`is-still`).

This relies on a story's opening drawing being the same drawing as its card,
cropped only by `viewBox`. If the two ever differ, the morph will show it.

## Search and sharing

- Every indexable page carries a canonical URL on `parvez-ahmed.com`, Open
  Graph and Twitter tags, and JSON-LD: `Person`, `ProfilePage` and `WebSite` on
  the homepage, and an `Article` on each story page that points back to that
  `Person` by `@id`. `404.html` is `noindex`.
- `sitemap.xml` lists the indexable pages and `robots.txt` points to it. Add any
  new page to the sitemap.
- `_headers` sends `X-Robots-Tag: noindex` on `*.pages.dev`, so only the
  custom domain gets indexed.
- The favicon is `/favicon.svg`, with `/apple-touch-icon.png` (180px) for iOS.
  It's a real file, not a data URI, because Google only shows favicons it can
  crawl.
- The social cards in `assets/social/` are 1200×630 screenshots of each
  page's opening screen, with the bar's nav, clock and link pills hidden. If an
  opening changes, retake its card: headless Chrome at 1200×630, wait for the
  drawing to finish, JPEG. The story and writing cards predate the grain, which
  is too faint to be worth retaking them for.

The story pages are deliberately *not* duplicates of the eval case study: `/docval/` is the
project story (what the pipeline does, what it scores, the fix that moved it),
while `/eval-case-study/` is the measurement methodology. The DocVal page links
across to it rather than repeating it.

**Every figure is sourced from the repos, not retyped from memory:**

| Page | Numbers from |
|---|---|
| `/docval/` | `docval/README.md` — held-out table (F1 0.63 = 0.92 synthetic / 0.42 real, header 0.87, validation pass 0.25, error 1%, $0.008/doc, 70.9 s/doc), the 0.12 → 0.42 per-page fix, and the ~12% inconsistent running balances in the AgamiAI corpus |
| `/reconmatch/` | `reconmatch/README.md` for the internal held-out figures (95.9% @ precision 1.00, pair F1 0.98, break F1 0.83) and `reconmatch/data/benchrec/artifacts/frozen_eval.md` for the BenchRec table (88.65 / 89.70 / 70.43 against 62.45 / 65.88 / 0.00, precision 93.33%, Wilson LB 93.09%) |

The BenchRec caveat is carried in the copy and must stay there: that work lives
in `experiments/benchrec/`, so **the live demo does not score 88.65%**, and the
disposition is `SUGGESTED_FOR_REVIEW` — no auto-match is claimed on that data.

### Charts

Bars are plain HTML/CSS, no chart library. The result is amber (`#b98c4a`, the
amber in the card drawings) and the comparison is grey (`#6f6c66`). Against the
night, that pair passes the lightness, CVD-separation and contrast checks. The
grey fails the chroma floor, which is intended: it is a neutral reference, and
every bar is labelled with its value. A chart with one series uses moon white.
Bars grow in once their chart scrolls into view. Each `.track`
carries a 62px right margin that holds the value label; because it shrinks the
track box itself, fill widths and reference lines stay on one percentage base.
Don't remove it — the widest bars overflow the card without it.

### Waking the demo

The DocVal and ReconMatch pages fire a `fetch(DEMO_URL, {mode:'no-cors'})` on load. Render's free tier
spins the instance down after 15 idle minutes and takes about a minute to boot,
so the request goes out while the article is being read and the demo is usually
awake by the time anyone reaches the button. The response is opaque and is never
read — only the request arriving at Render matters — but it still resolves once
the server has answered, which is what lights the status dot. The `.demo[data-wake]` element holds the
URL, and `story.js` does the rest.
A `setInterval` re-pings every 10 minutes so a slow read cannot outlast the idle
timer.

This is a mitigation, not a fix: it does nothing for anyone who lands on the
demo link from somewhere other than these two pages.

## Where the ReconMatch numbers come from

Card and stat grid — 95.9% auto-match @ precision 1.00, pair F1 0.98 — are
the internal held-out eval, sourced from `reconmatch/README.md`.

The BenchRec paragraph — 88.65% vs the published 62.45% baseline — is the
single frozen held-out run in
`reconmatch/data/benchrec/artifacts/frozen_eval.md`. That work is
**review-grade** and lives in `experiments/benchrec/`; `src/reconmatch/` does
not implement it, so the live demo does **not** score 88.65%. Keep the
"not yet folded into the live demo" caveat in the copy until a production
fold lands.

## Where the Council numbers come from

The Council card covers two things: the agent workspace at
`~/Projects/council` and the tiny-router study its agents built in
`council/tiny-router-poc/`. Every figure in the copy — 1028-example corpus,
88.1% baseline action accuracy at 74.8% coverage, 11 unsafe executions,
ECE 0.245→0.000 with the unsafe count unmoved, 11→7 after the content-trust
layer — is from `tiny-router-poc/CASE_STUDY.md` (§4a–4c), reproducible via
`python3 eval_harness.py --router rules --curve` and `python3 ablations.py`.

This is now **two** Selected-work cards: **Inbox Firewall** (`tinyrouter` in
`workDetails`) is the study; **Council** (`council`) is the collaboration tool
that built it. The old standalone `evals` card is gone — its content is folded
into the DocVal detail, since the eval harness is DocVal's and ReconMatch's
shared spine.

The study is **hosted on the site** at `/inbox-firewall/` — four static files
(`index.html`, `styles.css`, `app.js`, `data.json`) in `inbox-firewall/`,
served as-is by the Pages deploy (`data.json` loads via a same-origin
`fetch`). The Inbox Firewall card's "Case study & live lab" points here.

**These files have diverged from `council/tiny-router-poc/demo/` — do not
re-copy all four.** Only `data.json` is still verbatim from the POC; to
refresh the numbers, re-run `python3 demo/export_data.py` there and copy
**that file alone**. The other three are now site-owned: `index.html` carries
the written case study (the four paragraphs lifted from the `tinyrouter` card
in `script.js`), the byline, the repo/portfolio links and the Open Graph tags;
`styles.css` carries the site's rounded geometry and sentence-case labels; and
`app.js` differs only in its display strings. Re-copying them from the POC
would silently drop all of that.

The page is the shared link — a recruiter or a Show HN comment lands here, not
on the homepage — so it has to carry the argument and a way back out on its
own. That is why the prose lives on the page and not only in `script.js`.

One caveat to keep in the copy: the **26M fine-tune was never trained** (the
exporter is built and verified, the run is deferred for lack of a training
runtime). Repos linked from the cards: `github.com/Sero01/tiny-router-poc`
(study) and `github.com/Sero01/council` (workspace, POC nested inside).

## Domain

Apex `parvez-ahmed.com` is attached and serving. **`www.parvez-ahmed.com` has
no DNS record** — it does not resolve. Add a CNAME for `www` in the
Cloudflare dashboard if you want the www form to work or redirect.

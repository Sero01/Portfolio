# portfolio-site

One-page portfolio (roadmap Weeks 1–8 parallel task). Single static
`index.html`, no build step, Google Fonts only external dependency.

**Live: https://parvez-ahmed.com** — custom domain on Cloudflare Pages,
project **`portfolio`** (build URL `portfolio-4ye.pages.dev`), which is
Git-connected to this repo with **`static`** as its production branch.
Pushing to `static` builds production; `main` and `master` only produce
preview deployments, so keep all three in step:

```sh
git push origin master:master master:static master:main
```

There is a second, older Pages project called `parvez-ahmed` serving
`parvez-ahmed.pages.dev` from a direct upload. It is not what the custom
domain points at — don't deploy there expecting the live site to change.

## Slots still to fill

None outstanding.

Resolved: `POST-EVAL` (DocVal held-out F1 is in), `RECONMATCH-URL` (live
Render demo linked), `LINKEDIN-URL` (2026-07-18), `WRITEUP-URL` (2026-08-22 —
the eval case study is hosted here, see below).

## The eval case study

`/eval-case-study/` is a self-contained page — one `index.html` with inline
CSS, no build step — carrying the text of
`docval/docs/writeups/eval-case-study.md` verbatim, minus the draft header.
It reuses the site's tokens and the same `portfolio-theme` localStorage key,
so the light/dark choice follows the reader across from the main page. The
DocVal card links to it.

If the writeup changes in `docval`, the page does not follow automatically —
re-copy the changed prose by hand.

## The project pages

`/docval/` and `/reconmatch/` are self-contained story pages built on the same
pattern as `/eval-case-study/` — one `index.html` with inline CSS, no build
step, reusing the site's tokens and the `portfolio-theme` localStorage key. Both
project cards link to them as "How it works".

They are deliberately *not* duplicates of the eval case study: `/docval/` is the
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

Bars are plain HTML/CSS, no chart library. The two series use a categorical pair
validated against the card surface in both modes — `#d97757`/`#00819e` on light,
re-stepped to `#d3714f`/`#2ba3c0` on dark rather than flipped. Each `.track`
carries a 62px right margin that holds the value label; because it shrinks the
track box itself, fill widths and reference lines stay on one percentage base.
Don't remove it — the widest bars overflow the card without it.

### Waking the demo

Both pages fire a `fetch(DEMO_URL, {mode:'no-cors'})` on load. Render's free tier
spins the instance down after 15 idle minutes and takes about a minute to boot,
so the request goes out while the article is being read and the demo is usually
awake by the time anyone reaches the button. The response is opaque and is never
read — only the request arriving at Render matters — but it still resolves once
the server has answered, which is what flips the status line to "Demo is awake".
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

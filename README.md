# portfolio-site

One-page portfolio (roadmap Weeks 1–8 parallel task). Single static
`index.html`, no build step, Google Fonts only external dependency.

**Live: https://parvez-ahmed.com** — custom domain on Cloudflare Pages,
project `parvez-ahmed`. The `parvez-ahmed.pages.dev` address still serves the
same deployment and is what `wrangler` prints, so treat it as the build URL
and the custom domain as the public one.

## Slots still to fill

- `WRITEUP-URL`: point at the published eval case study once it's on
  LinkedIn/blog. Not present in source yet — add the link when it exists.

Resolved: `POST-EVAL` (DocVal held-out F1 is in), `RECONMATCH-URL` (live
Render demo linked), `LINKEDIN-URL` (2026-07-18).

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

The demo is **hosted on the site** at `/inbox-firewall/` — the four static
files (`index.html`, `styles.css`, `app.js`, `data.json`) live in
`inbox-firewall/`, copied verbatim from `council/tiny-router-poc/demo/` and
served as-is by the Pages deploy (`data.json` loads via a same-origin
`fetch`). To refresh it, re-run `python3 demo/export_data.py` in the POC and
re-copy the four files. The Inbox Firewall card's "Live demo" points here.

One caveat to keep in the copy: the **26M fine-tune was never trained** (the
exporter is built and verified, the run is deferred for lack of a training
runtime). Repos linked from the cards: `github.com/Sero01/tiny-router-poc`
(study) and `github.com/Sero01/council` (workspace, POC nested inside).

## Domain

Apex `parvez-ahmed.com` is attached and serving. **`www.parvez-ahmed.com` has
no DNS record** — it does not resolve. Add a CNAME for `www` in the
Cloudflare dashboard if you want the www form to work or redirect.

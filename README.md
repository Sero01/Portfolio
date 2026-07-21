# portfolio-site

One-page portfolio (roadmap Weeks 1–8 parallel task). Single static
`index.html`, no build step, Google Fonts only external dependency.

**Live: https://parvez-ahmed.pages.dev** (Cloudflare Pages, project
`parvez-ahmed`, deployed 2026-07-18 via wrangler).

## Redeploy after edits

```bash
cd ~/Projects/portfolio-site
npx wrangler pages deploy . --project-name parvez-ahmed --branch main --commit-dirty=true
```

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

Optional: add a custom domain later via the Cloudflare dashboard → Pages →
parvez-ahmed → Custom domains.

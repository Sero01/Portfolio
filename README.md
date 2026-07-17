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

## Slots still to fill (marked as HTML comments in index.html)

- `POST-EVAL` (×2): held-out F1 numbers — Claude updates these when the
  post-paged-extraction eval lands, then redeploys.
- `RECONMATCH-URL`: swap "deploying now" link for the live demo URL once the
  Render service exists (GitHub link already in).
- `WRITEUP-URL`: point at the published eval case study once it's on
  LinkedIn/blog.

(`LINKEDIN-URL` resolved 2026-07-18 — real profile URL is in.)

Optional: add a custom domain later via the Cloudflare dashboard → Pages →
parvez-ahmed → Custom domains.

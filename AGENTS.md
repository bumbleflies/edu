# AGENTS.md

## Status

Astro static marketing site (DE at `/`, EN at `/en/`) plus deployment
plumbing (Docker/nginx, CI/CD). Course booking is wired to pretix
(`https://pretix.eu/bumbleedu/`) — event data lives in
`src/data/courses.json`, the site's course CTAs link to the pretix
event pages.

## Commands

```bash
npm run dev        # dev server on :4321
npm run build      # -> dist/
npm run test       # vitest run
npx astro check    # type check
```

CI (Node 26) runs exactly `npm run test` then `npx astro check`. There is no
lint/formatter configured — don't invent or require one.

## Deployment & infrastructure

- `/health` is served by `nginx.conf`, not Astro. The Docker HEALTHCHECK polls
  it; keep that route working when touching serving config.
- No SPA fallback: `try_files $uri $uri/ =404` plus `src/pages/404.astro`
  (noindex, listed in `unlistedPaths`). Never reintroduce `/index.html` as the
  fallback: every unknown URL would answer 200 with the homepage. nginx has
  `absolute_redirect off` (Traefik terminates TLS, so absolute redirects would
  point to `http://`), and serves `*.md` as `text/markdown`.
- Publishing `bumblecode/edu` to Docker Hub only happens on `edu-v*` tag
  pushes (`release.yml`: tests, then `build-publish.yml`'s build + container
  healthcheck gate + push). release-please creates those tags on master but no
  longer publishes itself. Path-filtered `master` pushes and PRs run tests +
  a Docker build/healthcheck but never publish.
- `master.yml` has path filters (`src/**`, `public/**`, package/config files,
  `Dockerfile`, `nginx.conf`). Edits outside them won't trigger a deploy.
- Production routing (`edu.bumbleflies.de`) lives in the separate
  servyy-container repo (`bumbleflies/docker-compose.yml`), not here.

## Conventions

- Node 26 everywhere (Dockerfile, CI).
- Renovate auto-merges devDependency and patch-update PRs (squash).

## Directory guides

Directory-specific rules live next to the code they apply to:

- [src/AGENTS.md](src/AGENTS.md) — application source: layout, co-located
  tests, bilingual pages, copy/content rules.
- [scripts/AGENTS.md](scripts/AGENTS.md) — pretix event sync from
  `src/data/courses.json`.

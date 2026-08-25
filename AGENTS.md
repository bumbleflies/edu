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

### pretix ticketing setup

```bash
PRETIX_API_TOKEN=<token> node scripts/setup-pretix.mjs
```

Idempotent upsert: creates/updates one pretix event per course
(slug/name/dates, locales `en`+`de`, item with price, unlimited quota)
from `src/data/courses.json`. The token is read from the environment —
never commit it. Events are created as drafts: going live requires
enabling a payment provider in the pretix admin, which has no API.

CI (Node 24) runs exactly `npm run test` then `npx astro check`. There is no
lint/formatter configured — don't invent or require one.

## Gotchas

- `src/lib/content.test.ts` asserts `content.de.title` and `content.en.title`
  both contain `edu.bumbleflies.de`. Changing or removing either title fails
  CI; update the test alongside it.
- `/health` is served by `nginx.conf`, not Astro. The Docker HEALTHCHECK polls
  it; keep that route working when touching serving config.
- Pushing to `master` auto-builds and publishes `bumblecode/edu` to Docker Hub
  (after tests + container healthcheck gate).
- `master.yml` has path filters (`src/**`, `public/**`, package/config files,
  `Dockerfile`, `nginx.conf`). Edits outside them won't trigger a deploy.
- Production routing (`edu.bumbleflies.de`) lives in the separate
  servyy-container repo (`bumbleflies/docker-compose.yml`), not here.

## Conventions

- Node 24 everywhere (Dockerfile, CI).
- Renovate auto-merges devDependency and patch-update PRs (squash).

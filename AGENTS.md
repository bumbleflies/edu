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

Idempotent upsert: creates/updates one pretix event per bookable offer
(slug/name/dates, locales `en`+`de`, item with price, quota), plus attendee
questions and shop branding/legal settings, from `src/data/courses.json`. The
token is read from the environment — never commit it. Events are created as
drafts: going live requires enabling a payment provider in the pretix admin,
which has no API.

`courses.json` holds two lists of offers: `courses` (term courses, ending at
`startDate + weeks`, quota unlimited) and `camps` (one-off, with an explicit
`endDate` and a `capacity` that becomes the quota size). Both take the shared
`questions`; an offer's own `questions` entry replaces the shared one with the
same `identifier`, so a camp can narrow the age range or add the BuT question
without repeating the rest. A camp also carries its own `description`, which
replaces the generated course blurb in the pretix event info text.

CI (Node 24) runs exactly `npm run test` then `npx astro check`. There is no
lint/formatter configured — don't invent or require one.

## Gotchas

- `src/lib/content.test.ts` asserts `content.de.title` and `content.en.title`
  both contain `edu.bumbleflies.de`. Changing or removing either title fails
  CI; update the test alongside it.
- `/health` is served by `nginx.conf`, not Astro. The Docker HEALTHCHECK polls
  it; keep that route working when touching serving config.
- Publishing `bumblecode/edu` to Docker Hub only happens on `edu-v*` tag
  pushes (`release.yml`: tests, then `build-publish.yml`'s build + container
  healthcheck gate + push). release-please creates those tags on master but no
  longer publishes itself. Path-filtered `master` pushes and PRs run tests +
  a Docker build/healthcheck but never publish.
- `master.yml` has path filters (`src/**`, `public/**`, package/config files,
  `Dockerfile`, `nginx.conf`). Edits outside them won't trigger a deploy.
- The camp is bookable but not rendered by the site, so `src/lib/camps.test.ts`
  is the only thing pinning its dates, price, age range and duration. Keep it
  green when editing `courses.json`.
- Never describe BuT as making an activity free, in site copy or in
  `courses.json`. `€15/month, up to €180 per twelve-month period` is a shared
  budget across all leisure, and a family must apply *before* the activity
  starts. The rule is tested; see `src/lib/camps.test.ts`.
- Production routing (`edu.bumbleflies.de`) lives in the separate
  servyy-container repo (`bumbleflies/docker-compose.yml`), not here.

## Conventions

- Node 24 everywhere (Dockerfile, CI).
- Renovate auto-merges devDependency and patch-update PRs (squash).

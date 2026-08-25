# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Status

bumble:education — the education site for kids' coding and robotics courses
(ages 8–14, mbot platform). Astro static marketing site with DE at `/` and
EN at `/en/`, plus deployment plumbing (Docker/nginx, CI/CD).

Pages: homepage with the two courses (Robot Explorer, Code the Machine),
print flyer pages, and legal pages (Impressum/Imprint, Datenschutz/Privacy)
in both languages. Course booking is wired to pretix
(`https://pretix.eu/bumbleedu/`) — event data lives in
`src/data/courses.json` and is synced via `scripts/setup-pretix.mjs`.

## Stack

Astro 7.x (static output), TypeScript strict, Vitest, Node 24.

## Commands

```bash
npm run dev      # dev server on :4321
npm run build    # -> dist/
npm run test     # vitest run
npx astro check  # type check
```

## Deployment

- `Dockerfile`: multi-stage build, node:24-alpine -> nginx:alpine, healthcheck on `/health`.
- CI/CD is a set of reusable GitHub Actions workflows:
  - PRs to `master` run tests + type check (`pr.yml` → `pr-tests.yml`) plus a
    Docker build and healthcheck (`docker-build-test.yml`).
  - Non-master pushes run tests only (`push.yml`).
  - Path-filtered `master` pushes run tests + Docker build/healthcheck
    (`master.yml`) but do NOT publish.
  - Release-please (`release-please.yml`) cuts releases from conventional
    commits; only when a release is created does `build-publish.yml` build,
    healthcheck, and push `bumblecode/edu` to Docker Hub.
- Production routing lives in the separate `servyy-container` repo
  (`bumbleflies/docker-compose.yml`), not here.

## pretix ticketing

```bash
PRETIX_API_TOKEN=<token> node scripts/setup-pretix.mjs
```

Idempotent upsert: creates/updates one pretix event per course
(slug/name/dates, locales `en`+`de`, item with price, unlimited quota), plus
attendee questions and shop branding/legal settings, from
`src/data/courses.json`. The token is read from the environment — never commit
it. Events are created as drafts: going live requires enabling a payment
provider in the pretix admin, which has no API.
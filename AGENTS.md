# AGENTS.md

## Status

Infrastructure-only scaffold: Astro 6 minimal static template plus deployment
plumbing (Docker/nginx, CI/CD). No course/product content yet — future work.

## Commands

```bash
npm run dev        # dev server on :4321
npm run build      # -> dist/
npm run test       # vitest run
npx astro check    # type check
```

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

# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Status

Infrastructure-only scaffold. The site is Astro's minimal static template plus
the deployment plumbing (Docker, nginx, CI/CD, servyy-container routing). No
course/product content exists yet — that is future work.

## Stack

Astro 6.x (static output), TypeScript strict, Vitest.

## Commands

```bash
npm run dev      # dev server
npm run build    # -> dist/
npm run test     # vitest run
npx astro check  # type check
```

## Deployment

- `Dockerfile`: multi-stage build, node:24-alpine -> nginx:alpine, healthcheck on `/health`.
- `.github/workflows/`: mirrors the bumbleflies/bricksnbytes pattern — PR/push
  tests, then on `master` a build-publish workflow pushes `bumblecode/edu` to
  Docker Hub.
- Production routing lives in the separate `servyy-container` repo
  (`bumbleflies/docker-compose.yml`), not here.

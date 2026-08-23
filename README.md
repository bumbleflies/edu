# edu.bumbleflies.de

Education platform for kids — coding courses, starting with mBot, Minecraft later.

This repository is currently infrastructure-only scaffolding (Astro static site,
Docker/nginx, CI/CD, servyy-container deployment). No course content has been
built yet.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
npm run test
```

## Deployment

Multi-stage Docker build (Node 24 → nginx:alpine), pushed to Docker Hub as
`bumblecode/edu` by GitHub Actions on every push to `master`. Served in
production as a subdomain of the bumbleflies servyy-container stack at
`edu.bumbleflies.de`.

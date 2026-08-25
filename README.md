# edu.bumbleflies.de

Education platform for kids — coding courses, starting with mBot, Minecraft later.

Course booking runs through pretix at https://pretix.eu/bumbleedu/. The two
course events (Robot Explorer, Code the Machine) are created/updated from
`src/data/courses.json` via `scripts/setup-pretix.mjs` (needs the
`PRETIX_API_TOKEN` env var; see AGENTS.md).

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

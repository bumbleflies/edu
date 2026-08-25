# edu.bumbleflies.de

**bumble:education** — hands-on programming and robotics courses for kids 8–14
using the mbot platform. Astro static marketing site, served in DE at `/` and
EN at `/en/`.

Includes the homepage with the two courses (Robot Explorer, Code the Machine),
print flyer pages, and legal pages (Impressum/Imprint, Datenschutz/Privacy) in
both languages. Course booking runs through pretix at
https://pretix.eu/bumbleedu/.

Course data lives in `src/data/courses.json`; `scripts/setup-pretix.mjs`
creates/updates the pretix events from it (see CLAUDE.md).

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
`bumblecode/edu`. Releases are cut with release-please from conventional
commits; on each release the image is built, healthchecked, and published by
GitHub Actions. Served in production as a subdomain of the bumbleflies
servyy-container stack at `edu.bumbleflies.de`.
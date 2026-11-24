# AGENTS.md — src/

Astro application source. German pages are routes at the top of `pages/`;
English pages mirror them under `pages/en/`. Facts (dates, prices, capacity)
live in `data/courses.json`; `lib/` holds the logic that turns them into page
copy and pretix data.

## Layout

- `components/` — Astro components; several have a co-located
  `*.render.test.ts` that renders them through the Astro Container API
  (enabled by `vitest.config.ts`'s `getViteConfig`).
- `data/courses.json` — single source of truth for course/camp facts, consumed
  by both the site and `scripts/setup-pretix.mjs`.
- `lib/` — content, i18n, indexing, JSON-LD, pretix and camp logic, each with a
  co-located `*.test.ts`.
- `pages/` — routes. Test files here are prefixed `_` (`_index.test.ts`,
  `_flyer.test.ts`, …) so Astro does not treat them as routes.
- `styles/` — CSS plus tests; `test-utils/` — shared test helpers.

## Rules

- Page/copy titles in `lib/content.ts` must contain `edu.bumbleflies.de` in
  both locales; `lib/content.test.ts` asserts this and a change that drops
  either title fails CI. Update the test alongside the copy.
- The site is static: do not add an A2A `/.well-known/agent-card.json` — it
  would advertise an endpoint nobody answers. `agent-discovery.test.ts`
  guards this.
- Never describe BuT (Bildung und Teilhabe) as making an activity free — in
  site copy or in `data/courses.json`. `€15/month, up to €180 per
  twelve-month period` is a shared budget across all leisure, and a family
  must apply *before* the activity starts. `lib/camps.test.ts` pins the rule.
- The camp is a one-day prototype ("Robotik-Tag"), announced at `/robotik-tag`
  and `/en/robotics-day` (`components/RoboticsDay.astro`, copy in
  `lib/camp.ts`, teaser on both homepages). Until a venue is signed it lists
  `dateOptions` and has no `startDate`: the page shows the three candidate
  days plus a "room wanted" section and the CTA is a reservation mailto.
  Once signed: set `startDate` = `endDate` (one
  of the options), then `bookingOpen: true` after the pretix event is live.
  `lib/camps.test.ts` pins the facts.

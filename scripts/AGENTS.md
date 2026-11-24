# AGENTS.md — scripts/

Maintenance tooling for `bumble:futurespace`.

## setup-pretix.mjs

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

A camp with only `dateOptions` and no `startDate` is announced on the site but
skipped by the sync — pretix needs a real date.

# edu.bumbleflies.de: EN/DE i18n, legal footer, print flyer

**Date:** 2026-08-24
**Status:** proposed

## Context

edu.bumbleflies.de currently ships as a single English-only page
(`src/pages/index.astro`) with no Impressum/Datenschutz and no way to
print a takeaway for parents. The parent site (`bumbleflies/web/beta`)
already solves all three problems and sets the convention this site
should follow:

- German at the root URL, English duplicated under `/en/` (plain
  duplicated `.astro` files per page — **not** Astro's built-in i18n
  routing, and not a content-collection framework; see
  `web/beta/src/pages/{index,en/index}.astro`).
- A shared `Footer.astro` with brand/contact/legal columns and a
  `lang` prop, backed by a small per-language content module
  (`lib/footerContent.ts`).
- A pill-style `LangToggle.astro` switching between the DE and EN
  version of the current page.
- Real Impressum/Datenschutz pages (`content/pages/impressum.md`,
  `datenschutz.md`) with the actual `bumbleflies UG` company details.

edu.bumbleflies.de is the same legal entity (`bumbleflies UG`), so the
legal content can be reused near-verbatim.

## Decisions already made (not open questions)

- Root `/` = German (default), `/en/` = English — mirrors the parent
  exactly.
- German marketing copy will be written fresh (not machine-translated)
  by Claude, matching the tone of the already-approved English copy.
- The print flyer is a print-optimized page in this repo (not a
  separately-designed PDF artifact), with a "Print / Save as PDF"
  button.
- Flyer contact info reuses the same channel as bumbleflies.de:
  `info@bumbleflies.de`.

## Approach

**Plain duplicated pages per language, shared components/data —
matching the parent site's actual convention.** Two alternatives were
considered and rejected:

- *Astro's built-in `i18n` routing config* — more "standard," but the
  parent site doesn't use it either (it hand-rolls `/en/` folders), so
  adopting it here would mean two different i18n conventions across
  the two bumbleflies sites for no benefit.
- *Content collections driving one template per page* (as `web/beta`
  does for blog/case-studies) — real overkill for a handful of static
  marketing pages on a site whose CLAUDE.md explicitly describes it as
  an "infrastructure-only scaffold." Revisit only if edu grows a blog
  or many pages.

## Design

### 1. Routing & files

```
src/pages/
  index.astro          # DE (default) — current content, translated
  impressum.astro       # DE legal notice
  datenschutz.astro     # DE privacy policy
  flyer.astro            # DE print flyer
  en/
    index.astro          # EN — current approved English copy, moved here
    imprint.astro
    privacy.astro
    flyer.astro
```

### 2. Shared components (new, `src/components/`)

- `Header.astro` — brand mark, nav, lang toggle, CTA. Takes `lang`.
- `Footer.astro` — replaces the current bare two-line footer. Columns:
  **Brand** (mark + "Bumble Academy" + one-line blurb), **Courses**
  (in-page anchors: `#courses`, `#how`, `#reviews`), **Contact**
  (`info@bumbleflies.de`), plus a legal row: `© bumbleflies UG ·
  München · {year}` and Impressum/Datenschutz (DE) or Imprint/Privacy
  (EN) links. This is the parent's footer *pattern*, not its content —
  the parent's Services/Learn columns (AI consulting, Open Space,
  blog) don't apply to a kids' course site and are dropped.
- `LangToggle.astro` — same pill markup as the parent's `.bf-lang`,
  linking the current page to its DE/EN counterpart path.
- `src/lib/content.ts` — the `courses`/`steps`/`testimonials` arrays,
  keyed by `lang`, so the DE and EN `index.astro` render from one
  source instead of hand-duplicated literals that can drift.

### 3. Legal pages

Impressum and Datenschutz reuse the parent's actual published text
(`bumbleflies UG`, Gleiwitzer Str. 6-d, München, HRB 260473, same
Geschäftsführer) with only the "this website" references adjusted.
The privacy policy's substance (server logfiles only, no
analytics/cookies configured) already matches edu's actual current
tracking footprint — nothing to change there. Flagging for you: since
this is legal content, worth a quick real read-through after I draft
it, even though it's copied from an already-published source.

### 4. Flyer

One page per language (`flyer.astro` / `en/flyer.astro`): logo +
tagline, both course summaries (name/age/duration/outcomes), the
3-step "how it works," contact info. No testimonials — keeps it
factual and short enough for one printed page. `@media print` hides
nav/footer chrome and fixes an A4-ish layout; a "Print / Save as PDF"
button calls `window.print()`. No new dependencies.

### 5. Testing / CI

- Existing test (`src/index.test.ts`) asserts `index.astro` contains
  `"edu.bumbleflies.de"` — stays true for the German root page, and
  gets a matching assertion added for `en/index.astro`.
- `master.yml`'s path filters already cover `src/**`, so new pages
  deploy automatically — no CI config changes needed.
- `npx astro check` covers the new pages' types.

### Out of scope (deferred, not part of this design)

- Real booking/contact form (already deferred in the earlier design
  round) — course/CTA buttons stay `href="#"`; this spec does not
  change their destinations.
- QR codes or real photography on the flyer.
- Any i18n framework/content-collections — revisit only if page count
  grows significantly.

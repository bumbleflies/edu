---
name: sync-agent-content
description: "Use after any page, content collection, or navigation change to keep llms.txt, llms-full.txt, agents.txt, and robots.txt in sync with the actual site."
---

# Sync Agent Content

Keep machine-readable files accurate whenever pages or content change.

## Trigger

Run this skill after:
- Adding/removing/modifying pages in `src/pages/`
- Changing navigation structure
- Updating page descriptions or content
- Modifying course data in `src/data/courses.json`

## Files to Maintain

| File | Purpose | Location |
|------|---------|----------|
| `llms.txt` | Curated site summary for LLMs | `public/llms.txt` |
| `llms-full.txt` | Full content descriptions for RAG | `public/llms-full.txt` |
| `agents.txt` | Machine-readable page directory | `public/agents.txt` |
| `robots.txt` | Crawler access rules | `public/robots.txt` |

## Process

### 1. Scan Current State

```bash
# Find all static pages (exclude dynamic routes like [slug])
find src/pages -name '*.astro' -not -path '*\[*' | sort

# Find course data
cat src/data/courses.json | jq '.[].title' 2>/dev/null
```

### 2. Build Page Map

Create a map of every page with:
- URL path (from file location)
- Page title (from frontmatter or hardcoded)
- Description (from Layout props or page content)
- Language (DE if in `src/pages/`, EN if in `src/pages/en/`)
- Category (courses, legal, etc.)

### 3. Update `agents.txt`

Simple, flat format. One entry per line: `Label: https://edu.bumbleflies.de/path/`

Structure:
```
# Site
Homepage: https://edu.bumbleflies.de/
Kursübersicht: https://edu.bumbleflies.de/flyer

# Legal
Impressum: https://edu.bumbleflies.de/impressum
Datenschutz: https://edu.bumbleflies.de/datenschutz

# English
EN Home: https://edu.bumbleflies.de/en/
EN Course Overview: https://edu.bumbleflies.de/en/flyer
EN Imprint: https://edu.bumbleflies.de/en/imprint
EN Privacy: https://edu.bumbleflies.de/en/privacy

# Machine-Readable Files
llms.txt: https://edu.bumbleflies.de/llms.txt
llms-full.txt: https://edu.bumbleflies.de/llms-full.txt
robots.txt: https://edu.bumbleflies.de/robots.txt
Sitemap: https://edu.bumbleflies.de/sitemap-index.xml
```

Update the `# Updated:` date on line 3.

### 4. Update `llms.txt`

Markdown format with sections. Each page gets a link + one-line description.

Structure:
```markdown
<!-- agent greeting comment -->

# edu.bumbleflies.de

> Bumbleflies Education — Kurse und Workshops zu Webentwicklung, DevOps und Cloud-Infrastruktur

## Kurse
- [Kursübersicht](https://edu.bumbleflies.de/flyer): Alle verfügbaren Kurse und Workshops

## Pages
- [Homepage](https://edu.bumbleflies.de/): Startseite mit Kursübersicht
- [Impressum](https://edu.bumbleflies.de/impressum): Kontakt und Anbieterdaten
- [Datenschutz](https://edu.bumbleflies.de/datenschutz): Datenschutzerklärung

## English Pages
- [Home (EN)](https://edu.bumbleflies.de/en/): Course overview and workshop catalog
- [Course Overview (EN)](https://edu.bumbleflies.de/en/flyer): All available courses and workshops
- [Imprint (EN)](https://edu.bumbleflies.de/en/imprint): Legal contact information
- [Privacy (EN)](https://edu.bumbleflies.de/en/privacy): Privacy policy

## For Agents
- [agents.txt](https://edu.bumbleflies.de/agents.txt): Machine-readable page directory
- [robots.txt](https://edu.bumbleflies.de/robots.txt): Crawler access rules
- [Sitemap](https://edu.bumbleflies.de/sitemap-index.xml): XML sitemap
```

### 5. Update `llms-full.txt`

Extended version of llms.txt with fuller descriptions for each page. Same structure but each entry gets 2-4 sentences instead of one.

Include:
- Full course descriptions from `src/data/courses.json`
- Workshop details
- Legal page explanations
- "For Agents" section linking machine-readable files

### 6. Update `robots.txt`

For each AI crawler (GPTBot, ClaudeBot, PerplexityBot, etc.), ensure these paths are explicitly `Allow:`ed:
- `/`
- `/llms.txt`
- `/llms-full.txt`
- `/agents.txt`
- `/.well-known/agent-card.json`

Keep standard search engines (Googlebot, Bingbot) with just `Allow: /`.
Keep aggressive scraper blocks (Bytespider, DotBot).

Add a comment block at the bottom listing all machine-readable files.

### 7. Verify

```bash
npm run build
# Check sitemap includes all pages
grep -oP '(?<=<loc>https://edu.bumbleflies.de)[^<]+' dist/sitemap-0.xml | sort
```

## Page Description Guidelines

- One line in `llms.txt`, 2-4 sentences in `llms-full.txt`
- Lead with the value, not the feature
- Include concrete outcomes for courses
- Use plain language, no marketing speak
- Mention the educational focus (Webentwicklung, DevOps, Cloud)

## When Pages Change

| Event | Action |
|-------|--------|
| New page added | Add to all 3 files (DE or EN section) |
| Page removed | Remove from all 3 files |
| Page renamed | Update URL in all 3 files |
| Description changed | Update description in llms.txt + llms-full.txt |
| Course added/modified | Update Kurse section in all 3 files |
| Navigation changed | Verify llms.txt section order matches site nav |

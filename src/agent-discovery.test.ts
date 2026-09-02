import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

function readPublic(file: string): string {
  return readFileSync(resolve(root, 'public', file), 'utf-8');
}

function readSrc(file: string): string {
  return readFileSync(resolve(root, 'src', file), 'utf-8');
}

describe('robots.txt agent resource references', () => {
  const robots = readPublic('robots.txt');

  it('references llms.txt', () => {
    expect(robots).toContain('llms.txt');
    expect(robots).toContain('https://edu.bumbleflies.de/llms.txt');
  });

  it('references facts.json', () => {
    expect(robots).toContain('facts.json');
    expect(robots).toContain('https://edu.bumbleflies.de/facts.json');
  });

  it('references agent-card.json', () => {
    expect(robots).toContain('agent-card.json');
    expect(robots).toContain('https://edu.bumbleflies.de/.well-known/agent-card.json');
  });

  it('still has the sitemap reference', () => {
    expect(robots).toContain('Sitemap: https://edu.bumbleflies.de/sitemap-index.xml');
  });
});

describe('Layout.astro agent resource link tags', () => {
  const layout = readSrc('components/Layout.astro');

  it('has a link to llms.txt', () => {
    expect(layout).toContain('href="/llms.txt"');
    expect(layout).toContain('rel="alternate"');
    expect(layout).toContain('text/plain');
  });

  it('has a link to facts.json', () => {
    expect(layout).toContain('href="/facts.json"');
    expect(layout).toContain('application/json');
  });

  it('has a link to agent-card.json', () => {
    expect(layout).toContain('href="/.well-known/agent-card.json"');
  });
});

describe('homepage JSON-LD script blocks', () => {
  for (const [label, file] of [['DE', 'pages/index.astro'], ['EN', 'pages/en/index.astro']] as const) {
    const page = readSrc(file);

    it(`${label} page imports jsonld functions`, () => {
      expect(page).toContain('organizationJsonLd');
      expect(page).toContain('courseJsonLd');
    });

    it(`${label} page has 3 JSON-LD script blocks`, () => {
      const matches = page.match(/application\/ld\+json/g);
      expect(matches).toHaveLength(3);
    });

    it(`${label} page uses set:html for JSON serialization`, () => {
      expect(page).toContain('is:inline type="application/ld+json" set:html={JSON.stringify(orgJsonLd)}');
      expect(page).toContain('is:inline type="application/ld+json" set:html={JSON.stringify(course0JsonLd)}');
      expect(page).toContain('is:inline type="application/ld+json" set:html={JSON.stringify(course1JsonLd)}');
    });
  }
});

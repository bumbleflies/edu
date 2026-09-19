import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { isListed, unlistedPaths } from './indexing';

const fromRoot = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));
const read = (path: string) => readFileSync(fromRoot(path), 'utf-8');

/** Every routable page (`_`-prefixed files are not routes) with its URL path and source. */
const pages = (readdirSync(fromRoot('src/pages'), { recursive: true }) as string[])
  .filter((file) => file.endsWith('.astro') && !file.split('/').some((segment) => segment.startsWith('_')))
  .map((file) => {
    const route = '/' + file.replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
    return { route: route.length > 1 ? route.replace(/\/$/, '') : route, source: read(`src/pages/${file}`) };
  });

describe('isListed (sitemap filter)', () => {
  it.each([
    'https://edu.bumbleflies.de/',
    'https://edu.bumbleflies.de/en/',
    'https://edu.bumbleflies.de/flyer/',
    'https://edu.bumbleflies.de/en/flyer/',
    'https://edu.bumbleflies.de/impressum/',
    'https://edu.bumbleflies.de/en/privacy/',
  ])('lists %s', (url) => {
    expect(isListed(url)).toBe(true);
  });

  it.each([
    'https://edu.bumbleflies.de/flyer-trifold/',
    'https://edu.bumbleflies.de/flyer-trifold',
    'https://edu.bumbleflies.de/en/flyer-trifold/',
  ])('does not list %s', (url) => {
    expect(isListed(url)).toBe(false);
  });
});

describe('unlisted pages', () => {
  it('discovers the routable pages it checks against', () => {
    const routes = pages.map((p) => p.route);
    expect(routes).toContain('/');
    expect(routes).toContain('/en');
    expect(routes).toContain('/flyer');
    expect(routes).toContain('/en/flyer-trifold');
  });

  it('every page that sets `noindex` is unlisted, and every unlisted path is such a page', () => {
    const noindexRoutes = pages
      .filter((p) => /<Layout\b[^>]*\bnoindex\b/s.test(p.source))
      .map((p) => p.route)
      .sort();
    expect(noindexRoutes).toEqual([...unlistedPaths].sort());
  });

  it('the tri-fold flyer is unlisted and the parent flyer is not', () => {
    expect(unlistedPaths).toEqual(expect.arrayContaining(['/flyer-trifold', '/en/flyer-trifold']));
    expect(unlistedPaths).not.toContain('/flyer');
    expect(unlistedPaths).not.toContain('/en/flyer');
  });

  it('the sitemap integration is wired to the filter', () => {
    const config = read('astro.config.mjs');
    expect(config).toMatch(/import \{ isListed \} from ['"]\.\/src\/lib\/indexing/);
    expect(config).toMatch(/sitemap\(\{\s*filter:\s*isListed\s*\}\)/);
  });

  it.each([
    'public/robots.txt',
    'public/llms.txt',
    'public/llms-full.txt',
    'public/agents.txt',
    'public/agents.md',
    'public/facts.json',
  ])('%s does not mention unlisted pages (robots.txt must not hide the noindex tag either)', (file) => {
    for (const path of unlistedPaths) expect(read(file)).not.toContain(path);
  });
});

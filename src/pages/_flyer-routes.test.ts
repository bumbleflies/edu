import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf-8');

const parentPages = { de: read('./flyer.astro'), en: read('./en/flyer.astro') };
const trifoldPages = { de: read('./flyer-trifold.astro'), en: read('./en/flyer-trifold.astro') };
const parentComponent = read('../components/ParentFlyer.astro');
const trifoldComponent = read('../components/TriFoldFlyer.astro');
const footer = read('../components/Footer.astro');
const parentCss = read('../styles/flyer.css');
const trifoldCss = read('../styles/flyer-trifold.css');

const importsParentCss = (source: string) => /styles\/flyer\.css"/.test(source);
const importsTrifoldCss = (source: string) => /styles\/flyer-trifold\.css"/.test(source);

describe('the parent flyer is the one-page flyer in the tri-fold design language', () => {
  it.each(['de', 'en'] as const)('%s: /flyer renders the one-page ParentFlyer, not the tri-fold', (lang) => {
    expect(parentPages[lang]).toContain(`<ParentFlyer lang="${lang}"`);
    expect(parentPages[lang]).toContain('components/ParentFlyer.astro');
    expect(parentPages[lang]).not.toContain('TriFoldFlyer');
    expect(parentPages[lang]).not.toContain('flyer-trifold');
  });

  it.each(['de', 'en'] as const)('%s: /flyer no longer carries the old page markup', (lang) => {
    expect(parentPages[lang]).not.toContain('flyer-courses');
    expect(parentPages[lang]).not.toContain('flyer-steps');
    expect(parentPages[lang]).not.toContain('flyer-course-img');
  });

  it.each(['de', 'en'] as const)('%s: /flyer loads only the parent-flyer stylesheet', (lang) => {
    expect(importsParentCss(parentPages[lang])).toBe(true);
    expect(importsTrifoldCss(parentPages[lang])).toBe(false);
  });

  it('the component loads the parent-flyer stylesheet, not the tri-fold one', () => {
    expect(importsParentCss(parentComponent)).toBe(true);
    expect(importsTrifoldCss(parentComponent)).toBe(false);
  });

  it('parent stylesheet is one A4 portrait sheet', () => {
    expect(parentCss).toMatch(/size:\s*A4 portrait/);
    expect(parentCss).toContain('210mm');
    expect(parentCss).toContain('297mm');
  });

  it('parent stylesheet has none of the tri-fold-only rules', () => {
    expect(parentCss).not.toContain('flyer-sheet');
    expect(parentCss).not.toContain('flyer-panel');
    expect(parentCss).not.toContain('97mm 100mm 100mm');
    expect(parentCss).not.toContain('100mm 100mm 97mm');
    expect(parentCss).not.toMatch(/A4 landscape/);
  });

  it('the footer keeps linking to the parent flyer, not the tri-fold', () => {
    expect(footer).toContain('"/flyer"');
    expect(footer).toContain('"/en/flyer"');
    expect(footer).not.toContain('flyer-trifold');
  });
});

describe('the tri-fold is a separate option', () => {
  it.each(['de', 'en'] as const)('%s: has its own page that renders the tri-fold component', (lang) => {
    expect(trifoldPages[lang]).toContain(`<TriFoldFlyer lang="${lang}"`);
    expect(trifoldPages[lang]).toContain('window.print()');
    expect(trifoldPages[lang]).not.toContain('ParentFlyer');
  });

  it.each(['de', 'en'] as const)('%s: loads only the tri-fold stylesheet', (lang) => {
    expect(importsTrifoldCss(trifoldPages[lang])).toBe(true);
    expect(importsParentCss(trifoldPages[lang])).toBe(false);
  });

  it('the component loads the tri-fold stylesheet, not the parent one', () => {
    expect(importsTrifoldCss(trifoldComponent)).toBe(true);
    expect(importsParentCss(trifoldComponent)).toBe(false);
    expect(trifoldComponent).not.toContain('ParentFlyer');
  });

  it('tri-fold stylesheet carries the sheet/panel rules and none of the one-page ones', () => {
    expect(trifoldCss).toContain('flyer-sheet');
    expect(trifoldCss).toContain('flyer-panel');
    expect(trifoldCss).toContain('97mm 100mm 100mm');
    expect(trifoldCss).not.toContain('pf-');
  });

  it('the two language versions point at each other and have a title of their own', () => {
    expect(trifoldPages.de).toContain('altHref="/en/flyer-trifold"');
    expect(trifoldPages.en).toContain('altHref="/flyer-trifold"');
    expect(trifoldPages.de).toContain('Faltflyer');
    expect(trifoldPages.en).toContain('tri-fold');
  });
});

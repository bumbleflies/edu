import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ParentDe from './flyer.astro';
import ParentEn from './en/flyer.astro';
import TrifoldDe from './flyer-trifold.astro';
import TrifoldEn from './en/flyer-trifold.astro';
import { content } from '../lib/content';

const render = async (page: Parameters<AstroContainer['renderToString']>[0]) =>
  (await AstroContainer.create()).renderToString(page);

const robotsMeta = /<meta name="robots" content="noindex"/;
const panelCount = (html: string) => (html.match(/<section[^>]*class="[^"]*\bflyer-panel\b/g) ?? []).length;

describe('parent flyer pages (/flyer, /en/flyer)', () => {
  it.each([
    ['de', 'Eltern-Flyer · edu.bumbleflies.de', '/en/flyer', '/flyer', ParentDe],
    ['en', 'Parent flyer · edu.bumbleflies.de', '/flyer', '/en/flyer', ParentEn],
  ] as const)('%s: the one-page flyer, indexable, with its own title', async (lang, title, twin, own, page) => {
    const html = await render(page);
    expect(html).toContain(`<html lang="${lang}"`);
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).not.toMatch(/<meta name="robots"/);
    expect(html).toContain('info@bumbleflies.de');
    expect(html).toContain('href="tel:+4915124154206"');
    // language toggle to the twin page, footer link to the flyer
    expect(html).toContain(`href="${twin}"`);
    expect(html).toMatch(new RegExp(`<a\\b(?=[^>]*footer-flyer)[^>]*href="${own}"`));
  });

  it.each([
    ['de', ParentDe],
    ['en', ParentEn],
  ] as const)('%s: one pf- sheet, no tri-fold or old-flyer markup', async (lang, page) => {
    const html = await render(page);
    expect((html.match(/<div class="pf-sheet">/g) ?? []).length).toBe(1);
    expect((html.match(/<article class="pf-page">/g) ?? []).length).toBe(1);
    expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);
    expect(panelCount(html)).toBe(0);
    expect(html).not.toContain('flyer-sheet');
    expect(html).not.toContain('flyer-trifold');
    expect(html).not.toContain('flyer-courses');
    expect(html).not.toContain('flyer-steps');
    expect(html).toContain(`lang="${lang}"`);
  });

  it.each([
    ['de', ParentDe],
    ['en', ParentEn],
  ] as const)('%s: print button and a one-line hint, both hidden when printing', async (lang, page) => {
    const html = await render(page);
    const actions = html.match(/<div class="pf-actions no-print">([\s\S]*?)<\/div>/)?.[1] ?? '';
    expect(actions).toContain('id="print-btn"');
    expect(actions).toContain(`<p class="pf-print-hint">${content[lang].flyer.onePagePrintHint}</p>`);
    expect(html).not.toContain(content[lang].flyer.printHint);
    expect(html.indexOf('pf-actions no-print')).toBeLessThan(html.indexOf('class="pf-page"'));
  });
});

describe('tri-fold pages (/flyer-trifold, /en/flyer-trifold)', () => {
  it.each([
    ['de', 'Eltern-Flyer (Faltflyer) · edu.bumbleflies.de', '/en/flyer-trifold', TrifoldDe],
    ['en', 'Parent flyer (tri-fold) · edu.bumbleflies.de', '/flyer-trifold', TrifoldEn],
  ] as const)('%s: noindex, six panels, own title, language toggle to its twin', async (lang, title, twin, page) => {
    const html = await render(page);
    expect(html).toContain(`<html lang="${lang}"`);
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toMatch(robotsMeta);
    expect(panelCount(html)).toBe(6);
    expect(html).toContain('id="print-btn"');
    expect(html).toContain('flyer-print-hint');
    expect(html).toContain(`href="${twin}"`);
    expect(html).not.toContain('pf-sheet');
    expect(html).not.toContain('pf-page');
  });

  it.each([
    ['de', TrifoldDe],
    ['en', TrifoldEn],
  ] as const)('%s: the footer still links to the parent flyer, not to the tri-fold', async (lang, page) => {
    const html = await render(page);
    const footerFlyerLink = lang === 'de' ? 'href="/flyer"' : 'href="/en/flyer"';
    expect(html).toContain(footerFlyerLink);
  });
});

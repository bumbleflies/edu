import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ParentDe from './flyer.astro';
import ParentEn from './en/flyer.astro';
import TrifoldDe from './flyer-trifold.astro';
import TrifoldEn from './en/flyer-trifold.astro';

const render = async (page: Parameters<AstroContainer['renderToString']>[0]) =>
  (await AstroContainer.create()).renderToString(page);

const robotsMeta = /<meta name="robots" content="noindex"/;
const panelCount = (html: string) => (html.match(/<section[^>]*class="[^"]*\bflyer-panel\b/g) ?? []).length;

describe('parent flyer pages (/flyer, /en/flyer)', () => {
  it.each([
    ['de', 'Eltern-Flyer · edu.bumbleflies.de', ParentDe],
    ['en', 'Parent flyer · edu.bumbleflies.de', ParentEn],
  ] as const)('%s: the one-page flyer, indexable, with its own title', async (lang, title, page) => {
    const html = await render(page);
    expect(html).toContain(`<html lang="${lang}"`);
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).not.toMatch(robotsMeta);
    expect(html).toContain('flyer-courses');
    expect(html).toContain('info@bumbleflies.de');
    expect(html).toContain('id="print-btn"');
    expect(panelCount(html)).toBe(0);
    expect(html).not.toContain('flyer-sheet');
    expect(html).not.toContain('flyer-trifold');
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

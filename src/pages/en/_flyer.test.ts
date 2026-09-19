import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf-8');

const source = read('./flyer.astro');
const qrSvg = read('../../../public/images/flyer-qr-en.svg');
const otherQrSvg = read('../../../public/images/flyer-qr-de.svg');

describe('EN flyer page', () => {
  it('has a print button that opens the print dialog, hidden when printing', () => {
    expect(source).toContain('id="print-btn"');
    expect(source).toContain('window.print()');
    expect(source).toContain('class="pf-actions no-print"');
  });

  it('renders English content', () => {
    expect(source).toContain('const c = content.en');
    expect(source).toContain('content.en');
  });

  it('keeps the layout wrapper, its title and the language toggle', () => {
    expect(source).toContain('<Layout lang="en" altHref="/flyer"');
    expect(source).toContain('title={`${t.flyerTitle} · edu.bumbleflies.de`}');
  });

  it('stays indexable', () => {
    expect(source).not.toMatch(/\bnoindex\b/);
  });

  it('renders the shared one-page ParentFlyer component in English only', () => {
    expect(source).toContain('<ParentFlyer lang="en"');
    expect(source).not.toContain('lang="de"');
  });

  it('is not the tri-fold and does not use the old page markup', () => {
    expect(source).not.toContain('TriFoldFlyer');
    expect(source).not.toContain('flyer-trifold');
    expect(source).not.toContain('flyer-courses');
    expect(source).not.toContain('flyer-steps');
  });

  it('shows the one-line single-sided print hint beside the print button', () => {
    expect(source).toContain('c.flyer.onePagePrintHint');
    expect(source.indexOf('id="print-btn"')).toBeLessThan(source.indexOf('c.flyer.onePagePrintHint'));
    expect(source.indexOf('c.flyer.onePagePrintHint')).toBeLessThan(source.indexOf('<ParentFlyer'));
    expect(source).not.toContain('c.flyer.printHint');
  });

  it('ships a valid, language-specific QR asset', () => {
    for (const svg of [qrSvg, otherQrSvg]) {
      expect(svg).toMatch(/<svg[^>]*viewBox="0 0 \d+ \d+"/);
      expect(svg).toMatch(/<rect[^>]*fill="#ffffff"/); // white ground, so the code scans on any background
      expect(svg).toMatch(/translate\(4,/); // 4-module quiet zone
      expect((svg.match(/M\d+,\d+h1/g) ?? []).length).toBeGreaterThan(100); // hundreds of modules, not a placeholder
    }
    expect(qrSvg).not.toBe(otherQrSvg);
  });
});

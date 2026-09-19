import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf-8');

const source = read('./flyer-trifold.astro');
const qrSvg = read('../../public/images/flyer-qr-de.svg');
const otherQrSvg = read('../../public/images/flyer-qr-en.svg');

describe('DE flyer page', () => {
  it('has a print button', () => {
    expect(source).toContain('window.print()');
    expect(source).toContain('id="print-btn"');
    expect(source).toContain('class="flyer-actions no-print"');
  });

  it('renders German content', () => {
    expect(source).toContain('const c = content.de');
    expect(source).toContain('content.de');
  });

  it('keeps the layout wrapper and the language toggle', () => {
    expect(source).toContain('<Layout lang="de" altHref="/en/flyer-trifold"');
  });

  it('renders the shared tri-fold component in German only', () => {
    expect(source).toContain('<TriFoldFlyer lang="de"');
    expect(source).not.toContain('lang="en"');
  });

  it('shows the double-sided print and fold hint beside the print button', () => {
    expect(source).toContain('c.flyer.printHint');
    expect(source.indexOf('id="print-btn"')).toBeLessThan(source.indexOf('c.flyer.printHint'));
    expect(source.indexOf('c.flyer.printHint')).toBeLessThan(source.indexOf('<TriFoldFlyer'));
  });

  it('ships a valid, language-specific QR asset', () => {
    expect(qrSvg).toContain('<svg');
    expect(qrSvg).not.toBe(otherQrSvg);
  });
});

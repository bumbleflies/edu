import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf-8');

const source = read('./flyer.astro');
const qrSvg = read('../../../public/images/flyer-qr-en.svg');
const otherQrSvg = read('../../../public/images/flyer-qr-de.svg');

describe('EN flyer page', () => {
  it('has a print button', () => {
    expect(source).toContain('window.print()');
    expect(source).toContain('id="print-btn"');
    expect(source).toContain('class="flyer-actions no-print"');
  });

  it('renders English content', () => {
    expect(source).toContain('const c = content.en');
    expect(source).toContain('content.en');
  });

  it('keeps the layout wrapper and the language toggle', () => {
    expect(source).toContain('<Layout lang="en" altHref="/flyer"');
  });

  it('renders the shared tri-fold component in English only', () => {
    expect(source).toContain('<TriFoldFlyer lang="en"');
    expect(source).not.toContain('lang="de"');
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

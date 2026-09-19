import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf-8');

const css = read('./flyer.css');

/** Returns the body of the first `@media` block whose query matches `query`. */
function mediaBlock(query: RegExp): string {
  const start = css.search(query);
  expect(start, `@media ${query} not found`).toBeGreaterThanOrEqual(0);
  const open = css.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error('unbalanced braces');
}

const sheetMode = () => mediaBlock(/@media\s+screen\s+and\s+\(min-width:\s*1200px\)\s*,\s*print/);
const printMode = () => mediaBlock(/@media\s+print\s*\{/);

describe('flyer print stylesheet: page and sheets', () => {
  it('declares an A4 landscape page without margins', () => {
    expect(css).toMatch(/@page\s*\{[^}]*size:\s*A4 landscape/);
    expect(css).toMatch(/@page\s*\{[^}]*margin:\s*0/);
  });

  it('sizes each sheet 297mm x 210mm', () => {
    const sheet = sheetMode();
    expect(sheet).toMatch(/\.flyer-sheet\s*\{[^}]*width:\s*297mm/);
    expect(sheet).toMatch(/\.flyer-sheet\s*\{[^}]*height:\s*210mm/);
    expect(sheet).toMatch(/\.flyer-sheet\s*\{[^}]*overflow:\s*hidden/);
  });

  it('lays the outside sheet out as flap 97mm | back 100mm | cover 100mm', () => {
    expect(css).toMatch(/\.flyer-sheet-outside\s*\{[^}]*grid-template-columns:\s*97mm 100mm 100mm\s*;/);
  });

  it('lays the inside sheet out as left 100mm | centre 100mm | right 97mm', () => {
    expect(css).toMatch(/\.flyer-sheet-inside\s*\{[^}]*grid-template-columns:\s*100mm 100mm 97mm\s*;/);
  });

  it('keeps both sheets on the true sheet grid only on wide screens and in print', () => {
    expect(css).toMatch(/@media\s+screen\s+and\s+\(min-width:\s*1200px\)\s*,\s*print/);
  });

  it('pads each panel by 8mm, clips overflow and avoids breaks inside', () => {
    const sheet = sheetMode();
    expect(sheet).toMatch(/\.flyer-panel\s*\{[^}]*box-sizing:\s*border-box/);
    expect(sheet).toMatch(/\.flyer-panel\s*\{[^}]*height:\s*210mm/);
    expect(sheet).toMatch(/\.flyer-panel\s*\{[^}]*padding:\s*8mm/);
    expect(sheet).toMatch(/\.flyer-panel\s*\{[^}]*overflow:\s*hidden/);
    expect(sheet).toMatch(/\.flyer-panel\s*\{[^}]*break-inside:\s*avoid/);
    expect(sheet).toMatch(/\.flyer-panel\s*\{[^}]*justify-content:\s*space-between/);
  });
});

describe('flyer print stylesheet: printing', () => {
  it('prints the outside sheet on page 1 and the inside sheet on page 2', () => {
    const print = printMode();
    expect(print).toMatch(/\.flyer-sheet-outside\s*\{[^}]*break-after:\s*page/);
    expect(print).toMatch(/\.flyer-sheet-inside\s*\{[^}]*break-after:\s*avoid/);
  });

  it('forces exact colour printing so tinted cards and stickers survive', () => {
    expect(css).toContain('-webkit-print-color-adjust: exact');
    expect(css).toContain('print-color-adjust: exact');
  });

  it('hides screen chrome and prints on a white body', () => {
    const print = printMode();
    expect(print).toContain('.no-print');
    expect(print).toContain('header.site');
    expect(print).toContain('footer.site-footer');
    expect(print).toMatch(/body\s*\{[^}]*background:\s*#fff/);
  });

  it('targets the real header and footer classes', () => {
    expect(read('../components/Header.astro')).toMatch(/<header class="site[\s"]/);
    expect(read('../components/Footer.astro')).toContain('<footer class="site-footer"');
  });

  it('removes the screen-only fold guides and shadows when printing', () => {
    const print = printMode();
    expect(print).toMatch(/\.flyer-sheet\s*\{[^}]*box-shadow:\s*none/);
    expect(print).toMatch(/\.flyer-panel \+ \.flyer-panel\s*\{[^}]*box-shadow:\s*none/);
  });
});

describe('flyer stylesheet: stacked layout below 1200px', () => {
  it('flattens the sheets so panels stack as cards', () => {
    expect(css).toMatch(/\.flyer-sheet\s*\{[^}]*display:\s*contents/);
  });

  it('hides the sheet labels when stacked', () => {
    expect(css).toMatch(/\.flyer-sheet-label\s*\{[^}]*display:\s*none/);
  });

  it('re-sequences the panels into the reading journey', () => {
    const journey: [string, number][] = [
      ['cover', 1],
      ['inside-left', 2],
      ['flap', 3],
      ['inside-centre', 4],
      ['inside-right', 5],
      ['back', 6],
    ];
    for (const [name, order] of journey) {
      expect(css, `.flyer-${name}`).toMatch(new RegExp(`\\.flyer-${name}\\s*\\{[^}]*order:\\s*${order}\\s*;`));
    }
  });

  it('restores physical panel order on the true sheet', () => {
    expect(sheetMode()).toMatch(/\.flyer-panel\s*\{[^}]*order:\s*0/);
  });

  it('neutralises the global section padding inside the flyer', () => {
    expect(css).toMatch(/\.flyer-page\s+section\s*\{[^}]*padding:\s*0/);
    expect(read('../components/Layout.astro')).toMatch(/section\s*\{\s*padding:\s*72px 0/);
  });
});

describe('flyer stylesheet: typography and contrast', () => {
  it('overrides the mono label colour with an accessible brown', () => {
    expect(css).toContain('#7d5a2c');
  });

  it('never sets text below the 7.5pt small-print floor', () => {
    const sizes = [...css.matchAll(/font-size:\s*([\d.]+)pt/g)].map((m) => Number(m[1]));
    expect(sizes.length).toBeGreaterThan(0);
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(7.5);
  });

  it('sizes text in absolute units so print output does not depend on the viewport', () => {
    expect(css).not.toMatch(/font-size:\s*[\d.]+(rem|em|vw|vh|%)/);
  });
});

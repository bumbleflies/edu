import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf-8');

const css = read('./flyer.css');
const rawCss = css;
const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Returns the body of the first `@media` block whose query matches `query`. */
function mediaBlock(query: RegExp): string {
  const start = withoutComments.search(query);
  expect(start, `@media ${query} not found`).toBeGreaterThanOrEqual(0);
  const open = withoutComments.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < withoutComments.length; i++) {
    if (withoutComments[i] === '{') depth++;
    if (withoutComments[i] === '}' && --depth === 0) return withoutComments.slice(open + 1, i);
  }
  throw new Error('unbalanced braces');
}

const sheetQuery = /@media\s+screen\s+and\s+\(min-width:\s*900px\)\s*,\s*print/;
const sheetMode = () => mediaBlock(sheetQuery);
const printMode = () => mediaBlock(/@media\s+print\s*\{/);

/** The stylesheet with the sheet-mode and print @media blocks cut out: the stacked (phone) layout. */
function stackedLayout(): string {
  let rest = withoutComments;
  for (const block of [sheetMode(), printMode()]) rest = rest.replace(block, '');
  return rest;
}

/** Every innermost rule as { selector, body }, wherever it is nested. */
const rules = () =>
  [...withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim(), body: m[2] }));

describe('one-page flyer stylesheet: page and sheet', () => {
  it('declares an A4 portrait page without margins', () => {
    expect(css).toMatch(/@page\s*\{[^}]*size:\s*A4 portrait/);
    expect(css).toMatch(/@page\s*\{[^}]*margin:\s*0/);
  });

  it('shows the true 210mm x 297mm sheet only on wide screens and in print', () => {
    expect(css).toMatch(sheetQuery);
    const sheet = sheetMode();
    expect(sheet).toMatch(/\.pf-sheet\s*\{[^}]*width:\s*210mm/);
    expect(sheet).toMatch(/\.pf-sheet\s*\{[^}]*height:\s*297mm/);
    expect(sheet).toMatch(/\.pf-sheet\s*\{[^}]*overflow:\s*hidden/);
    expect(sheet).toMatch(/\.pf-sheet\s*\{[^}]*box-sizing:\s*border-box/);
  });

  it('does not fix the sheet size below 900px', () => {
    const stacked = stackedLayout();
    expect(stacked).not.toMatch(/\b(210|297)mm/);
    expect(stacked).not.toMatch(/\.pf-sheet\s*\{[^}]*(?<![-\w])(width|height):/);
  });

  it('centres the sheet on screen and lifts it with a shadow', () => {
    const sheet = sheetMode();
    expect(sheet).toMatch(/\.pf-page\s*\{[^}]*margin:[^;}]*auto/);
    expect(sheet).toMatch(/\.pf-sheet\s*\{[^}]*box-shadow:\s*0/);
  });

  it('keeps at least 8mm of padding from every sheet edge (no bleed, no full-bleed fills)', () => {
    const rule = sheetMode().match(/\.pf-sheet\s*\{([^}]*)\}/)?.[1] ?? '';
    const padding = rule.match(/padding:\s*([^;]+);/)?.[1] ?? '';
    const values = [...padding.matchAll(/([\d.]+)mm/g)].map((m) => Number(m[1]));
    expect(values.length, `padding: ${padding}`).toBeGreaterThan(0);
    for (const value of values) expect(value).toBeGreaterThanOrEqual(8);
  });

  it('spreads spare room between the sections instead of leaving one big gap', () => {
    expect(sheetMode()).toMatch(/\.pf-sheet\s*\{[^}]*justify-content:\s*space-between/);
  });
});

describe('one-page flyer stylesheet: printing', () => {
  it('forces exact colour printing so cream cards, pills and the sticker survive', () => {
    expect(css).toContain('-webkit-print-color-adjust: exact');
    expect(css).toContain('print-color-adjust: exact');
    expect(printMode()).toContain('print-color-adjust: exact');
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

  it('removes the screen shadow and margins so the sheet fills the page exactly', () => {
    const print = printMode();
    expect(print).toMatch(/\.pf-sheet\s*\{[^}]*box-shadow:\s*none/);
    expect(print).toMatch(/\.pf-page\s*\{[^}]*margin:\s*0/);
  });

  it('never breaks the sheet, so it can not spill onto a second page', () => {
    const print = printMode();
    expect(print).toMatch(/\.pf-sheet\s*\{[^}]*break-inside:\s*avoid/);
    expect(print).toMatch(/\.pf-sheet\s*\{[^}]*break-after:\s*avoid/);
  });
});

describe('one-page flyer stylesheet: stacked layout below 900px', () => {
  it('stacks the steps, the course cards and the bottom band in one column', () => {
    const stacked = stackedLayout();
    for (const cls of ['pf-steps', 'pf-course-grid', 'pf-band', 'pf-why']) {
      expect(stacked, `.${cls}`).not.toMatch(new RegExp(`\\.${cls}\\s*\\{[^}]*grid-template-columns`));
    }
  });

  it('lays those same blocks out side by side on the true sheet', () => {
    const sheet = sheetMode();
    for (const cls of ['pf-steps', 'pf-course-grid', 'pf-band', 'pf-why', 'pf-intro']) {
      expect(sheet, `.${cls}`).toMatch(new RegExp(`\\.${cls}\\s*\\{[^}]*grid-template-columns`));
    }
  });

  it('turns every section into a card on the phone and a plain region on the sheet', () => {
    expect(stackedLayout()).toMatch(/\.pf-page\s+\.pf-card\s*\{[^}]*background:\s*var\(--paper\)/);
    expect(sheetMode()).toMatch(/\.pf-page\s+\.pf-card\s*\{[^}]*background:\s*none/);
    expect(sheetMode()).toMatch(/\.pf-page\s+\.pf-card\s*\{[^}]*box-shadow:\s*none/);
  });

  it('lets long words, the phone number and the URL wrap instead of overflowing', () => {
    expect(stackedLayout()).toMatch(/\.pf-page\s*\{[^}]*overflow-wrap:\s*(break-word|anywhere)/);
    expect(stackedLayout()).toMatch(/\.pf-sheet\s*\{[^}]*min-width:\s*0/);
  });

  it('never forbids wrapping on the contact links or the URL', () => {
    for (const { selector, body } of rules()) {
      if (/pf-(contact|qr-url|signup)/.test(selector)) {
        expect(body, selector).not.toMatch(/white-space:\s*nowrap/);
      }
    }
  });

  it('neutralises the global section padding and heading defaults inside the flyer', () => {
    expect(withoutComments).toMatch(/\.pf-page\s+section\s*\{[^}]*padding:\s*0/);
    expect(withoutComments).toMatch(/\.pf-page\s+h1\s*,\s*\.pf-page\s+h2\s*,\s*\.pf-page\s+h3\s*\{[^}]*margin:\s*0/);
    expect(read('../components/Layout.astro')).toMatch(/section\s*\{\s*padding:\s*72px 0/);
  });

  it('keeps the flyer readable on a phone: a narrow, centred column with a 16px gutter', () => {
    expect(stackedLayout()).toMatch(/\.pf-page\s*\{[^}]*max-width:\s*\d+px/);
    expect(stackedLayout()).toMatch(/\.pf-page\s*\{[^}]*padding:\s*0 16px/);
  });
});

describe('one-page flyer stylesheet: design language', () => {
  it('overrides the mono label colour with an accessible brown', () => {
    expect(css).toContain('#7d5a2c');
  });

  it('gives every section a 12mm x 0.9mm amber rule under its title', () => {
    expect(withoutComments).toMatch(/h2::after\s*\{[^}]*width:\s*12mm/);
    expect(withoutComments).toMatch(/h2::after\s*\{[^}]*height:\s*0\.9mm/);
    expect(withoutComments).toMatch(/h2::after\s*\{[^}]*background:\s*var\(--accent\)/);
  });

  it('uses the tri-fold palette: cream cards, amber emphasis, purple age numerals', () => {
    expect(withoutComments).toMatch(/\.pf-course\s*\{[^}]*background:\s*var\(--bg\)/);
    expect(withoutComments).toMatch(/\.pf-sticker\s*\{[^}]*background:\s*var\(--accent\)/);
    expect(withoutComments).toMatch(/\.pf-price\s*\{[^}]*background:\s*var\(--accent\)/);
    expect(withoutComments).toMatch(/\.pf-age-range\s*\{[^}]*color:\s*var\(--signal\)/);
    expect(withoutComments).toMatch(/\.pf-age-range\s*\{[^}]*Instrument Serif/);
  });

  it('tints the sign-up card amber in both layouts (the sheet reset must not wipe it)', () => {
    expect(withoutComments).toMatch(/--pf-tint:\s*#[0-9a-f]{6}/i);
    expect(stackedLayout()).toMatch(/\.pf-page\s+\.pf-signup\s*\{[^}]*background:\s*var\(--pf-tint\)/);
    expect(sheetMode()).toMatch(/\.pf-page\s+\.pf-signup\s*\{[^}]*background:\s*var\(--pf-tint\)/);
    expect(sheetMode()).toMatch(/\.pf-page\s+\.pf-team\s*\{[^}]*background:\s*var\(--bg\)/);
  });

  it('crops the hero so the robot and the child both stay in frame', () => {
    expect(withoutComments).toMatch(/\.pf-hero\s*\{[^}]*aspect-ratio:\s*8\s*\/\s*5/);
    expect(withoutComments).toMatch(/\.pf-hero img\s*\{[^}]*object-fit:\s*cover/);
    expect(withoutComments).toMatch(/\.pf-hero img\s*\{[^}]*object-position:\s*32% 50%/);
  });

  it('sizes the QR code at 30mm', () => {
    expect(withoutComments).toMatch(/\.pf-signup img\s*\{[^}]*width:\s*30mm/);
    expect(withoutComments).toMatch(/\.pf-signup img\s*\{[^}]*height:\s*30mm/);
  });

  it('sets the headline in display size on the sheet (38pt to 42pt)', () => {
    const size = Number(sheetMode().match(/\.pf-intro h1\s*\{[^}]*font-size:\s*([\d.]+)pt/)?.[1]);
    expect(size).toBeGreaterThanOrEqual(38);
    expect(size).toBeLessThanOrEqual(42);
  });
});

describe('one-page flyer stylesheet: typography', () => {
  it('never sets text below 9pt, except the small print which may go down to 7.5pt', () => {
    const sizes: { selector: string; size: number }[] = [];
    for (const { selector, body } of rules()) {
      for (const match of body.matchAll(/font-size:\s*([\d.]+)pt/g)) sizes.push({ selector, size: Number(match[1]) });
    }
    expect(sizes.length).toBeGreaterThan(10);
    for (const { selector, size } of sizes) {
      const floor = selector.includes('pf-small-print') ? 7.5 : 9;
      expect(size, selector).toBeGreaterThanOrEqual(floor);
    }
    expect(sizes.some(({ selector }) => selector.includes('pf-small-print'))).toBe(true);
  });

  it('sizes text in absolute units so print output does not depend on the viewport', () => {
    expect(withoutComments).not.toMatch(/font-size:\s*[\d.]+(rem|em|vw|vh|%)/);
  });
});

describe('one-page flyer stylesheet: isolation from the tri-fold', () => {
  it('has none of the tri-fold class names', () => {
    for (const name of ['flyer-sheet', 'flyer-panel', 'flyer-trifold', 'flyer-page', 'flyer-actions', 'flyer-print-hint']) {
      expect(rawCss, name).not.toContain(name);
    }
    expect(rawCss).not.toMatch(/\.flyer-/);
  });

  it('has none of the tri-fold sheet rules', () => {
    expect(rawCss).not.toContain('97mm 100mm 100mm');
    expect(rawCss).not.toContain('100mm 100mm 97mm');
    expect(rawCss).not.toMatch(/A4 landscape/);
    expect(rawCss).not.toMatch(/297mm\s+210mm|width:\s*297mm|height:\s*210mm/);
    expect(rawCss).not.toMatch(/min-width:\s*1200px/);
  });

  it('only styles pf- classes, plus the shared eyebrow label and the print-hiding hooks', () => {
    const allowed = /^(pf-|eyebrow$|no-print$|site$|site-footer$)/;
    for (const { selector } of rules()) {
      for (const [, name] of selector.matchAll(/\.([A-Za-z][\w-]*)/g)) {
        expect(name, selector).toMatch(allowed);
      }
    }
  });

  it('is not the tri-fold stylesheet file', () => {
    expect(rawCss).not.toBe(read('./flyer-trifold.css'));
  });
});

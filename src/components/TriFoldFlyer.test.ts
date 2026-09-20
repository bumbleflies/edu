import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf-8');

const source = read('./TriFoldFlyer.astro');
const count = (pattern: RegExp) => source.match(pattern)?.length ?? 0;

/** Index of `needle` in the component source; fails the test if it is missing. */
function at(needle: string): number {
  const index = source.indexOf(needle);
  expect(index, `"${needle}" not found in TriFoldFlyer.astro`).toBeGreaterThanOrEqual(0);
  return index;
}
const panel = (name: string) => at(`class="flyer-panel flyer-${name}"`);

describe('TriFoldFlyer structure', () => {
  it('renders exactly six panels on two sheets', () => {
    expect(count(/class="flyer-panel/g)).toBe(6);
    expect(count(/class="flyer-sheet /g)).toBe(2);
    expect(source).toContain('class="flyer-sheet flyer-sheet-outside"');
    expect(source).toContain('class="flyer-sheet flyer-sheet-inside"');
  });

  it('names all six panels', () => {
    for (const name of ['cover', 'inside-left', 'flap', 'inside-centre', 'inside-right', 'back']) {
      panel(name);
    }
  });

  it('keeps DOM order equal to the physical order of each sheet', () => {
    // Outside sheet, left to right: flap | back cover | front cover.
    expect(panel('flap')).toBeLessThan(panel('back'));
    expect(panel('back')).toBeLessThan(panel('cover'));
    // Inside sheet, left to right: inside-left | inside-centre | inside-right.
    expect(panel('inside-left')).toBeLessThan(panel('inside-centre'));
    expect(panel('inside-centre')).toBeLessThan(panel('inside-right'));
  });

  it('puts the whole outside sheet before the inside sheet', () => {
    const insideSheet = at('class="flyer-sheet flyer-sheet-inside"');
    const outsideSheet = at('class="flyer-sheet flyer-sheet-outside"');
    expect(outsideSheet).toBeLessThan(insideSheet);
    for (const name of ['flap', 'back', 'cover']) {
      expect(panel(name)).toBeGreaterThan(outsideSheet);
      expect(panel(name)).toBeLessThan(insideSheet);
    }
    for (const name of ['inside-left', 'inside-centre', 'inside-right']) {
      expect(panel(name)).toBeGreaterThan(insideSheet);
    }
  });

  it('precedes each sheet with a screen-only label', () => {
    expect(count(/class="flyer-sheet-label no-print"/g)).toBe(2);
    const [first, second] = [...source.matchAll(/class="flyer-sheet-label no-print"/g)].map((m) => m.index ?? -1);
    expect(first).toBeLessThan(at('class="flyer-sheet flyer-sheet-outside"'));
    expect(at('class="flyer-sheet flyer-sheet-outside"')).toBeLessThan(second);
    expect(second).toBeLessThan(at('class="flyer-sheet flyer-sheet-inside"'));
    expect(source).toContain('f.outsideLabel');
    expect(source).toContain('f.insideLabel');
  });

  it('has a single h1 on the cover and h2 titles on the other five panels', () => {
    expect(count(/<h1[\s>]/g)).toBe(1);
    expect(count(/<h2[\s>]/g)).toBe(5);
    const h1 = at('<h1');
    expect(h1).toBeGreaterThan(panel('cover'));
    expect(h1).toBeLessThan(at('class="flyer-sheet flyer-sheet-inside"'));
  });
});

describe('TriFoldFlyer content', () => {
  it('is driven by the language prop and the content module', () => {
    expect(source).toMatch(/lang:\s*Lang/);
    expect(source).toContain('content[lang]');
  });

  it('builds the panels from existing site content', () => {
    for (const field of ['c.steps', 'c.whyList', 'c.trainers', 'c.courses', 'c.ctaTitle', 'f.kicker', 'c.heroTitle', 'c.heroTitlePop']) {
      expect(source, field).toContain(field);
    }
  });

  it('uses the shared brand mark and the real hero image', () => {
    expect(source).toContain('<Mark />');
    expect(source).toContain('/images/hero.webp');
  });

  it('shows trainers with avatar, name, role and blurb', () => {
    for (const field of ['trainer.image', 'trainer.name', 'trainer.role', 'trainer.blurb']) {
      expect(source, field).toContain(field);
    }
  });

  it('shows each course with a big age numeral, tag, duration, outcomes and a price', () => {
    for (const field of ['splitAge(', 'course.name', 'course.tag', 'course.duration', 'course.outcomes', 'priceByCourseName']) {
      expect(source, field).toContain(field);
    }
  });

  it('looks prices up by course name, never by array index', () => {
    expect(source).not.toMatch(/pretixCourses\s*\[/);
  });

  it('has no course photos and no course blurbs', () => {
    expect(source).not.toContain('course.image');
    expect(source).not.toContain('course.blurb');
    expect(source).not.toMatch(/course-(blocks|code)\.webp/);
  });

  it('repeats the facts strip on the inside-centre and back panels', () => {
    expect(count(/f\.startFact/g)).toBe(2);
    expect(count(/f\.locationFact/g)).toBe(2);
  });

  it('carries no testimonials and no keep-the-robot claim', () => {
    expect(source.toLowerCase()).not.toContain('testimonial');
    expect(source).not.toMatch(/behalten|mitnehmen|to keep/i);
  });
});

describe('TriFoldFlyer contact and sign-up', () => {
  it('shows the phone number as a tel: link and the email as a mailto: link', () => {
    expect(source).toContain('0151 24154206');
    expect(source).toContain('href="tel:+4915124154206"');
    expect(source).toContain('info@bumbleflies.de');
    expect(source).toContain('href="mailto:info@bumbleflies.de"');
  });

  it('uses the per-language QR asset twice (sign-up strip and back cover)', () => {
    expect(source).toContain('/images/flyer-qr-de.svg');
    expect(source).toContain('/images/flyer-qr-en.svg');
    expect(count(/src=\{qr\.src\}/g)).toBe(2);
  });

  it('shows the site URL as text beneath the big QR code', () => {
    expect(source).toContain('edu.bumbleflies.de/en/');
    expect(source).toMatch(/url:\s*"edu\.bumbleflies\.de"/);
    expect(source).toContain('{qr.url}');
  });

  it('places the sign-up strip in the inside-right panel and the call to action on the back', () => {
    const insideRight = panel('inside-right');
    const back = panel('back');
    expect(at('f.signupTitle')).toBeGreaterThan(insideRight);
    expect(at('f.signupText')).toBeGreaterThan(insideRight);
    expect(at('c.ctaTitle')).toBeGreaterThan(back);
    expect(at('f.qrCaption')).toBeGreaterThan(back);
    expect(at('f.smallPrint')).toBeGreaterThan(back);
  });

  it('guides the reader with open hints on the cover and the flap', () => {
    expect(at('f.openHint')).toBeGreaterThan(panel('cover'));
    expect(at('f.flapHint')).toBeGreaterThan(panel('flap'));
    expect(at('f.flapHint')).toBeLessThan(panel('back'));
  });
});

describe('TriFoldFlyer mbot2 banner', () => {
  it('uses the mbot2 image, its alt text and the photo credit from the copy block', () => {
    expect(source).toContain('/images/mbot2.webp');
    expect(source).toContain('f.mbotAlt');
    expect(source).toContain('f.photoCredit');
  });
});

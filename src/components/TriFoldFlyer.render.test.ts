import { describe, it, expect, beforeAll } from 'vitest';
import { ownershipClaim } from '../test-utils/ownership-claim';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import TriFoldFlyer from './TriFoldFlyer.astro';
import { content } from '../lib/content';
import coursesData from '../data/courses.json';

/** These render the real component and check the HTML a reader (and printer) gets. */

const PHONE_DISPLAY = '0151 24154206';
const PHONE_HREF = 'tel:+4915124154206';
const EMAIL = 'info@bumbleflies.de';

/** Visible text: tags dropped, entities decoded, whitespace collapsed. */
const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

/** Inner HTML of one panel, e.g. panel(html, 'back'). */
const panel = (html: string, name: string) => {
  const match = html.match(new RegExp(`<section[^>]*class="[^"]*\\bflyer-${name}\\b[^"]*"[^>]*>([\\s\\S]*?)</section>`));
  if (!match) throw new Error(`panel flyer-${name} not found`);
  return match[1];
};

describe.each(['de', 'en'] as const)('TriFoldFlyer (%s)', (lang) => {
  const other = lang === 'de' ? 'en' : 'de';
  const c = content[lang];
  const f = c.flyer;
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(TriFoldFlyer, { props: { lang } });
  });

  it('has two sheets and six panels, in the physical order of each sheet', () => {
    expect((html.match(/class="flyer-sheet flyer-sheet-outside"/g) ?? []).length).toBe(1);
    expect((html.match(/class="flyer-sheet flyer-sheet-inside"/g) ?? []).length).toBe(1);
    const order = [...html.matchAll(/<section[^>]*class="[^"]*\bflyer-panel\s+flyer-([a-z-]+)/g)].map((m) => m[1]);
    expect(order).toEqual(['flap', 'back', 'cover', 'inside-left', 'inside-centre', 'inside-right']);
  });

  it('labels each sheet for the screen preview only', () => {
    expect((html.match(/class="flyer-sheet-label no-print"/g) ?? []).length).toBe(2);
    expect(text(html)).toContain(f.outsideLabel);
    expect(text(html)).toContain(f.insideLabel);
  });

  it('has exactly one h1 and a non-empty alt text on every image', () => {
    expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);
    const images = html.match(/<img[^>]*>/g) ?? [];
    // hero, two trainer avatars, two QR codes
    expect(images).toHaveLength(5);
    for (const image of images) expect(image).toMatch(/alt="[^"]+"/);
  });

  describe('QR codes', () => {
    it("both use this language's asset, never the other language's", () => {
      const sources = [...html.matchAll(/<img[^>]*src="([^"]*flyer-qr-[^"]*)"/g)].map((m) => m[1]);
      expect(sources).toEqual([`/images/flyer-qr-${lang}.svg`, `/images/flyer-qr-${lang}.svg`]);
      expect(html).not.toContain(`flyer-qr-${other}`);
    });

    it('sit on the back cover and in the inside-right sign-up strip', () => {
      expect(panel(html, 'back')).toContain(`/images/flyer-qr-${lang}.svg`);
      expect(panel(html, 'inside-right')).toContain(`/images/flyer-qr-${lang}.svg`);
    });

    it("the back cover prints this language's website address under the code", () => {
      const url = lang === 'de' ? 'edu.bumbleflies.de' : 'edu.bumbleflies.de/en/';
      expect(panel(html, 'back')).toContain(`<p class="flyer-qr-url">${url}</p>`);
    });
  });

  describe('course cards', () => {
    const cards = () => [...html.matchAll(/<article class="flyer-course">([\s\S]*?)<\/article>/g)].map((m) => m[1]);

    it('one card per course, in the course data order', () => {
      expect(cards()).toHaveLength(coursesData.courses.length);
      cards().forEach((card, i) => expect(card).toContain(`<h3>${coursesData.courses[i].name[lang]}</h3>`));
    });

    it('each card carries its own price from the course data', () => {
      for (const course of coursesData.courses) {
        const card = cards().find((candidate) => candidate.includes(`<h3>${course.name[lang]}</h3>`));
        expect(card, `card for ${course.name[lang]}`).toBeDefined();
        const label = lang === 'de' ? `${course.price} € pro Kurs` : `€${course.price} per course`;
        expect(card).toContain(`<p class="flyer-price">${label}</p>`);
      }
      const prices = [...html.matchAll(/<p class="flyer-price">([^<]*)<\/p>/g)];
      expect(prices).toHaveLength(coursesData.courses.length);
    });

    it('each card shows its age range as a big numeral with the unit beneath', () => {
      for (const course of c.courses) {
        const [, range, unit] = course.age.match(/^(\S+)\s+(.+)$/) ?? [];
        const card = cards().find((candidate) => candidate.includes(`<h3>${course.name}</h3>`));
        expect(card).toContain(`<span class="flyer-age-range">${range}</span>`);
        expect(card).toContain(`<span class="flyer-age-unit">${unit}</span>`);
      }
    });
  });

  it('every phone and email link is correct, wherever it appears', () => {
    const tels = [...html.matchAll(/<a href="(tel:[^"]+)"[^>]*>([^<]*)<\/a>/g)].map((m) => [m[1], m[2]]);
    expect(tels).toEqual([
      [PHONE_HREF, PHONE_DISPLAY],
      [PHONE_HREF, PHONE_DISPLAY],
    ]);
    expect(panel(html, 'back')).toContain(`href="${PHONE_HREF}"`);
    expect(panel(html, 'inside-right')).toContain(`href="${PHONE_HREF}"`);

    const mails = [...html.matchAll(/<a href="(mailto:[^"]+)"[^>]*>([^<]*)<\/a>/g)].map((m) => [m[1], m[2]]);
    expect(mails).toEqual([[`mailto:${EMAIL}`, EMAIL]]);
    expect(panel(html, 'back')).toContain(`mailto:${EMAIL}`);
  });

  it('shows the start and location facts on the courses panel and on the back cover', () => {
    for (const name of ['inside-centre', 'back']) {
      const visible = text(panel(html, name));
      expect(visible).toContain(f.startFact);
      expect(visible).toContain(f.locationFact);
    }
  });

  describe('reading journey: the right content in the right panel', () => {
    it('cover: hook, sticker, parent line and the open hint', () => {
      const cover = text(panel(html, 'cover'));
      for (const part of [f.kicker, c.heroTitle, c.heroTitlePop, f.sticker, f.parentLine, f.openHint]) {
        expect(cover).toContain(text(part));
      }
      // the site's long hero sentence is too wordy for the cover
      expect(cover).not.toContain(text(c.heroEyebrow));
      expect(panel(html, 'cover')).toContain('src="/images/hero.webp"');
    });

    it('inside-left: the three steps in order, then the closing line', () => {
      const left = text(panel(html, 'inside-left'));
      const positions = c.steps.map((step) => left.indexOf(step.title));
      expect(positions.every((p) => p >= 0)).toBe(true);
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
      for (const step of c.steps) expect(left).toContain(text(step.text));
      expect(left).toContain(text(f.experienceClosing));
    });

    it('flap: every reassurance point and the flap hint', () => {
      const flap = text(panel(html, 'flap'));
      for (const item of c.whyList) {
        expect(flap).toContain(item.title);
        expect(flap).toContain(text(item.text));
      }
      expect(flap).toContain(text(f.flapHint));
    });

    it('inside-right: both trainers with avatar, role and blurb, then the sign-up strip', () => {
      const right = panel(html, 'inside-right');
      for (const trainer of c.trainers) {
        expect(right).toContain(`src="${trainer.image}"`);
        expect(text(right)).toContain(trainer.name);
        expect(text(right)).toContain(text(trainer.role));
        expect(text(right)).toContain(text(trainer.blurb));
      }
      expect(text(right)).toContain(f.signupTitle);
      expect(text(right)).toContain(text(f.signupText));
    });

    it('back cover: the site call to action, caption and small print', () => {
      const back = text(panel(html, 'back'));
      expect(back).toContain(c.ctaTitle);
      expect(back).toContain(f.qrCaption);
      expect(back).toContain(text(f.smallPrint));
    });
  });

  it('leaves out testimonials and any claim that kids keep the robot', () => {
    const visible = text(html);
    for (const testimonial of c.testimonials) expect(visible).not.toContain(text(testimonial.quote).slice(0, 30));
    expect(visible).not.toMatch(ownershipClaim);
  });
});

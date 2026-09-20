import { describe, it, expect, beforeAll } from 'vitest';
import { ownershipClaim } from '../test-utils/ownership-claim';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ParentFlyer from './ParentFlyer.astro';
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

/** Inner HTML of one `<section class="pf-<name> ...">`; the flyer's sections never nest. */
const section = (html: string, name: string) => {
  const match = html.match(new RegExp(`<section[^>]*class="[^"]*\\bpf-${name}\\b[^"]*"[^>]*>([\\s\\S]*?)</section>`));
  if (!match) throw new Error(`section pf-${name} not found`);
  return match[1];
};

const source = readFileSync(fileURLToPath(new URL('./ParentFlyer.astro', import.meta.url)), 'utf-8');

describe('ParentFlyer source', () => {
  it('loads the one-page stylesheet and never the tri-fold one', () => {
    expect(source).toMatch(/import\s+"\.\.\/styles\/flyer\.css"/);
    expect(source).not.toContain('flyer-trifold');
  });

  it('takes its language from the prop and its copy from the content module', () => {
    expect(source).toMatch(/lang:\s*Lang/);
    expect(source).toContain('content[lang]');
  });

  it('looks prices up by course name, never by array index', () => {
    expect(source).toContain('priceByCourseName');
    expect(source).not.toMatch(/pretixCourses\s*\[/);
  });
});

describe.each(['de', 'en'] as const)('ParentFlyer (%s)', (lang) => {
  const other = lang === 'de' ? 'en' : 'de';
  const c = content[lang];
  const f = c.flyer;
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(ParentFlyer, { props: { lang } });
  });

  describe('structure', () => {
    it('is exactly one sheet inside one page wrapper', () => {
      expect((html.match(/<article class="pf-page">/g) ?? []).length).toBe(1);
      expect((html.match(/<div class="pf-sheet">/g) ?? []).length).toBe(1);
    });

    it('stacks the sections in reading order: intro, experience, courses, parents, team, sign-up', () => {
      const order = [...html.matchAll(/<section[^>]*class="pf-([a-z-]+)(?:\s[^"]*)?"/g)].map((m) => m[1]);
      expect(order).toEqual(['intro', 'experience', 'courses', 'parents', 'team', 'signup']);
      const small = html.indexOf('class="pf-small-print"');
      expect(small).toBeGreaterThan(html.indexOf('class="pf-signup"'));
    });

    it('has exactly one h1 in the intro and an h2 on every other content section', () => {
      expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);
      expect(section(html, 'intro')).toMatch(/<h1[\s>]/);
      for (const name of ['experience', 'courses', 'parents', 'signup']) {
        expect(section(html, name), name).toMatch(/<h2[\s>]/);
      }
    });

    it('leaves out the tri-fold markup and only uses pf- classes', () => {
      expect(html).not.toMatch(/flyer-(sheet|panel|trifold)/);
      expect(html).not.toMatch(/class="[^"]*\bflyer-/);
      const tokens = [...html.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);
      for (const token of tokens) expect(token, token).toMatch(/^(pf-|eyebrow$|bf-mark$)/);
    });

    it('labels sections with the mono eyebrow and an h2 title', () => {
      const pairs: [string, string, string][] = [
        ['experience', f.experienceLabel, f.experienceTitle],
        ['courses', f.coursesLabel, f.coursesTitle],
        ['parents', f.parentsLabel, f.parentsTitle],
      ];
      for (const [name, label, title] of pairs) {
        const body = section(html, name);
        expect(body, name).toContain(`<span class="eyebrow">${label}</span>`);
        expect(body, name).toContain(`<h2>${title}</h2>`);
      }
    });
  });

  describe('images', () => {
    it('has exactly five images: informative alt on the hero and the QR code, empty alt on the avatars', () => {
      const images = html.match(/<img[^>]*>/g) ?? [];
      // hero, three trainer avatars, one QR code
      expect(images).toHaveLength(5);
      const avatars = images.filter((image) => /trainer_/.test(image));
      expect(avatars).toHaveLength(3);
      // the trainer's name is printed right next to the avatar, so the picture itself is decorative
      for (const avatar of avatars) expect(avatar).toMatch(/alt=""/);
      for (const image of images.filter((image) => !/trainer_/.test(image))) expect(image).toMatch(/alt="[^"]+"/);
    });

    it('every image has explicit dimensions so nothing shifts while loading', () => {
      for (const image of html.match(/<img[^>]*>/g) ?? []) {
        expect(image).toMatch(/width="\d+"/);
        expect(image).toMatch(/height="\d+"/);
      }
    });
  });

  describe('intro: brand, headline, lead, hero and sticker', () => {
    it('carries the brand, the kicker and the two-part headline', () => {
      const intro = section(html, 'intro');
      expect(text(intro)).toContain('bumble:futurespace');
      expect(text(intro)).toContain('powered by bumble:education');
      expect(text(intro)).toContain(text(f.kicker));
      // the site's long hero sentence is too wordy for the top of the page
      expect(text(intro)).not.toContain(text(c.heroEyebrow));
      expect(intro).toContain('class="pf-kicker"');
      const h1 = intro.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
      expect(text(h1)).toContain(c.heroTitle);
      expect(text(h1)).toContain(c.heroTitlePop);
    });

    it('shows the one-page lead line under the headline', () => {
      const intro = section(html, 'intro');
      const lead = intro.match(/<p class="pf-lead">([\s\S]*?)<\/p>/)?.[1] ?? '';
      expect(text(lead)).toBe(f.onePageLead);
      expect(intro.indexOf('</h1>')).toBeLessThan(intro.indexOf('class="pf-lead"'));
    });

    it('shows the hero photo with the sticker for the child on top of it', () => {
      const intro = section(html, 'intro');
      expect(intro).toMatch(new RegExp(`<img[^>]*src="/images/hero\\.webp"[^>]*alt="${f.heroAlt}"`));
      const hero = intro.match(/<div class="pf-hero">([\s\S]*?)<\/div>/)?.[1] ?? '';
      expect(hero).toContain('src="/images/hero.webp"');
      expect(hero).toContain(`<p class="pf-sticker">${f.sticker}</p>`);
    });
  });

  describe('experience: the three steps', () => {
    it('lists the steps in order, numbered, each with its title', () => {
      const body = section(html, 'experience');
      const visible = text(body);
      const positions = c.steps.map((step) => visible.indexOf(step.title));
      expect(positions.every((p) => p >= 0)).toBe(true);
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
      const numbers = [...body.matchAll(/<span class="pf-step-num"[^>]*>(\d+)<\/span>/g)].map((m) => m[1]);
      expect(numbers).toEqual(['1', '2', '3']);
    });

    it('is a compact timeline of titles: the one-page sheet has no room for the step descriptions', () => {
      const items = [...section(html, 'experience').matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
      expect(items).toHaveLength(c.steps.length);
      items.forEach((item, i) => expect(text(item)).toBe(`${i + 1} ${c.steps[i].title}`));
    });
  });

  describe('course cards', () => {
    const cards = () => [...html.matchAll(/<article class="pf-course">([\s\S]*?)<\/article>/g)].map((m) => m[1]);

    it('one card per course, in the course data order', () => {
      expect(cards()).toHaveLength(coursesData.courses.length);
      cards().forEach((card, i) => expect(card).toContain(`<h3>${coursesData.courses[i].name[lang]}</h3>`));
    });

    it('each card carries its own price from the course data', () => {
      for (const course of coursesData.courses) {
        const card = cards().find((candidate) => candidate.includes(`<h3>${course.name[lang]}</h3>`));
        expect(card, `card for ${course.name[lang]}`).toBeDefined();
        const label = lang === 'de' ? `${course.price} € pro Kurs` : `€${course.price} per course`;
        expect(card).toContain(`<p class="pf-price">${label}</p>`);
      }
      const prices = [...html.matchAll(/<p class="pf-price">([^<]*)<\/p>/g)];
      expect(prices).toHaveLength(coursesData.courses.length);
    });

    it('each card shows its age range as a big numeral with the unit beside or under it', () => {
      for (const course of c.courses) {
        const [, range, unit] = course.age.match(/^(\S+)\s+(.+)$/) ?? [];
        const card = cards().find((candidate) => candidate.includes(`<h3>${course.name}</h3>`));
        expect(card).toContain(`<span class="pf-age-range">${range}</span>`);
        expect(card).toContain(`<span class="pf-age-unit">${unit}</span>`);
      }
    });

    it('each card shows tag, duration and every outcome as a bullet', () => {
      for (const course of c.courses) {
        const card = cards().find((candidate) => candidate.includes(`<h3>${course.name}</h3>`)) ?? '';
        expect(text(card)).toContain(text(course.tag));
        expect(text(card)).toContain(text(course.duration));
        const bullets = [...card.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => text(m[1]));
        expect(bullets).toEqual(course.outcomes.map(text));
      }
    });

    it('has no course photos and no course blurbs', () => {
      expect(html).not.toMatch(/course-(blocks|code)\.webp/);
      for (const course of c.courses) expect(text(html)).not.toContain(text(course.blurb).slice(0, 30));
    });
  });

  it('shows the start and location facts once, in the courses section', () => {
    const body = section(html, 'courses');
    expect(body).toContain(`<li>${f.startFact}</li>`);
    expect(body).toContain(`<li>${f.locationFact}</li>`);
    expect(text(html).split(f.startFact)).toHaveLength(2);
    expect(text(html).split(f.locationFact)).toHaveLength(2);
  });

  describe('parents: why it is a safe choice', () => {
    it('lists all reassurance points, each with its title and text', () => {
      const body = section(html, 'parents');
      const items = [...body.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
      expect(items).toHaveLength(c.whyList.length);
      c.whyList.forEach((item, i) => {
        expect(text(items[i])).toContain(item.title);
        expect(text(items[i])).toContain(text(item.text));
      });
    });

    it('marks every point with a decorative check marker', () => {
      const body = section(html, 'parents');
      expect((body.match(/<span class="pf-marker" aria-hidden="true"><\/span>/g) ?? []).length).toBe(c.whyList.length);
    });
  });

  describe('team', () => {
    it('shows both trainers with avatar, name and role, and no blurb', () => {
      const body = section(html, 'team');
      expect(text(body)).toContain(c.trainersEyebrow);
      for (const trainer of c.trainers) {
        expect(body).toMatch(new RegExp(`<img[^>]*src="${trainer.image}"[^>]*alt=""`));
        expect(text(body)).toContain(trainer.name);
        expect(text(body)).toContain(text(trainer.role));
        expect(text(body)).not.toContain(text(trainer.blurb).slice(0, 30));
      }
      expect((body.match(/<img/g) ?? []).length).toBe(c.trainers.length);
    });
  });

  describe('sign-up: QR code and contact', () => {
    it("has exactly one QR code and it is this language's asset, never the other language's", () => {
      const sources = [...html.matchAll(/<img[^>]*src="([^"]*flyer-qr-[^"]*)"/g)].map((m) => m[1]);
      expect(sources).toEqual([`/images/flyer-qr-${lang}.svg`]);
      expect(html).not.toContain(`flyer-qr-${other}`);
      expect(section(html, 'signup')).toContain(`/images/flyer-qr-${lang}.svg`);
    });

    it("prints this language's website address under the code, with the caption", () => {
      const url = lang === 'de' ? 'edu.bumbleflies.de' : 'edu.bumbleflies.de/en/';
      const body = section(html, 'signup');
      expect(body).toContain(`<p class="pf-qr-url">${url}</p>`);
      expect(body).toMatch(new RegExp(`<img[^>]*alt="${f.qrAlt}"`));
      expect(text(body)).toContain(f.signupTitle);
      expect(text(body)).toContain(f.qrCaption);
    });

    it('every phone and email link is correct, wherever it appears', () => {
      const tels = [...html.matchAll(/<a href="(tel:[^"]+)"[^>]*>([^<]*)<\/a>/g)].map((m) => [m[1], m[2]]);
      expect(tels).toEqual([[PHONE_HREF, PHONE_DISPLAY]]);
      const mails = [...html.matchAll(/<a href="(mailto:[^"]+)"[^>]*>([^<]*)<\/a>/g)].map((m) => [m[1], m[2]]);
      expect(mails).toEqual([[`mailto:${EMAIL}`, EMAIL]]);
      expect(section(html, 'signup')).toContain(`href="${PHONE_HREF}"`);
      expect(section(html, 'signup')).toContain(`mailto:${EMAIL}`);
    });

    it('does not print a bare, un-linked phone number anywhere', () => {
      const withoutLinks = html.replace(/<a [^>]*>[^<]*<\/a>/g, '');
      expect(withoutLinks).not.toContain(PHONE_DISPLAY);
      expect(withoutLinks).not.toContain(EMAIL);
    });
  });

  it('ends with the small print, after everything else', () => {
    const smallPrint = html.match(/<p class="pf-small-print">([\s\S]*?)<\/p>/)?.[1] ?? '';
    expect(text(smallPrint)).toBe(f.smallPrint);
    expect(html.indexOf('class="pf-small-print"')).toBeGreaterThan(html.lastIndexOf('</section>'));
  });

  it('marks every list as a list, because the CSS removes the bullets (Safari drops the semantics otherwise)', () => {
    const lists = html.match(/<(ul|ol)\b[^>]*>/g) ?? [];
    expect(lists.length).toBeGreaterThanOrEqual(4);
    for (const list of lists) expect(list).toMatch(/role="list"/);
  });

  it('leaves out testimonials and any claim that kids keep the robot', () => {
    const visible = text(html);
    for (const testimonial of c.testimonials) expect(visible).not.toContain(text(testimonial.quote).slice(0, 30));
    expect(visible).not.toMatch(/testimonial/i);
    expect(visible).not.toMatch(ownershipClaim);
  });
});

describe('one-page print budget', () => {
  // The A4 sheet is tuned for four reassurance cards (2 x 2) and four outcomes per course. A fifth card once
  // pushed the team, the QR card and the contact line off the page (0.18.0), so growing either needs a layout review.
  it.each(['de', 'en'] as const)('%s: the copy stays within what fits on one printed page', (lang) => {
    const c = content[lang];
    expect(c.whyList.length).toBeLessThanOrEqual(4);
    for (const course of c.courses) expect(course.outcomes.length).toBeLessThanOrEqual(4);
    const reassuranceChars = c.whyList.reduce((sum, item) => sum + item.title.length + item.text.length, 0);
    expect(reassuranceChars, 'reassurance copy length').toBeLessThanOrEqual(560);
    expect(c.steps.length).toBe(3);
    expect(c.trainers.length).toBeLessThanOrEqual(3);
  });
});

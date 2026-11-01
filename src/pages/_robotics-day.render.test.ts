import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import DayDe from './robotik-tag.astro';
import DayEn from './en/robotics-day.astro';
import HomeDe from './index.astro';
import HomeEn from './en/index.astro';
import { camp, campPath } from '../lib/camp';

const render = async (page: Parameters<AstroContainer['renderToString']>[0]) =>
  (await AstroContainer.create()).renderToString(page);

describe.each([
  ['de', DayDe, '/en/robotics-day', 'Robotik-Tag zwischen den Jahren', '39 €', ['28.', '29.', '30. Dezember 2026']],
  ['en', DayEn, '/robotik-tag', 'Between the Years — Robotics Day', '€39', ['28', '29', '30 December 2026']],
] as const)('Robotics Day announcement (%s)', (lang, page, twin, name, price, dates) => {
  it('is an indexable page in its language, linked to its twin', async () => {
    const html = await render(page);
    expect(html).toContain(`<html lang="${lang}"`);
    expect(html).toContain(`<title>${name} · edu.bumbleflies.de</title>`);
    expect(html).not.toMatch(/<meta name="robots"/);
    expect(html).toContain(`href="${twin}"`);
    expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);
  });

  it('states the facts from courses.json', async () => {
    const html = await render(page);
    expect(html).toContain(price);
    for (const d of dates) expect(html).toContain(d);
    expect(html).toContain('10:00');
    expect(html).toContain('14:00');
    expect(html).toContain('13:30');
    expect(html).toContain('8–12');
    expect(html).toContain(String(camp.capacity));
  });

  it('asks for a reservation by email while booking is closed', async () => {
    const html = await render(page);
    expect(camp.bookingOpen).toBe(false);
    expect(html).toMatch(/href="mailto:info@bumbleflies\.de\?subject=[^"]+"/);
    expect(html).not.toContain('pretix.eu/bumbleedu/zwischen-den-jahren');
  });

  it('tells venues what kind of room is needed', async () => {
    const html = await render(page);
    expect(html).toContain('id="venue"');
    expect(html).toContain('09:30');
  });

  it('never calls the day free', async () => {
    const text = (await render(page)).replace(/<[^>]+>/g, ' ').toLowerCase();
    expect(text).not.toContain('kostenlos');
    expect(text).not.toMatch(/\bfree\b/);
    expect(text).toContain('bildung und teilhabe');
  });
});

describe.each([
  ['de', HomeDe],
  ['en', HomeEn],
] as const)('homepage teaser (%s)', (lang, page) => {
  it('links to the Robotics Day page', async () => {
    const html = await render(page);
    expect(html).toMatch(new RegExp(`<a\\b[^>]*href="${campPath[lang]}"`));
  });
});

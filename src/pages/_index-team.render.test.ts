import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import HomeDe from './index.astro';
import HomeEn from './en/index.astro';
import { content } from '../lib/content';

describe.each([
  ['de', HomeDe],
  ['en', HomeEn],
] as const)('homepage team (%s)', (lang, page) => {
  it('shows all three trainers, Thore last, each with role and blurb', async () => {
    const html = await (await AstroContainer.create()).renderToString(page);
    const cards = [...html.matchAll(/<article class="trainer-card"[^>]*>([\s\S]*?)<\/article>/g)].map((m) => m[1]);
    expect(cards).toHaveLength(3);
    content[lang].trainers.forEach((trainer, i) => {
      expect(cards[i]).toContain(`<h3>${trainer.name}</h3>`);
      expect(cards[i]).toContain(`src="${trainer.image}"`);
      expect(cards[i]).toContain(trainer.role);
    });
    expect(cards[2]).toContain('<h3>Thore</h3>');
  });

  it('shows the four reassurance cards', async () => {
    const html = await (await AstroContainer.create()).renderToString(page);
    expect((html.match(/<div class="why-item"[^>]*>/g) ?? []).length + (html.match(/<article class="why-item"[^>]*>/g) ?? []).length).toBe(4);
  });
});

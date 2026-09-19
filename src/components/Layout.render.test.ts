import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Layout from './Layout.astro';

const props = { lang: 'de', altHref: '/en/', title: 'Titel', description: 'Beschreibung' } as const;

describe('Layout robots meta', () => {
  it('adds no robots meta by default, so normal pages stay indexable', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, { props, slots: { default: '<p>Inhalt</p>' } });
    expect(html).toContain('<p>Inhalt</p>');
    expect(html).not.toMatch(/<meta name="robots"/);
  });

  it('adds `noindex` when asked', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      props: { ...props, noindex: true },
      slots: { default: '<p>Inhalt</p>' },
    });
    expect(html).toMatch(/<meta name="robots" content="noindex"/);
    expect((html.match(/<meta name="robots"/g) ?? []).length).toBe(1);
  });

  it('does not add it for an explicit `noindex={false}`', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      props: { ...props, noindex: false },
      slots: { default: '<p>Inhalt</p>' },
    });
    expect(html).not.toMatch(/<meta name="robots"/);
  });
});

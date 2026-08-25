import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('./privacy.astro', import.meta.url)), 'utf-8');

describe('Privacy', () => {
  it('names the data controller and contact', () => {
    expect(source).toContain('bumbleflies UG');
    expect(source).toContain('info@bumbleflies.de');
    expect(source).toContain('GDPR');
  });

  it('discloses pretix as a data processor', () => {
    expect(source).toContain('pretix');
    expect(source).toContain('data processor');
    expect(source).toContain('https://pretix.eu/about/en/privacy');
  });
});

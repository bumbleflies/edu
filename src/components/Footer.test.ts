import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('./Footer.astro', import.meta.url)), 'utf-8');

describe('Footer', () => {
  it('links to both DE and EN legal pages', () => {
    expect(source).toContain('/impressum');
    expect(source).toContain('/en/imprint');
    expect(source).toContain('/datenschutz');
    expect(source).toContain('/en/privacy');
  });

  it('contains the real contact email', () => {
    expect(source).toContain('mailto:info@bumbleflies.de');
  });

  it('contains the company name for the copyright line', () => {
    expect(source).toContain('bumbleflies UG');
  });
});

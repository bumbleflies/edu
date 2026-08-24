import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('./index.astro', import.meta.url)), 'utf-8');

describe('EN homepage', () => {
  it('renders in English', () => {
    expect(source).toMatch(/lang\s*=\s*"en"/);
    expect(source).toContain('content.en');
  });

  it('links to the DE homepage', () => {
    expect(source).toContain('altHref="/"');
  });
});

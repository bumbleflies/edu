import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('./index.astro', import.meta.url)), 'utf-8');

describe('DE homepage', () => {
  it('renders in German', () => {
    expect(source).toMatch(/lang\s*=\s*"de"/);
    expect(source).toContain('content.de');
  });

  it('links to the EN homepage', () => {
    expect(source).toContain('altHref="/en/"');
  });
});

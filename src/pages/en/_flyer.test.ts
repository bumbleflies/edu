import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('./flyer.astro', import.meta.url)), 'utf-8');

describe('EN flyer', () => {
  it('has a print button and the real contact email', () => {
    expect(source).toContain('window.print()');
    expect(source).toContain('info@bumbleflies.de');
  });

  it('renders English course content', () => {
    expect(source).toContain('content.en');
  });
});

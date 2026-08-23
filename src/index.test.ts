import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pagePath = fileURLToPath(new URL('./pages/index.astro', import.meta.url));

describe('homepage', () => {
  it('renders the edu.bumbleflies.de title', () => {
    const source = readFileSync(pagePath, 'utf-8');
    expect(source).toContain('edu.bumbleflies.de');
  });
});

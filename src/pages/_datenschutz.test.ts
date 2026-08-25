import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('./datenschutz.astro', import.meta.url)), 'utf-8');

describe('Datenschutz', () => {
  it('names the data controller and contact', () => {
    expect(source).toContain('bumbleflies UG');
    expect(source).toContain('info@bumbleflies.de');
    expect(source).toContain('DS-GVO');
  });
});

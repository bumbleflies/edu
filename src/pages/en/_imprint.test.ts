import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('./imprint.astro', import.meta.url)), 'utf-8');

describe('Imprint', () => {
  it('contains the required company disclosure details', () => {
    expect(source).toContain('bumbleflies UG');
    expect(source).toContain('Gleiwitzer Str. 6-d');
    expect(source).toContain('HRB 260473');
    expect(source).toContain('Christoph Kämpfe');
  });
});

import { describe, it, expect } from 'vitest';
import { content } from './content';

describe('homepage content', () => {
  it('carries the edu.bumbleflies.de identity string in both languages', () => {
    expect(content.en.title).toContain('edu.bumbleflies.de');
    expect(content.de.title).toContain('edu.bumbleflies.de');
  });

  it('has 2 courses, 3 steps and 2 trainers in both languages', () => {
    expect(content.en.courses).toHaveLength(2);
    expect(content.de.courses).toHaveLength(2);
    expect(content.en.steps).toHaveLength(3);
    expect(content.de.steps).toHaveLength(3);
    expect(content.en.trainers).toHaveLength(2);
    expect(content.de.trainers).toHaveLength(2);
  });

  it('has matching top-level keys for de and en', () => {
    expect(Object.keys(content.de).sort()).toEqual(Object.keys(content.en).sort());
  });
});

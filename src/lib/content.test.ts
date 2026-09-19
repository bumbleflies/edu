import { describe, it, expect } from 'vitest';
import { content } from './content';

describe('homepage content', () => {
  it('carries the bumble:futurespace identity string in both languages', () => {
    expect(content.en.title).toContain('bumble:futurespace');
    expect(content.de.title).toContain('bumble:futurespace');
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

  it('carries STEM/MINT statements in both languages', () => {
    expect(content.en.title).toContain('STEM');
    expect(content.de.title).toContain('MINT');
    expect(content.en.description).toContain('STEM');
    expect(content.de.description).toContain('MINT');
    expect(content.en.heroEyebrow).toContain('STEM');
    expect(content.de.heroEyebrow).toContain('MINT');
    expect(content.en.heroSubtitle).toContain('STEM');
    expect(content.de.heroSubtitle).toContain('MINT');
    expect(content.en.ctaSubtitle).toContain('STEM');
    expect(content.de.ctaSubtitle).toContain('MINT');
  });

  it('has a STEM/MINT why-item and STEM/MINT outcomes in both languages', () => {
    expect(content.en.whyList.some((w) => w.title.includes('STEM'))).toBe(true);
    expect(content.de.whyList.some((w) => w.title.includes('MINT'))).toBe(true);
    for (const course of content.en.courses) {
      expect(course.outcomes.some((o) => o.includes('STEM'))).toBe(true);
    }
    for (const course of content.de.courses) {
      expect(course.outcomes.some((o) => o.includes('MINT'))).toBe(true);
    }
  });
});

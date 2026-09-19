import { describe, it, expect } from 'vitest';
import { splitAge } from './flyer';
import { content } from './content';

describe('splitAge', () => {
  it('splits a German age label into a range and a unit', () => {
    expect(splitAge('8–10 Jahre')).toEqual({ range: '8–10', unit: 'Jahre' });
    expect(splitAge('11–14 Jahre')).toEqual({ range: '11–14', unit: 'Jahre' });
  });

  it('splits an English age label into a range and a unit', () => {
    expect(splitAge('8–10 years')).toEqual({ range: '8–10', unit: 'years' });
    expect(splitAge('11–14 years')).toEqual({ range: '11–14', unit: 'years' });
  });

  it('trims surrounding and repeated whitespace', () => {
    expect(splitAge('  8–10   Jahre ')).toEqual({ range: '8–10', unit: 'Jahre' });
  });

  it('keeps a multi-word unit together', () => {
    expect(splitAge('8–10 years old')).toEqual({ range: '8–10', unit: 'years old' });
  });

  it('returns an empty unit when the label is only a range', () => {
    expect(splitAge('8–10')).toEqual({ range: '8–10', unit: '' });
  });

  it('returns an empty range and unit for an empty label', () => {
    expect(splitAge('')).toEqual({ range: '', unit: '' });
  });

  it('splits every real course age in both languages with the same numerals', () => {
    for (const [i, course] of content.de.courses.entries()) {
      const de = splitAge(course.age);
      const en = splitAge(content.en.courses[i].age);
      expect(de.range).toMatch(/^\d+–\d+$/);
      expect(de.unit).toBe('Jahre');
      expect(en.unit).toBe('years');
      expect(en.range).toBe(de.range);
    }
  });
});

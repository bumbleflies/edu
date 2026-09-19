import { describe, it, expect } from 'vitest';
import { content } from './content';
import coursesData from '../data/courses.json';

const locales = { de: 'de-DE', en: 'en-US' } as const;

describe('flyer start fact', () => {
  it.each(['de', 'en'] as const)(
    '%s: names the month and year that every course in courses.json starts in',
    (lang) => {
      const format = new Intl.DateTimeFormat(locales[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' });
      expect(coursesData.courses.length).toBeGreaterThan(0);
      for (const course of coursesData.courses) {
        const label = format.format(new Date(`${course.startDate}T00:00:00Z`));
        expect(content[lang].flyer.startFact).toContain(label);
      }
    },
  );

  it.each(['de', 'en'] as const)('%s: prints a month only, never an exact day', (lang) => {
    expect(content[lang].flyer.startFact).not.toMatch(/\d{1,2}\.\s|\b\d{1,2}(st|nd|rd|th)\b|\b\d{4}-\d{2}-\d{2}\b/);
  });
});

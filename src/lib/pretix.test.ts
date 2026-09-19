import { describe, it, expect } from 'vitest';
import {
  pretix,
  pretixCourses,
  eventUrl,
  eventUrlByCourseName,
  priceByCourseName,
} from './pretix';
import { content } from './content';

describe('pretix config', () => {
  it('points at the bumbleedu organizer on pretix.eu', () => {
    expect(pretix.host).toBe('https://pretix.eu');
    expect(pretix.organizer).toBe('bumbleedu');
    expect(pretix.currency).toBe('EUR');
  });

  it('has one event per course offered in the app', () => {
    expect(pretixCourses).toHaveLength(2);
    expect(pretixCourses.map((c) => c.slug).sort()).toEqual([
      'code-the-machine',
      'robot-explorer',
    ]);
  });

  it('builds public event URLs', () => {
    expect(eventUrl('robot-explorer')).toBe('https://pretix.eu/bumbleedu/robot-explorer/');
    expect(eventUrl('code-the-machine')).toBe('https://pretix.eu/bumbleedu/code-the-machine/');
  });

  it('maps course names to their pretix event', () => {
    expect(eventUrlByCourseName('Robot Explorer')).toBe(
      'https://pretix.eu/bumbleedu/robot-explorer/',
    );
    expect(eventUrlByCourseName('Code the Machine')).toBe(
      'https://pretix.eu/bumbleedu/code-the-machine/',
    );
    expect(eventUrlByCourseName('Unknown course')).toBe('#');
  });
});

describe('homepage booking links', () => {
  it('gives every course a real pretix booking link in both languages', () => {
    for (const lang of ['de', 'en'] as const) {
      for (const course of content[lang].courses) {
        expect(course.href).toMatch(/^https:\/\/pretix\.eu\/bumbleedu\/[a-z-]+\/$/);
      }
    }
  });
});

describe('priceByCourseName', () => {
  it('looks prices up by localized course name', () => {
    expect(priceByCourseName('de', 'Roboter-Entdecker')).toBe(25);
    expect(priceByCourseName('de', 'Coding-Abenteurer')).toBe(40);
    expect(priceByCourseName('en', 'Robot Explorer')).toBe(25);
    expect(priceByCourseName('en', 'Code the Machine')).toBe(40);
  });

  it('matches by name, never by array position', () => {
    for (const lang of ['de', 'en'] as const) {
      for (const course of content[lang].courses) {
        const expected = pretixCourses.find((p) => p.name[lang] === course.name)?.price;
        expect(priceByCourseName(lang, course.name)).toBe(expected);
      }
    }
  });

  it('does not match a name from the other language', () => {
    expect(() => priceByCourseName('de', 'Robot Explorer')).toThrow(/Robot Explorer/);
  });

  it('fails loudly for an unknown course instead of printing a wrong price', () => {
    expect(() => priceByCourseName('en', 'Unknown course')).toThrow(/Unknown course/);
  });
});

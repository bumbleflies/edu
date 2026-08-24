import { describe, it, expect } from 'vitest';
import { ui } from './i18n';

describe('ui strings', () => {
  it('has matching keys for de and en', () => {
    expect(Object.keys(ui.de).sort()).toEqual(Object.keys(ui.en).sort());
  });

  it('has the expected nav and footer labels', () => {
    expect(ui.en.navCourses).toBe('Courses');
    expect(ui.de.navCourses).toBe('Kurse');
    expect(ui.en.footerLegalImprint).toBe('Imprint');
    expect(ui.de.footerLegalImprint).toBe('Impressum');
  });
});

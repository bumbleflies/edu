import { describe, it, expect } from 'vitest';
import { organizationJsonLd, courseJsonLd } from './jsonld';

describe('organizationJsonLd', () => {
  it('returns EducationalOrganization schema for both languages', () => {
    for (const lang of ['de', 'en'] as const) {
      const data = organizationJsonLd(lang);
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('EducationalOrganization');
      expect(data.name).toBe('bumble:futurespace');
      expect(data.url).toBe('https://edu.bumbleflies.de');
      expect(data.parentOrganization.name).toBe('bumbleflies');
      expect(data.address.addressLocality).toBe('Munich');
      expect(data.contactPoint.email).toBe('info@bumbleflies.de');
    }
  });

  it('provides localized descriptions', () => {
    expect(organizationJsonLd('de').description).toContain('Programmier');
    expect(organizationJsonLd('en').description).toContain('programming');
  });
});

describe('courseJsonLd', () => {
  it('returns Course schema for Robot Explorer (index 0)', () => {
    for (const lang of ['de', 'en'] as const) {
      const data = courseJsonLd(lang, 0)!;
      expect(data).not.toBeNull();
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('Course');
      expect(data.educationalLevel).toBe('Beginner');
      expect(data.offers['@type']).toBe('Offer');
      expect(data.offers.price).toBe(25);
      expect(data.offers.priceCurrency).toBe('EUR');
      expect(data.offers.url).toContain('robot-explorer');
    }
  });

  it('returns Course schema for Code the Machine (index 1)', () => {
    for (const lang of ['de', 'en'] as const) {
      const data = courseJsonLd(lang, 1)!;
      expect(data).not.toBeNull();
      expect(data.educationalLevel).toBe('Intermediate');
      expect(data.offers.price).toBe(40);
      expect(data.offers.url).toContain('code-the-machine');
    }
  });

  it('returns null for out-of-range index', () => {
    expect(courseJsonLd('en', 99)).toBeNull();
    expect(courseJsonLd('en', -1)).toBeNull();
  });

  it('localizes course names', () => {
    expect(courseJsonLd('de', 0)!.name).toBe('Roboter-Entdecker');
    expect(courseJsonLd('en', 0)!.name).toBe('Robot Explorer');
    expect(courseJsonLd('de', 1)!.name).toBe('Coding-Abenteurer');
    expect(courseJsonLd('en', 1)!.name).toBe('Code the Machine');
  });

  it('localizes teaching outcomes', () => {
    const deOutcomes = courseJsonLd('de', 0)!.teaches;
    const enOutcomes = courseJsonLd('en', 0)!.teaches;
    expect(deOutcomes).toHaveLength(3);
    expect(enOutcomes).toHaveLength(3);
    expect(deOutcomes).not.toEqual(enOutcomes);
  });

  it('includes Munich location in course instances', () => {
    const data = courseJsonLd('en', 0)!;
    expect(data.hasCourseInstance.location.address.addressLocality).toBe('Munich');
    expect(data.hasCourseInstance.location.address.addressCountry).toBe('DE');
  });

  it('validates as parseable JSON', () => {
    for (const lang of ['de', 'en'] as const) {
      for (const idx of [0, 1]) {
        const json = JSON.stringify(courseJsonLd(lang, idx));
        const parsed = JSON.parse(json);
        expect(parsed['@type']).toBe('Course');
      }
    }
  });
});

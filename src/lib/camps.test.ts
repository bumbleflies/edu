import { describe, it, expect } from 'vitest';
import coursesData from '../data/courses.json';

/**
 * The camp is sold through pretix, not rendered by the site, so nothing else in
 * the test suite would notice if its dates, price or age range drifted. These
 * assertions pin the published facts and the two BuT-relevant rules: the fee has
 * to fit inside the annual Bildung-und-Teilhabe budget, and the copy must not
 * promise that attendance is free.
 */

type Question = {
  identifier: string;
  en: string;
  de: string;
  type: string;
  required: boolean;
  valid_number_min?: number;
  valid_number_max?: number;
  help?: { en: string; de: string };
};

const camps = (coursesData.camps ?? []) as Array<{
  slug: string;
  name: { en: string; de: string };
  startDate: string;
  endDate: string;
  dailyFrom: string;
  dailyTo: string;
  price: number;
  capacity: number;
  weeks?: number;
  description: { en: string; de: string };
  questions?: Question[];
}>;

const camp = camps[0];

/** NRW Christmas holidays 2026/27 — the camp has to sit inside this window. */
const HOLIDAY_FROM = '2026-12-23';
const HOLIDAY_TO = '2027-01-06';

/** § 28 Abs. 7 SGB II: €15/month, capped at €180 per twelve-month period. */
const BUT_ANNUAL_BUDGET = 180;

describe('the between-the-years camp', () => {
  it('is defined exactly once', () => {
    expect(camps).toHaveLength(1);
    expect(camp.slug).toBe('zwischen-den-jahren');
  });

  it('is named in both languages', () => {
    expect(camp.name.de).toContain('Robotik-Camp');
    expect(camp.name.en.length).toBeGreaterThan(0);
    expect(camp.name.de).not.toBe(camp.name.en);
  });

  it('runs Mon 28 – Wed 30 December 2026, inside the NRW Christmas holidays', () => {
    expect(camp.startDate).toBe('2026-12-28');
    expect(camp.endDate).toBe('2026-12-30');
    expect(camp.startDate >= HOLIDAY_FROM).toBe(true);
    expect(camp.endDate <= HOLIDAY_TO).toBe(true);

    const days = ['2026-12-28', '2026-12-29', '2026-12-30'].map((d) =>
      new Date(`${d}T00:00:00Z`).getUTCDay(),
    );
    expect(days).toEqual([1, 2, 3]); // Monday, Tuesday, Wednesday
  });

  it('uses an explicit end date rather than a week count', () => {
    expect(camp.weeks).toBeUndefined();
    expect(camp.endDate > camp.startDate).toBe(true);
  });

  it('runs 10:00–14:00 and takes 12 children', () => {
    expect(camp.dailyFrom).toBe('10:00');
    expect(camp.dailyTo).toBe('14:00');
    expect(camp.capacity).toBe(12);
  });

  it('costs €99 — inside a single child’s annual BuT budget', () => {
    expect(camp.price).toBe(99);
    expect(camp.price).toBeLessThanOrEqual(BUT_ANNUAL_BUDGET);
  });

  it('describes the camp in both languages', () => {
    expect(camp.description.de).toContain('99');
    expect(camp.description.en.length).toBeGreaterThan(0);
  });

  it('never advertises the camp as free for BuT families', () => {
    for (const text of [camp.description.de, camp.name.de, camp.name.en]) {
      expect(text.toLowerCase()).not.toContain('kostenlos');
      expect(text.toLowerCase()).not.toContain('free');
    }
  });
});

describe('the camp booking form', () => {
  it('narrows the age range to 8–12', () => {
    const age = (camp.questions ?? []).find((q) => q.identifier === 'child_age');
    expect(age).toBeDefined();
    expect(age?.valid_number_min).toBe(8);
    expect(age?.valid_number_max).toBe(12);
  });

  it('asks about Bildung und Teilhabe without requiring an answer', () => {
    const but = (camp.questions ?? []).find((q) => q.identifier === 'but_claim');
    expect(but).toBeDefined();
    expect(but?.type).toBe('B'); // pretix: boolean
    expect(but?.required).toBe(false);
    expect(but?.help?.de).toMatch(/vor Campbeginn/);
  });
});

describe('the shared questions', () => {
  it('still cover contact details for every offer', () => {
    const identifiers = (coursesData.questions as Question[]).map((q) => q.identifier);
    expect(identifiers).toContain('child_first_name');
    expect(identifiers).toContain('parent_email');
  });

  it('lets the camp override child_age instead of duplicating it', () => {
    const overrides = (camp.questions ?? []).map((q) => q.identifier);
    expect(new Set(overrides).size).toBe(overrides.length);
  });
});

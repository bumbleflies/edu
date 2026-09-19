import type { Lang } from "./i18n";
import coursesData from "../data/courses.json";

export interface PretixCourse {
  slug: string;
  name: Record<Lang, string>;
  price: number;
  startDate: string;
  weeks: number;
}

export interface PretixConfig {
  host: string;
  organizer: string;
  currency: string;
  timezone: string;
  locales: string[];
}

export const pretix: PretixConfig = {
  host: coursesData.pretix.host,
  organizer: coursesData.pretix.organizer,
  currency: coursesData.pretix.currency,
  timezone: coursesData.pretix.timezone,
  locales: coursesData.pretix.locales,
};

export const pretixCourses: PretixCourse[] = coursesData.courses as PretixCourse[];

export function eventUrl(slug: string): string {
  return `${pretix.host}/${pretix.organizer}/${slug}/`;
}

export function eventUrlByCourseName(name: string): string {
  const course = pretixCourses.find((c) => c.name.en === name || c.name.de === name);
  return course ? eventUrl(course.slug) : "#";
}

/**
 * Price of the course whose localized name is `name`, in the pretix currency.
 *
 * Matches by name, never by array position, so reordering either list cannot
 * put the wrong price on a course. Throws for unknown names: printed material
 * must never go out with a missing or wrong price.
 */
export function priceByCourseName(lang: Lang, name: string): number {
  const course = pretixCourses.find((c) => c.name[lang] === name);
  if (!course) throw new Error(`No pretix course named "${name}" (${lang})`);
  return course.price;
}

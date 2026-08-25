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
/** An age label split for display: a big numeral range plus a small unit beneath it. */
export interface AgeParts {
  range: string;
  unit: string;
}

/**
 * Splits a course age label such as "8–10 Jahre" or "11–14 years" into its
 * range ("8–10") and unit ("Jahre"), so the flyer can set the range as a big
 * numeral. Everything after the first whitespace run is the unit; a label
 * without a unit yields an empty unit.
 */
export function splitAge(age: string): AgeParts {
  const [range = "", ...unit] = age.trim().split(/\s+/);
  return { range, unit: unit.join(" ") };
}

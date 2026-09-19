/**
 * Pages that exist for the owner only: served with `noindex` (set on the page's
 * `<Layout noindex>`) and kept out of the sitemap. Not linked from the site and
 * not listed in llms.txt / agents.txt either.
 */
export const unlistedPaths = ['/flyer-trifold', '/en/flyer-trifold'];

/** Sitemap filter: `page` is the absolute page URL that @astrojs/sitemap passes in. */
export function isListed(page: string): boolean {
  const { pathname } = new URL(page);
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return !unlistedPaths.includes(path);
}

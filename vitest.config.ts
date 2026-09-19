/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig lets tests import and render .astro components (Astro Container API).
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { isListed } from './src/lib/indexing.ts';

export default defineConfig({
  output: 'static',
  outDir: 'dist',
  site: 'https://edu.bumbleflies.de',
  integrations: [sitemap({ filter: isListed })],
});

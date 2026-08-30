import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  outDir: 'dist',
  site: 'https://edu.bumbleflies.de',
  integrations: [sitemap()],
});

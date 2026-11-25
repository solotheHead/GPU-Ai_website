// @ts-check
import { defineConfig } from 'astro/config';

// Static output — deploy dist/ behind any static host / Caddy.
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});

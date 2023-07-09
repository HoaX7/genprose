import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap({
    priority: .8,
    changefreq: "weekly",
    lastmod: new Date('2023-02-01')
  })],
  site: "https://genprose.com",
  trailingSlash: "ignore",
  // required for cloudflare to remove trailing slash ('/')
  build: {
    format: "file"
  }
});
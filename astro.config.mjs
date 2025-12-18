import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://NGwyndolin.github.io',
  base: '/manga-store',
  
  integrations: [
    preact({
      compat: true
    }),
    tailwind({
      applyBaseStyles: true,
    })
  ],
  
  vite: {
    ssr: {
      noExternal: ['leaflet', 'react-leaflet']
    }
  }
});

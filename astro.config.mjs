import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://tu-proyecto.vercel.app', // URL de Vercel
  // NO incluir 'base' para Vercel
  
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

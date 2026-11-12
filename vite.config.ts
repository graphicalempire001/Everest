import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import site from './src/data/site.json';

export default defineConfig({
  base: '/', // must stay absolute, or refreshing /about shows a blank page
  plugins: [
    react(),
    tailwindcss(),
    { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', site.siteUrl) },
  ],
});

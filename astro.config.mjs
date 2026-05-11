// @ts-check
import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 3000
    }
  },
  adapter: node({
    mode: 'standalone'
  })
});
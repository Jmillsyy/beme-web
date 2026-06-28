import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Astro 4 + Tailwind v4 via Vite plugin — same wiring the main app
// uses, so any class you write here behaves the same way as in the
// app. No PostCSS config needed; the plugin handles it.
export default defineConfig({
  site: 'https://bemeapp.app',
  vite: {
    plugins: [tailwindcss()],
  },
})

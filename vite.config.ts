import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

/**
 * On GitHub Pages the site lives at https://<user>.github.io/<repo>/, so the base path must be the
 * repo name. GITHUB_REPOSITORY ("user/repo") is set automatically in GitHub Actions.
 * Set VITE_BASE explicitly (e.g. "/") to override, for example when using a custom domain.
 */
function basePath(): string {
  if (process.env.VITE_BASE) return process.env.VITE_BASE
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  return repo ? `/${repo}/` : '/'
}

// https://vite.dev/config/
export default defineConfig({
  base: basePath(),
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

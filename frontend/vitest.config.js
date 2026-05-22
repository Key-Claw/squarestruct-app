/**
 * Configuración de Vitest para el proyecto frontend
 * 
 * - environment: 'jsdom' → simula un navegador (necesario para React)
 * - setupFiles: ejecuta setupTests.js antes de cada test (matchers de jest-dom)
 * - globals: true → permite usar test(), expect() sin importarlos
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      i18next: fileURLToPath(new URL('./src/shims/i18next.js', import.meta.url)),
      'i18next-browser-languagedetector': fileURLToPath(new URL('./src/shims/i18next-browser-languagedetector.js', import.meta.url)),
      'react-i18next': fileURLToPath(new URL('./src/shims/react-i18next.test.js', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.js',
    globals: true,
    include: ['src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['src/shims/**'],
  },
})

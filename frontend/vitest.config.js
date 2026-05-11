/**
 * Configuración de Vitest para el proyecto frontend
 * 
 * - environment: 'jsdom' → simula un navegador (necesario para React)
 * - setupFiles: ejecuta setupTests.js antes de cada test (matchers de jest-dom)
 * - globals: true → permite usar test(), expect() sin importarlos
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.js',
    globals: true,
  },
})

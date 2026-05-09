import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  // Exclude Electron-only native packages from the browser build
  optimizeDeps: {
    exclude: [
      'electron',
      'electron-store',
      'active-win',
      'discord-rpc',
      'systeminformation',
    ],
  },
  build: {
    rollupOptions: {
      external: [
        'electron',
        'electron-store',
        'active-win',
        'discord-rpc',
        'systeminformation',
      ],
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Framer Motion + its split packages — large, change rarely
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'vendor-motion';
          }
          // React core — almost never changes
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }
          // React Router + its transitive dep @remix-run/router
          if (id.includes('react-router') || id.includes('@remix-run')) {
            return 'vendor-router';
          }
          // Dexie IndexedDB layer
          if (id.includes('dexie')) {
            return 'vendor-dexie';
          }
        },
      },
    },
  },
})

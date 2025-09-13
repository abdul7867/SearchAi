import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'markdown': ['react-markdown', 'react-syntax-highlighter', 'remark-gfm'],
          'http': ['axios'],
          'state': ['zustand']
        }
      }
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'zustand',
      'lucide-react',
      'react-markdown',
      'remark-gfm'
    ]
  }
})
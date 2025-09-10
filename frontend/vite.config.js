/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];
  
  // Add bundle analyzer in analyze mode
  if (mode === 'analyze') {
    plugins.push(
      // Bundle analyzer plugin
      (await import('rollup-plugin-visualizer')).default({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return {
    plugins,
    build: {
      // Performance optimizations
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false, // Disable sourcemaps in production for better performance
      rollupOptions: {
        output: {
          // Code splitting for better caching
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['lucide-react', 'clsx', 'tailwind-merge'],
            state: ['zustand'],
            http: ['axios']
          },
          // Optimize chunk naming for better caching
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      // Optimize chunk size warnings
      chunkSizeWarningLimit: 1000,
      // Enable CSS code splitting
      cssCodeSplit: true
    },
    // Development optimizations
    server: {
      hmr: {
        overlay: false // Disable error overlay for better performance
      }
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'zustand', 'axios']
    }
  };
});
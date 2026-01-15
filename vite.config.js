import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'esbuild',
    emptyOutDir: true,
    //chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        entryFileNames: 'game.js',
        chunkFileNames: 'game.js',
        assetFileNames: 'assets/[name][extname]?v=[hash]',
        format: 'iife',
        name: 'PlayableGame',
        compact: true,
        generatedCode: { constBindings: true }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  optimizeDeps: {
    include: ['pixi.js']
  }
});
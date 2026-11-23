import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // Base './' sangat penting untuk menjamin seluruh aset JS/CSS
  // menggunakan jalur relatif (relative paths) sehingga tidak terjadi
  // kesalahan 404 saat di-deploy ke subdirektori (misal: GitHub Pages)
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});

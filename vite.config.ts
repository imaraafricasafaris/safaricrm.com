import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          if (/\.(jpe?g|png|gif|svg|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name].[hash][ext]';
          }
          return 'assets/[name].[hash][ext]';
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
      },
    },
    assetsInlineLimit: 4096,
    sourcemap: false,
    minify: 'terser',
  },
});

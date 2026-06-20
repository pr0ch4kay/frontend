import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        // Это заставит Vite переименовывать CSS файл при каждой сборке, ломая кеш Vercel
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return `assets/style-[hash].css`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

console.log("Mode Vite :", import.meta.NODE_ENV);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Pour React Router
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: import.meta.NODE_ENV === 'development' ? {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    } : undefined, // Pas de proxy en production
  },
});

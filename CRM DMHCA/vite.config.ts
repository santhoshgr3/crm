import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    allowedHosts: ['devserver-preview--crmdm.netlify.app'],
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El cliente consume la API directamente mediante VITE_API_BASE_URL.
// Se define un proxy opcional para evitar CORS durante el desarrollo.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});

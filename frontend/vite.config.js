import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Ubah port ini jika backend Anda berjalan di port lain (misal: 5000)
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
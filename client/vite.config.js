import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7045,
    proxy: {
      '/api': {
        target: 'http://localhost:5014',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

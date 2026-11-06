import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/customer': {
        target: 'https://mattu-clientes.solismauricioezequiel.workers.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

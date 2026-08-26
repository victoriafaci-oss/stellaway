import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    server: {
      // En desarrollo local con `vite` puro, redirige /api/* a Netlify Functions via netlify dev.
      // Si usas `npm run netlify:dev`, Netlify CLI gestiona el proxy automáticamente.
      // HMR desactivado cuando DISABLE_HMR está activo (AI Studio).
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        // Proxy de desarrollo: /api/* → /.netlify/functions/* (puerto 8888 de netlify dev)
        '/api': {
          target: 'http://localhost:8888',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/(.+)$/, '/.netlify/functions/$1'),
        },
      },
    },
  };
});

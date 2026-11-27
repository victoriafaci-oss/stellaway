import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function stellaWayAutoUpdateBuildStamp(buildId: string): Plugin {
  return {
    name: 'stellaway-pwa-build-stamp',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const swPath = path.join(distDir, 'sw.js');
      if (fs.existsSync(swPath)) {
        const originalSw = fs.readFileSync(swPath, 'utf-8');
        const stampedSw = originalSw.replace(
          /const CACHE_NAME = ['"][^'"]+['"];/,
          `const CACHE_NAME = 'stellaway-${buildId}';`
        );
        fs.writeFileSync(swPath, stampedSw, 'utf-8');
      }

      const versionPath = path.join(distDir, 'version.json');
      fs.writeFileSync(
        versionPath,
        JSON.stringify({ buildId, builtAt: new Date().toISOString() }, null, 2),
        'utf-8'
      );
    },
  };
}

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const buildId = isBuild
    ? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    : 'dev';

  return {
    define: {
      __APP_BUILD_ID__: JSON.stringify(buildId),
    },
    plugins: [react(), tailwindcss(), stellaWayAutoUpdateBuildStamp(buildId)],
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
      // HMR desactivado cuando DISABLE_HMR está activo (AI Studio).
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

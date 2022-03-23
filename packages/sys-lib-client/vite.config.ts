import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  server: {
    proxy: {
      // 选项写法
      '/api': {
        target: 'http://localhost:12000',
        changeOrigin: true,
      },
    }
  }
});

import { defineConfig } from "vite";
export default defineConfig((env) => ({
  root: '.',
  base: '/parallel',
  publicDir: './public',
  build: {
    outDir: './dist',
    emptyOutDir: true
  },
  define: {
    __DEV__: env.mode === 'development'
  },
  server: {
    open: true,
    port: 3000,
    host: '0.0.0.0',
    https: false,
    proxy: {
      '/api': {
        target: 'https://www.anxyser.top/server10003',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, ''),
      }
    }
  }
}))
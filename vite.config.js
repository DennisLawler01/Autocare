import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'bootstrap': 'node_modules/bootstrap'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "bootstrap/scss/bootstrap" as *;`
      }
    }
  }
});

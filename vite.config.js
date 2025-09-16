import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // Измените с '/' на './' для относительных путей
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@components': path.resolve(__dirname, './src/core/components'),
    },
  },
  // server: {
  //   hmr: {
  //     overlay: false
  //   }
  // },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Убеждаемся, что JS файлы имеют правильное расширение
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
  },
}) 
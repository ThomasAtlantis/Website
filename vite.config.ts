import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 自定义插件：在构建后生成 _redirects 文件
    {
      name: 'generate-redirects',
      writeBundle() {
        const redirectsContent = '/*    /index.html   200'
        fs.writeFileSync('dist/_redirects', redirectsContent)
      }
    }
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './public/data')
    }
  }
})
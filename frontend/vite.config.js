// vite.config.js

import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url' // <-- 1. Impor ini

// 2. Buat ulang __dirname secara manual untuk ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // 3. Baris ini sekarang akan berfungsi tanpa error
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
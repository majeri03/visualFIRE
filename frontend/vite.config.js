// frontend/vite.config.js - VERSI FINAL DENGAN MIDDLEWARE

import path from "path";
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugin kustom untuk mensimulasikan Vercel Functions secara lokal
const vercelApiSimulationPlugin = {
  name: 'handle-vercel-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // Hanya proses request yang menuju ke /api/
      if (req.url.startsWith('/api/')) {
        try {
          // Bangun path ke file fungsi berdasarkan URL
          const functionPath = path.resolve(__dirname, `.${req.url}.js`);
          
          // Impor fungsi handler dari file
          const { default: handler } = await import(`${functionPath}?t=${Date.now()}`);
          
          // Parsing body untuk request POST
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              req.body = JSON.parse(body || '{}');
              handler(req, res);
            });
          } else {
             handler(req, res);
          }

        } catch (error) {
          console.error(`Error saat menjalankan fungsi untuk ${req.url}`, error);
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      } else {
        // Jika bukan request /api, lanjutkan ke handler berikutnya
        next();
      }
    });
  },
};

// Konfigurasi utama Vite
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      vercelApiSimulationPlugin, // <-- Daftarkan plugin kustom kita
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Hapus blok server.proxy dari sini
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    }
  };
});
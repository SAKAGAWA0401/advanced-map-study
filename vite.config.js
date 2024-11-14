// vite.config.js
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  define: {
    'process.env.MAPTILER_API_KEY': JSON.stringify(process.env.MAPTILER_API_KEY),
  },
});

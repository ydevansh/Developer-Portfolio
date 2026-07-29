import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  appType: 'spa',
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-icons/fa',
      'react-icons/hi2',
      'react-icons/si',
      'framer-motion',
      'axios',
      'three',
      '@react-three/fiber',
      '@react-three/postprocessing',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:5000',
      '/analyze': 'http://localhost:5000',
      '/analyses': 'http://localhost:5000',
    }
  }
})

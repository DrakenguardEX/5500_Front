import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Frontend runs on port 5173
    proxy: {
      '/api': 'http://127.0.0.1:5000'  // Proxy API requests to Flask backend
    }
  }
});

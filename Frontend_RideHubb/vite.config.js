import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.jpg', '**/*.png'], // Specify file types to include
  resolve: {
    alias: {
      'react-toastify': 'react-toastify'
    }
  }
})
// vite.config.js

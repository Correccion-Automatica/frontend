import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Determine API target for dev proxy: prefer env, fallback to localhost
// Use VITE_API_TARGET like "http://localhost:3002" or "http://192.168.1.10:3002"
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaultTarget = 'http://localhost:3002'
  const target = env.VITE_API_TARGET || defaultTarget

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})

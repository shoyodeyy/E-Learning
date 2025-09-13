import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import os from 'os'


function getLocalIPv4() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    const addrs = nets[name] || []
    for (const addr of addrs) {
      const familyV4 = typeof addr.family === 'string' ? addr.family === 'IPv4' : addr.family === 4
      if (familyV4 && !addr.internal) {
        return addr.address
      }
    }
  }
  return 'localhost'
}

const DEV_NETWORK_HOST = getLocalIPv4()

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_DEV_NETWORK_HOST': JSON.stringify(DEV_NETWORK_HOST),
  },
})

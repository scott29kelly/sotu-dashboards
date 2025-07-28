import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // keep this if your project uses swc

export default defineConfig({
  plugins: [react()],
  base: '/sotu-dashboards/',   // <-- replace with the exact repo name you will deploy to
});

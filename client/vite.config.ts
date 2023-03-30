import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  // eslint is not included _by default_
  plugins: [react(), eslint()],
  // uncomment the following line if you need to test cors calls
  // server: { port: 5173, host: '0.0.0.0' },
});

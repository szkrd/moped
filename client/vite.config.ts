import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  // wtf, how come eslint is not included _by default_??
  plugins: [react(), eslint()],
});

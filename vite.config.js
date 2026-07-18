import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the historical CRA output directory name so .gitignore
    // and any existing deploy tooling that expects /build keep working.
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
});
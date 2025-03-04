import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config
export default defineConfig({
  base: './', // Ensure paths are relative for Electron's file:// protocol
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
});

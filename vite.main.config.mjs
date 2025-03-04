import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: ".vite/build", // Carpeta de salida para los archivos construidos
    emptyOutDir: true, // Limpia la carpeta de salida antes de cada construcción
    rollupOptions: {
      input: "src/main.js", // Punto de entrada principal de tu aplicación
      output: {
        format: "cjs", // Formato CommonJS para compatibilidad con Electron
      },
    },
  },
});
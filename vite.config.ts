import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
  },
  base: "./", // Relative paths for GitHub Pages compatibility
  server: {
    host: '0.0.0.0', // Erlaubt Zugriff über das lokale Netzwerk
    port: 5173,
  }
});



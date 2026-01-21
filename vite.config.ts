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
    host: '127.0.0.1',
    port: 5173,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  }
});



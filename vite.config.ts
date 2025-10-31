import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Replit-specific plugins removed

export default defineConfig({
  plugins: [
    react(),
    // Replit runtime error overlay and banners removed
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

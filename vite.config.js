import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Target the backend HTTPS port directly. Targeting the HTTP port
      // makes Kestrel answer 307 -> https, and browsers drop the
      // Authorization header when following that cross-origin redirect,
      // so every /api call ended up 401 Unauthorized.
      "/api": {
        target: "https://localhost:7187",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "https://localhost:7187",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

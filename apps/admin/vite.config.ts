import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // В dev-режиме проксируем API-запросы на бэкенд
      "/api": "http://localhost:8000",
    },
  },
});

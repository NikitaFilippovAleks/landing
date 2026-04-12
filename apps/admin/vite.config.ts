import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Проксируем API-запросы на бэкенд-контейнер
      "/api": "http://api:8000",
    },
  },
});

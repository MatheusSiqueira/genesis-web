import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7157", // API .NET em HTTPS
        changeOrigin: true,
        secure: false,                    // aceita certificado self-signed
      },
      // opcional: ver o Swagger via 5173
      "/api/swagger": {
        target: "https://localhost:7157",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api\/swagger/, "/swagger"),
      },
    },
  },
});

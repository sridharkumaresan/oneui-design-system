import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createMockSearchApiPlugin } from "./src/infrastructure/mock-api/server/mockSearchApi";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 900
  },
  plugins: [react(), createMockSearchApiPlugin()],
  server: {
    open: false,
    port: 4174
  }
});

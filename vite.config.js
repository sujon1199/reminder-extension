import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        reminder: resolve(__dirname, "reminder.html")
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "service-worker") {
            return "service-worker.js";
          }
          return "assets/[name].js";
        }
      }
    }
  }
});

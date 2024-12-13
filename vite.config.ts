import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias '@' to the 'src' directory
    },
  },
  esbuild: {
    loader: "tsx", // Ensures .tsx is transpiled
    include: /\.tsx?$/, // Includes only TS/TSX files
    exclude: [], // Avoid excluding any TS files
  },
});

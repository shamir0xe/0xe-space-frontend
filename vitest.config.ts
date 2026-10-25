import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  // Same JSX runtime as the app (tsconfig "jsx": "react-jsx").
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

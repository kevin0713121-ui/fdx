import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { rm } from "node:fs/promises";

function excludeQaArtifacts() {
  return {
    name: "exclude-qa-artifacts",
    apply: "build",
    async closeBundle() {
      await rm(new URL("./dist/client/qa", import.meta.url), { recursive: true, force: true });
    },
  };
}

export default defineConfig({
  base: process.env.GITLAB_CI ? "./" : "/",
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), excludeQaArtifacts()],
});

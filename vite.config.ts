import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  define: {
    global: "globalThis",
  },
  server: {
    cors: {
      origin: /^chrome-extension:\/\/.*/,
      credentials: true,
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    nodePolyfills({
      protocolImports: true,
    }),
    crx({ manifest }),
  ],
});

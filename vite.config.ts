import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (
            /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(
              id,
            )
          ) {
            return "react-vendor";
          }
          if (
            id.includes("node_modules/rc-") ||
            id.includes("node_modules\\rc-") ||
            id.includes("node_modules/@rc-component") ||
            id.includes("node_modules\\@rc-component") ||
            id.includes("node_modules/antd") ||
            id.includes("node_modules\\antd") ||
            id.includes("node_modules/@ant-design") ||
            id.includes("node_modules\\@ant-design")
          ) {
            return "ui-vendor";
          }
          if (
            id.includes("node_modules/zustand") ||
            id.includes("node_modules\\zustand") ||
            id.includes("node_modules/dayjs") ||
            id.includes("node_modules\\dayjs")
          ) {
            return "app-vendor";
          }
          return "vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

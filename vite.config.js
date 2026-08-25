import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  build: {
    // Split heavy third-party libraries into their own long-cached chunks
    // so the app code can be updated without re-downloading vendor code,
    // and so no single chunk exceeds the 500 kB warning threshold.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase") || id.includes("@firebase")) {
              return "firebase";
            }
            if (id.includes("recharts") || id.includes("d3-")) {
              return "recharts";
            }
            if (id.includes("react-datepicker")) {
              return "datepicker";
            }
            if (
              id.includes("react-router") ||
              id.includes("react-dom") ||
              id.includes("react")
            ) {
              return "react-vendor";
            }
            return "vendor";
          }
        },
      },
    },
  },
});

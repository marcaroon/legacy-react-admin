import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    allowedHosts: [
      "fromlegacy.tqpartner.com",
      "admin.fromlegacy.tqpartner.com",
      "b1f3c23ae4d4.ngrok-free.app",
      "bc9273a135ab.ngrok-free.app",
    ],
  },
});

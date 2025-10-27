import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), "");

  // Choose backend based on mode
  const backendUrl =
    mode === "development"
      ? "http://localhost:3010"
      : "https://real-estate-backend-31n7.onrender.com";

  return {
    server: {
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      __APP_BACKEND_URL__: JSON.stringify(backendUrl),
    },
    plugins: [react()],
  };
});

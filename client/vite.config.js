import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://vercel.com/vihar2712s-projects/real-estate-backend/DbSBxcpp41bNLG5khivn6rdfYvGc",
        secure: false,
      },
    },
  },
  plugins: [react()],
});

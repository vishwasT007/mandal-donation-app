import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          "react-vendor": ["react", "react-dom"],
          "framer-motion": ["framer-motion"],
          firebase: [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
            "firebase/storage",
          ],
          "ui-libs": ["lucide-react"],
          utils: ["xlsx", "jspdf", "html2canvas", "uuid"],
        },
        // Better chunk naming
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (disable in production)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
    exclude: [
      "@firebase/app",
      "@firebase/auth",
      "@firebase/firestore",
      "@firebase/storage",
    ],
  },
  // Server optimizations for development
  server: {
    hmr: {
      overlay: false,
    },
  },
});

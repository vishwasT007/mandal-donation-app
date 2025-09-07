import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), tailwindcss()],
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_ENVIRONMENT || 'development'),
    },
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
  };
});
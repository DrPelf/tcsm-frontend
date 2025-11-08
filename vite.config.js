import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": "/src",
      "@global": "/src/global", // Adjust according to your directory structure
      "@components": "/src/components",
      "@contexts": "/src/contexts",
      "@utils": "/src/utils",
      "@pages": "/src/pages",
      "@assets": "/src/assets",
      "@layout": "/src/layout",
      "@modules": "/src/modules",
      "@lib": "/src/lib",
      "@redux": "/src/redux",
      "@hooks": "/src/hooks",
    },
  },

  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});

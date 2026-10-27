import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tanstackStart({ server: { entry: "server" } }),
      nitro({
        vercel: {
          functions: {
            maxDuration: 60,
          },
        },
      }),
      viteReact(),
      tailwindcss(),
    ],
    optimizeDeps: { include: ["pdfjs-dist", "pdf-lib"] },
  };
});


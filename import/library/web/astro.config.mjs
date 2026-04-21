// @ts-check
import { defineConfig } from "astro/config";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  site: "https://lucassantana-dev.github.io",
  base: isProd ? "/ai-dev-toolkit-library" : "/",
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
});

// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  build: {
    // Emit about.html (not about/index.html) so links match the portfolio.
    format: "file",
  },
});

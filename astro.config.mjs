import { defineConfig } from "astro/config";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  site: "https://fze-fze.github.io",
  base: isProduction ? "/NewBlog" : "/",
  output: "static"
});

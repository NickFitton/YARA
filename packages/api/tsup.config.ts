import { defineConfig } from "tsup";

const entry = ["src/auth/index.ts", "src/user/index.ts", "src/recipe/index.ts"];

export default defineConfig({
  entry,
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true
});

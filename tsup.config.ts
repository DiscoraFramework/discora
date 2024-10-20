/** @format */

// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib"], // Your entry point(s)
  format: ["cjs", "esm"], // Output formats
  target: "esnext", // Target environment
  sourcemap: false, // Disable source maps if you don't need them
  dts: true, // Generate declaration files
  outDir: "dist", // Output directory
  clean: true, // Clean output directory before each build
  external: ["node_modules"], // Specify any external dependencies to exclude
  splitting: false,
});

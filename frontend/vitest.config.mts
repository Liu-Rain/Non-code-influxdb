import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environmentMatchGlobs: [
      ["**/*.test.ts", "jsdom"],
      ["**/*.test.tsx", "jsdom"],
      ["**/*.component.test.ts", "jsdom"],
    ],
    setupFiles: ["./tests/setup/setup-test-env.ts"],
    exclude: ["**/tests/**", "**/node_modules/**"],
    coverage: {
      include: ["app/**/*", "features/**/*"],
      exclude: [
        "test/**",
        "vite.*.ts",
        "**/*.d.ts",
        "**/*.test.*",
        "**/*.config.*",
        "**/snapshot-tests/**",
        "**/coverage/**",
        "app/**/{layout,*provider}.tsx",
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
      all: true,
    },
  },
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "lessons/**/check.test.ts"],
    passWithNoTests: true,
  },
});

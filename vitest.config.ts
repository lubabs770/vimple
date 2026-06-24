import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // tests/ = runner unit tests; tasks/ = the hidden per-task graders.
    include: ["tests/**/*.test.ts", "tasks/**/check.test.ts"],
    passWithNoTests: false,
  },
});

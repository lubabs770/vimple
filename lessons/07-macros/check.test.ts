import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("every exported todo function has a /** todo op */ doc line", () => {
  const src = readFileSync(join(process.cwd(), "src/todo.ts"), "utf8");
  const count = (src.match(/\/\*\* todo op \*\//g) || []).length;
  expect(count).toBe(4);
});

import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("listOpen parameter is named tasks (typo fixed)", () => {
  const src = readFileSync(join(process.cwd(), "src/todo.ts"), "utf8");
  expect(src).toMatch(/export function listOpen\(tasks: Task\[\]\): Task\[\]/);
  expect(src).not.toContain("taks");
});

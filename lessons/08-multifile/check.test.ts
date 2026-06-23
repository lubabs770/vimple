import { test, expect } from "vitest";
import { formatTask } from "../../src/cli";

test("formatTask renders open and done tasks", () => {
  expect(formatTask({ id: 1, title: "buy milk", done: false })).toBe("[ ] 1 buy milk");
  expect(formatTask({ id: 2, title: "walk dog", done: true })).toBe("[x] 2 walk dog");
});

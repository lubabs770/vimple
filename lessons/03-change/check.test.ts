import { test, expect } from "vitest";
import { addTask } from "../../src/todo";

test("addTask appends a task with incrementing id", () => {
  const a = addTask([], "buy milk");
  expect(a).toEqual([{ id: 1, title: "buy milk", done: false }]);
  const b = addTask(a, "walk dog");
  expect(b[1]).toEqual({ id: 2, title: "walk dog", done: false });
  expect(a).toHaveLength(1); // original not mutated
});

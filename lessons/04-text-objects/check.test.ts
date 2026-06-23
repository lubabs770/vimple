import { test, expect } from "vitest";
import { listOpen, type Task } from "../../src/todo";

test("listOpen returns only undone tasks", () => {
  const tasks: Task[] = [
    { id: 1, title: "a", done: false },
    { id: 2, title: "b", done: true },
  ];
  expect(listOpen(tasks)).toEqual([{ id: 1, title: "a", done: false }]);
});

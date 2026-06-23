import { test, expect } from "vitest";
import { removeTask, type Task } from "../../src/todo";

test("removeTask drops the matching id", () => {
  const tasks: Task[] = [
    { id: 1, title: "a", done: false },
    { id: 2, title: "b", done: false },
  ];
  expect(removeTask(tasks, 1)).toEqual([{ id: 2, title: "b", done: false }]);
});

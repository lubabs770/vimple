import { test, expect } from "vitest";
import { completeTask, type Task } from "../../src/todo";

test("completeTask marks the matching id done", () => {
  const tasks: Task[] = [{ id: 1, title: "a", done: false }];
  expect(completeTask(tasks, 1)).toEqual([{ id: 1, title: "a", done: true }]);
  expect(tasks[0].done).toBe(false); // not mutated
});

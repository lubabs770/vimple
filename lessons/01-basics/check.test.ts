import { test, expect } from "vitest";
import { APP_NAME } from "../../src/todo";

test("APP_NAME is set to vimple-todo", () => {
  expect(APP_NAME).toBe("vimple-todo");
});

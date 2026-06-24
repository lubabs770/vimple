import { test, expect } from "vitest";
import { API_NAME } from "../../src/server";

test("API_NAME is set to notes-api", () => {
  expect(API_NAME).toBe("notes-api");
});

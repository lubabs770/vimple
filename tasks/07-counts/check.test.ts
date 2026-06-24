import { test, expect } from "vitest";
import { DEFAULT_TAGS } from "../../src/services/notes";

test("DEFAULT_TAGS is trimmed to the first three tags", () => {
  expect(DEFAULT_TAGS).toEqual(["inbox", "todo", "later"]);
});

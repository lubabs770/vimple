import { test, expect } from "vitest";
import { ACTIONS } from "../../src/services/notes";

test("ACTIONS are namespaced with notes:", () => {
  expect(ACTIONS).toEqual(["notes:create", "notes:read", "notes:update", "notes:remove"]);
});

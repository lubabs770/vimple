import { test, expect } from "vitest";
import { resolveTemplate } from "../src/runner/keymap";

test("resolveTemplate substitutes known actions", () => {
  expect(resolveTemplate("use {a} then {b}", { a: "ciw", b: "dd" })).toBe("use ciw then dd");
});

test("resolveTemplate throws on an unknown action", () => {
  expect(() => resolveTemplate("{nope}", {})).toThrow(/Unknown keymap action/);
});

import { describe, it, expect } from "vitest";
import { resolveTemplate } from "../src/runner/keymap";

describe("resolveTemplate", () => {
  const km = { end_of_word: "e", change_word: "ciw" };

  it("replaces a single placeholder", () => {
    expect(resolveTemplate("press {end_of_word} now", km)).toBe("press e now");
  });

  it("replaces multiple placeholders", () => {
    expect(resolveTemplate("{end_of_word} then {change_word}", km)).toBe("e then ciw");
  });

  it("leaves plain text untouched", () => {
    expect(resolveTemplate("no braces here", km)).toBe("no braces here");
  });

  it("throws on unknown action", () => {
    expect(() => resolveTemplate("{missing}", km)).toThrowError("Unknown keymap action: missing");
  });
});

import { describe, it, expect } from "vitest";
import { renderLesson, progressBar } from "../src/runner/render";

describe("render", () => {
  it("progress bar reflects completion", () => {
    expect(progressBar(4, 10)).toBe("[####------] 4/10");
    expect(progressBar(0, 2)).toBe("[----------] 0/2");
    expect(progressBar(2, 2)).toBe("[##########] 2/2");
  });
  it("includes lesson number and body without color when NO_COLOR set", () => {
    process.env.NO_COLOR = "1";
    const out = renderLesson("body text", { index: 0, total: 3 });
    delete process.env.NO_COLOR;
    expect(out).toContain("Lesson 1/3");
    expect(out).toContain("body text");
    expect(out).not.toContain("\x1b[");
  });
});

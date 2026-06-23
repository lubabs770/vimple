import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../src/runner/cli";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "vimple-cli-"));
  writeFileSync(join(dir, "keymap.json"), JSON.stringify({ end_of_word: "e" }));
  const d = join(dir, "lessons", "01-intro");
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, "lesson.txt"), "use {end_of_word}");
  writeFileSync(join(d, "check.test.ts"), "");
});
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

describe("cli run", () => {
  it("show resolves keymap in lesson text", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    const code = run([], dir, {});
    const out = spy.mock.calls.map((c) => c.join(" ")).join("\n");
    spy.mockRestore();
    expect(code).toBe(0);
    expect(out).toContain("use e");
  });
  it("check advances state on pass", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const code = run(["check"], dir, {}, {
      runCheck: () => ({ passed: true, output: "" }),
    });
    expect(code).toBe(0);
    // After passing lesson 0 of 1, status should read 1/1
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    run(["status"], dir, {});
    const out = spy.mock.calls.map((c) => c.join(" ")).join("\n");
    spy.mockRestore();
    expect(out).toContain("1/1");
  });
});

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getCurrentIndex, advance, reset } from "../src/runner/state";

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "vimple-")); });
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

describe("state", () => {
  it("defaults to 0 when no state file", () => {
    expect(getCurrentIndex(dir)).toBe(0);
  });
  it("advance increments and persists", () => {
    expect(advance(dir)).toBe(1);
    expect(getCurrentIndex(dir)).toBe(1);
  });
  it("reset writes a specific index", () => {
    advance(dir); advance(dir);
    expect(reset(dir, 0)).toBe(0);
    expect(getCurrentIndex(dir)).toBe(0);
  });
});

import { test, expect, beforeEach } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { load, save, advance, reset } from "../src/runner/state";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "vimple-"));
});

test("load returns defaults when there is no state file", () => {
  expect(load(dir)).toEqual({ taskIndex: 0, editorMode: null, setupDone: false });
});

test("advance and reset move the pointer but preserve setup", () => {
  save(dir, { taskIndex: 0, editorMode: "own", setupDone: true });
  expect(advance(dir).taskIndex).toBe(1);
  expect(advance(dir).taskIndex).toBe(2);
  expect(reset(dir, 0).taskIndex).toBe(0);
  expect(load(dir).editorMode).toBe("own");
  expect(load(dir).setupDone).toBe(true);
});

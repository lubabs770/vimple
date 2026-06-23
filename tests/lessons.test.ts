import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { listLessons, getLessonText } from "../src/runner/lessons";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "vimple-"));
  for (const name of ["02-second", "01-first"]) {
    const d = join(dir, "lessons", name);
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, "lesson.txt"), `text ${name}`);
    writeFileSync(join(d, "check.test.ts"), "");
  }
});
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

describe("lessons", () => {
  it("lists lessons sorted by numeric prefix", () => {
    const ls = listLessons(dir);
    expect(ls.map((l) => l.name)).toEqual(["01-first", "02-second"]);
    expect(ls[0].index).toBe(0);
  });
  it("reads lesson text", () => {
    expect(getLessonText(listLessons(dir)[1])).toBe("text 02-second");
  });
});

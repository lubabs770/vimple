// tests/completability.test.ts
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, writeFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SOLVED_TODO, SOLVED_CLI } from "../scripts/solve";

describe("completability", () => {
  it("applying canonical solutions makes all lesson checks pass", () => {
    const root = process.cwd();
    const tmp = mkdtempSync(join(tmpdir(), "vimple-e2e-"));
    for (const d of ["lessons", "src", "tests", "scripts"]) {
      cpSync(join(root, d), join(tmp, d), { recursive: true });
    }
    for (const f of ["package.json", "tsconfig.json", "vitest.config.ts"]) {
      cpSync(join(root, f), join(tmp, f));
    }
    // Symlink node_modules (fast; rmSync below removes only the link, not the real tree).
    symlinkSync(join(root, "node_modules"), join(tmp, "node_modules"));
    writeFileSync(join(tmp, "src/todo.ts"), SOLVED_TODO);
    writeFileSync(join(tmp, "src/cli.ts"), SOLVED_CLI);

    const res = spawnSync("npx", ["vitest", "run", "lessons"], { cwd: tmp, encoding: "utf8" });
    rmSync(tmp, { recursive: true, force: true });
    expect(res.status, res.stdout + res.stderr).toBe(0);
  }, 60_000);
});

import { describe, it, expect, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { runCheck } from "../src/runner/check";

// runCheck shells out to the repo's own vitest, which only discovers files matching
// the include globs in vitest.config.ts. So the throwaway check files must live under
// lessons/ (matching "lessons/**/check.test.ts"). The "^\d+-" lesson filter ignores
// these names, so they never show up as real lessons. Cleaned up in afterEach.
const repoRoot = process.cwd();
const okDir = join(repoRoot, "lessons", "__tmp_ok__");
const badDir = join(repoRoot, "lessons", "__tmp_bad__");

afterEach(() => {
  rmSync(okDir, { recursive: true, force: true });
  rmSync(badDir, { recursive: true, force: true });
});

describe("runCheck", () => {
  it("reports pass for a passing check", () => {
    mkdirSync(okDir, { recursive: true });
    writeFileSync(
      join(okDir, "check.test.ts"),
      `import { test, expect } from "vitest"; test("ok", () => { expect(1).toBe(1); });`,
    );
    const r = runCheck(repoRoot, "lessons/__tmp_ok__/check.test.ts");
    expect(r.passed).toBe(true);
    expect(r.output).toContain("passed");
  });

  it("reports fail for a failing check", () => {
    mkdirSync(badDir, { recursive: true });
    writeFileSync(
      join(badDir, "check.test.ts"),
      `import { test, expect } from "vitest"; test("bad", () => { expect(1).toBe(2); });`,
    );
    const r = runCheck(repoRoot, "lessons/__tmp_bad__/check.test.ts");
    expect(r.passed).toBe(false);
  });

  it("reports fail when the check path matches no test file", () => {
    const r = runCheck(repoRoot, "lessons/__does_not_exist__/check.test.ts");
    expect(r.passed).toBe(false);
  });
});

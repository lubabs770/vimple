import { spawnSync } from "node:child_process";

/** Grade a task: its hidden vitest check must pass AND the project must still
 *  type-check (so "make the build green" is enforced like real company work). */
export function runCheck(
  repoRoot: string,
  checkPath: string,
): { passed: boolean; output: string } {
  const test = spawnSync("npx", ["vitest", "run", "--passWithNoTests=false", checkPath], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (test.status !== 0) {
    return { passed: false, output: (test.stdout || "") + (test.stderr || "") };
  }
  const types = spawnSync("npx", ["tsc", "--noEmit"], { cwd: repoRoot, encoding: "utf8" });
  if (types.status !== 0) {
    return {
      passed: false,
      output:
        "The check passed, but the project has type errors — fix the build:\n\n" +
        (types.stdout || "") +
        (types.stderr || ""),
    };
  }
  return { passed: true, output: test.stdout || "" };
}

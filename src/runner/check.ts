import { spawnSync } from "node:child_process";

export function runCheck(
  repoRoot: string,
  checkPath: string,
): { passed: boolean; output: string } {
  const res = spawnSync("npx", ["vitest", "run", "--passWithNoTests=false", checkPath], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return { passed: res.status === 0, output: (res.stdout || "") + (res.stderr || "") };
}

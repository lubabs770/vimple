import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const file = (repoRoot: string) => join(repoRoot, ".vimple-state");

export function getCurrentIndex(repoRoot: string): number {
  const f = file(repoRoot);
  if (!existsSync(f)) return 0;
  const n = parseInt(readFileSync(f, "utf8").trim(), 10);
  return Number.isNaN(n) ? 0 : n;
}

export function reset(repoRoot: string, index = 0): number {
  writeFileSync(file(repoRoot), String(index), "utf8");
  return index;
}

export function advance(repoRoot: string): number {
  return reset(repoRoot, getCurrentIndex(repoRoot) + 1);
}

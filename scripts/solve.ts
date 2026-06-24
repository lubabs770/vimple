// Canonical solver — proves every task is completable end-to-end.
//
// Applies each task's `solutions` to the working tree, then runs the full task
// suite and a type-check. Used by CI on a fresh checkout. Running it locally
// rewrites your src/ to the finished state — restore with `git checkout -- src tasks`.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadTasks } from "../src/runner/tasks";

const root = process.cwd();

async function main(): Promise<void> {
  const tasks = await loadTasks(root);

  for (const task of tasks) {
    for (const [rel, transform] of Object.entries(task.solutions)) {
      const path = join(root, rel);
      const before = readFileSync(path, "utf8");
      const after = transform(before);
      if (after === before) {
        console.error(
          `solve: task ${task.id}'s solution made no change to ${rel} — it's out of date.`,
        );
        process.exit(1);
      }
      writeFileSync(path, after, "utf8");
    }
    console.log(`applied solution for task ${task.id} (${task.skill})`);
  }

  console.log("\nrunning the full task suite against the solved tree...");
  const test = spawnSync("npx", ["vitest", "run", "tasks/"], { cwd: root, stdio: "inherit" });
  if (test.status !== 0) {
    console.error("solve: not every task check passed on the solved tree.");
    process.exit(1);
  }

  console.log("\ntype-checking the solved tree...");
  const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, stdio: "inherit" });
  if (tsc.status !== 0) {
    console.error("solve: the solved tree does not type-check.");
    process.exit(1);
  }

  console.log("\n✓ All tasks completable; final build is clean.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

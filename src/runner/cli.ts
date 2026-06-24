import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadKeymap, resolveTemplate } from "./keymap";
import { load, save, advance, reset } from "./state";
import { loadTasks, type LoadedTask } from "./tasks";
import { expand, collapse, reanchor } from "./markers";
import { startBanner, progressBar } from "./render";
import { resolveEditor, type EditorSpec } from "./editor";
import { runCheck as defaultRunCheck } from "./check";
import { runSetup } from "./setup";
import { doctor, formatDoctor } from "./doctor";

type Deps = {
  launchEditor?: (spec: EditorSpec, cwd: string) => void;
  runCheck?: typeof defaultRunCheck;
  setup?: typeof runSetup;
};

function defaultLaunch(spec: EditorSpec, cwd: string): void {
  spawnSync(spec.bin, spec.args, { cwd, stdio: "inherit", env: { ...process.env, ...spec.env } });
}

/** Inject the current task's instruction block into its source file (idempotent). */
function expandCurrent(root: string, task: LoadedTask): void {
  const km = loadKeymap(root);
  const lines = resolveTemplate(task.instruction, km).split("\n");
  const path = join(root, task.file);
  const src = readFileSync(path, "utf8");
  const next = expand(src, task.id, lines);
  if (next !== src) writeFileSync(path, next, "utf8");
}

/** Collapse the current task's instruction block once it's complete. */
function collapseTask(root: string, task: LoadedTask): void {
  const path = join(root, task.file);
  const src = readFileSync(path, "utf8");
  const next = collapse(src, task.id);
  if (next !== src) writeFileSync(path, next, "utf8");
}

/** Re-arm a task's anchor (drop block, done -> anchor) so it can start again. */
function reanchorTask(root: string, task: LoadedTask): void {
  const path = join(root, task.file);
  const src = readFileSync(path, "utf8");
  const next = reanchor(src, task.id);
  if (next !== src) writeFileSync(path, next, "utf8");
}

export async function run(
  argv: string[],
  root: string,
  env: NodeJS.ProcessEnv,
  deps: Deps = {},
): Promise<number> {
  const tasks = await loadTasks(root);
  const total = tasks.length;
  const cmd = argv[0];
  let state = load(root);

  if (cmd === "status") {
    console.log(progressBar(Math.min(state.taskIndex, total), total));
    return 0;
  }

  if (cmd === "doctor") {
    console.log(formatDoctor(doctor(env, state.editorMode)));
    return 0;
  }

  if (cmd === "reset") {
    const n = argv[1] ? parseInt(argv[1], 10) : 0;
    // Re-arm anchors at or after the target so those tasks can be started again.
    // (This restores instruction markers; it does not revert your code edits.)
    for (let i = Math.max(0, n); i < total; i++) reanchorTask(root, tasks[i]!);
    state = reset(root, n);
    console.log(`Reset to task ${Math.max(0, n) + 1}.`);
    return 0;
  }

  if (state.taskIndex >= total) {
    console.log("🎉 All tasks complete — your notes API is built, typed, and green. Run `npm test`.");
    return 0;
  }

  const task = tasks[state.taskIndex]!;

  if (cmd === "check") {
    const check = deps.runCheck ?? defaultRunCheck;
    const checkPath = join("tasks", task.dirName, "check.test.ts");
    const { passed, output } = check(root, checkPath);
    if (!passed) {
      console.log(`✗ Task ${task.id} not complete yet:\n`);
      console.log(output);
      return 1;
    }
    collapseTask(root, task);
    state = advance(root);
    console.log(`✓ Task ${task.id} complete!  ${progressBar(state.taskIndex, total)}`);
    if (state.taskIndex < total) {
      const nextTask = tasks[state.taskIndex]!;
      expandCurrent(root, nextTask);
      console.log(
        `\nNext: task ${nextTask.id} — ${nextTask.skill} (in ${nextTask.file}). Run ./vimple to dive in.`,
      );
    } else {
      console.log("\n🎉 That was the last one. Run `npm test` to see it all green.");
    }
    return 0;
  }

  // Default: start / resume the current task.
  if (!state.setupDone) {
    const setup = deps.setup ?? runSetup;
    state.editorMode = await setup(env);
    state.setupDone = true;
    save(root, state);
  }

  expandCurrent(root, task);
  console.log(startBanner(task, state.taskIndex, total));
  (deps.launchEditor ?? defaultLaunch)(resolveEditor(env, { mode: state.editorMode, root }), root);
  return 0;
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  run(process.argv.slice(2), process.cwd(), process.env).then(
    (code) => process.exit(code),
    (err) => {
      console.error(err);
      process.exit(1);
    },
  );
}

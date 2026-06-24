import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadKeymap, resolveTemplate } from "./keymap";
import { load, save, advance, reset } from "./state";
import { loadTasks, type LoadedTask } from "./tasks";
import { expand, collapse, reanchor } from "./markers";
import { startBanner, advanceBanner, progressBar } from "./render";
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

/** 1-based line of the task's injected instruction block, so the editor can open
 *  with the cursor already on it. Falls back to 1 if not found. */
function instructionLine(root: string, task: LoadedTask): number {
  const src = readFileSync(join(root, task.file), "utf8");
  const i = src.split("\n").findIndex((r) => /\/\/\s*@vimple:begin\b/.test(r));
  return i < 0 ? 1 : i + 1;
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

  const check = deps.runCheck ?? defaultRunCheck;
  const grade = (t: LoadedTask) => check(root, join("tasks", t.dirName, "check.test.ts"));

  // `check` is an optional, non-interactive alias (handy for CI or a quick re-grade
  // without opening the editor). The normal flow never needs it — `./vimple` grades
  // automatically when you quit Vim.
  if (cmd === "check") {
    const task = tasks[state.taskIndex]!;
    const { passed, output } = grade(task);
    if (!passed) {
      console.log(`✗ Task ${task.id} not complete yet:\n`);
      console.log(output);
      return 1;
    }
    collapseTask(root, task);
    state = advance(root);
    console.log(`✓ Task ${task.id} complete!  ${progressBar(state.taskIndex, total)}`);
    if (state.taskIndex < total) expandCurrent(root, tasks[state.taskIndex]!);
    else console.log("\n🎉 That was the last one. Run `npm test` to see it all green.");
    return 0;
  }

  // Default: the whole experience behind one command. Open Vim on the current task;
  // when you quit, grade it; on green, roll straight into the next task — all without
  // ever leaving `./vimple` or typing a second command.
  if (!state.setupDone) {
    const setup = deps.setup ?? runSetup;
    state.editorMode = await setup(env);
    state.setupDone = true;
    save(root, state);
  }

  const launch = deps.launchEditor ?? defaultLaunch;
  while (state.taskIndex < total) {
    const task = tasks[state.taskIndex]!;
    expandCurrent(root, task);
    console.log(startBanner(task, state.taskIndex, total));
    const line = instructionLine(root, task);
    launch(resolveEditor(env, { mode: state.editorMode, root, file: task.file, line }), root);

    const { passed, output } = grade(task);
    if (!passed) {
      console.log(`\n✗ Task ${task.id} isn't passing yet:\n`);
      console.log(output);
      console.log(dim("\nFix it up and run ./vimple again to pick up right here."));
      return 1;
    }
    collapseTask(root, task);
    state = advance(root);
    console.log(advanceBanner(task.id, state.taskIndex, total));
  }

  console.log("🎉 All tasks complete — your notes API is built, typed, and green. Run `npm test`.");
  return 0;
}

const dim = (s: string) => (process.env.NO_COLOR ? s : `\x1b[2m${s}\x1b[0m`);

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

import { spawnSync } from "node:child_process";
import { loadKeymap, resolveTemplate } from "./keymap";
import { getCurrentIndex, advance, reset } from "./state";
import { listLessons, getLessonText } from "./lessons";
import { renderLesson, progressBar } from "./render";
import { resolveEditor, type EditorSpec } from "./editor";
import { runCheck as defaultRunCheck } from "./check";

type Deps = {
  launchEditor?: (spec: EditorSpec, cwd: string) => void;
  runCheck?: typeof defaultRunCheck;
};

function defaultLaunch(spec: EditorSpec, cwd: string): void {
  spawnSync(spec.bin, spec.args, { cwd, stdio: "inherit", env: { ...process.env, ...spec.env } });
}

export function run(argv: string[], repoRoot: string, env: NodeJS.ProcessEnv, deps: Deps = {}): number {
  const lessons = listLessons(repoRoot);
  const total = lessons.length;
  const idx = getCurrentIndex(repoRoot);
  const cmd = argv[0];

  if (cmd === "status") {
    console.log(progressBar(Math.min(idx, total), total));
    return 0;
  }
  if (cmd === "reset") {
    const n = argv[1] ? parseInt(argv[1], 10) : 0;
    reset(repoRoot, n);
    console.log(`Reset to lesson ${n + 1}.`);
    return 0;
  }
  if (idx >= total) {
    console.log("🎉 All lessons complete — your todo CLI is built. Run `npm test`.");
    return 0;
  }
  const lesson = lessons[idx];

  if (cmd === "edit") {
    const spec = resolveEditor(env);
    (deps.launchEditor ?? defaultLaunch)(spec, repoRoot);
    return 0;
  }
  if (cmd === "check") {
    const check = deps.runCheck ?? defaultRunCheck;
    const { passed, output } = check(repoRoot, lesson.checkPath);
    if (passed) {
      advance(repoRoot);
      console.log("✓ Lesson complete!");
      return 0;
    }
    console.log("✗ Not yet — here's what the check saw:\n");
    console.log(output);
    return 1;
  }

  // default: show the current lesson
  const km = loadKeymap(repoRoot);
  const resolved = resolveTemplate(getLessonText(lesson), km);
  console.log(renderLesson(resolved, { index: idx, total }));
  console.log("Edit with `./vimple edit` (opens your Vim), then `./vimple check`.");
  return 0;
}

// Entry point when executed directly
const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  process.exit(run(process.argv.slice(2), process.cwd(), process.env));
}

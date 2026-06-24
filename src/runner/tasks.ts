import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** A single curriculum task. Each `tasks/NN-slug/task.ts` default-exports one. */
export type Task = {
  /** 1-based task id, matching its `// @vimple:anchor NN`. */
  id: number;
  /** Short skill name, e.g. "auto-import & completion". */
  skill: string;
  /** One-line title. */
  title: string;
  /** Repo-relative file containing this task's anchor (instruction site + hint). */
  file: string;
  /** One-line hint shown when you start the task. */
  hint: string;
  /** Multi-line instruction body, templated with `{keymap_action}` tokens. */
  instruction: string;
  /** Canonical solution: repo-relative path -> pure transform of that file's text.
   *  Used by the solver/CI to prove the task is completable end-to-end. */
  solutions: Record<string, (src: string) => string>;
};

export type LoadedTask = Task & { dirName: string };

export async function loadTasks(root: string): Promise<LoadedTask[]> {
  const dir = join(root, "tasks");
  const names = readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d+-/.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  const tasks: LoadedTask[] = [];
  for (const name of names) {
    const mod = (await import(pathToFileURL(join(dir, name, "task.ts")).href)) as {
      default: Task;
    };
    tasks.push({ ...mod.default, dirName: name });
  }
  return tasks;
}

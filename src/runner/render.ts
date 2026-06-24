import type { LoadedTask } from "./tasks";

const useColor = () => !process.env.NO_COLOR;
const bold = (s: string) => (useColor() ? `\x1b[1m${s}\x1b[0m` : s);
const dim = (s: string) => (useColor() ? `\x1b[2m${s}\x1b[0m` : s);
const green = (s: string) => (useColor() ? `\x1b[32m${s}\x1b[0m` : s);

export function progressBar(done: number, total: number): string {
  const width = 12;
  const filled = total === 0 ? 0 : Math.round((done / total) * width);
  return `[${green("#".repeat(filled))}${"-".repeat(width - filled)}] ${done}/${total}`;
}

/** Banner shown when starting/resuming a task. */
export function startBanner(task: LoadedTask, index: number, total: number): string {
  const head = bold(`vimple · task ${task.id}/${total} · ${task.skill}`);
  return [
    "",
    `${head}   ${progressBar(index, total)}`,
    bold(task.title),
    "",
    `${dim("→")} open the project in Vim and navigate to ${bold(task.file)}`,
    `${dim("  ")} ${task.hint}`,
    `${dim("  the full instructions are waiting in the buffer, as a comment block.")}`,
    "",
    dim("when you've made the edit, save and run:  ./vimple check"),
    "",
  ].join("\n");
}

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

/** Banner shown right before the editor opens. Deliberately carries NO task
 *  instructions — those live only in the buffer's comment block. This is just a
 *  "where am I / what's loading" marker. */
export function startBanner(task: LoadedTask, index: number, total: number): string {
  const head = bold(`vimple · task ${task.id}/${total} · ${task.skill}`);
  return [
    "",
    `${head}   ${progressBar(index, total)}`,
    `${dim("→ opening Vim at")} ${bold(task.file)}${dim(" — your instructions are in the buffer.")}`,
    `${dim("  save & quit when you think it's done; vimple grades it automatically.")}`,
    "",
  ].join("\n");
}

/** Shown after a task passes and we roll into the next one in the same session. */
export function advanceBanner(passedId: number, done: number, total: number): string {
  return [
    "",
    `${green("✓")} ${bold(`task ${passedId} complete`)}   ${progressBar(done, total)}`,
    "",
  ].join("\n");
}

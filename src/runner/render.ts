const useColor = () => !process.env.NO_COLOR;
const bold = (s: string) => (useColor() ? `\x1b[1m${s}\x1b[0m` : s);

export function progressBar(index: number, total: number): string {
  const width = 10;
  const filled = total === 0 ? 0 : Math.round((index / total) * width);
  return `[${"#".repeat(filled)}${"-".repeat(width - filled)}] ${index}/${total}`;
}

export function renderLesson(resolvedText: string, position: { index: number; total: number }): string {
  const header = bold(`Lesson ${position.index + 1}/${position.total}`);
  return `${header} ${progressBar(position.index, position.total)}\n\n${resolvedText}\n`;
}

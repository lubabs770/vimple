import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 7,
  skill: "counts & combos",
  title: "Trim a list with a counted motion",
  file: "src/services/notes.ts",
  hint: "trim DEFAULT_TAGS down to the first three tags.",
  instruction: [
    "task 7 · counts & combos",
    'DEFAULT_TAGS should only keep the first three tags ("inbox", "todo", "later").',
    'Park your cursor on the "scratch" line and delete the last two entries in a',
    "single counted motion (e.g. 2{delete_line}). Result:",
    '    ["inbox", "todo", "later"]',
  ].join("\n"),
  solutions: {
    "src/services/notes.ts": (s) => s.replace('  "scratch",\n  "temp",\n', ""),
  },
};

export default task;

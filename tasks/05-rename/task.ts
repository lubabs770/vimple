import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 5,
  skill: "rename a symbol (LSP)",
  title: "Rename a factory across files",
  file: "src/models/note.ts",
  hint: "rename mkNote → createNote everywhere (LSP rename).",
  instruction: [
    "task 5 · rename a symbol",
    "`mkNote` is a vague name. Put your cursor on it and use your LSP rename",
    "({rename_symbol}) to rename it to `createNote` project-wide.",
    "The model AND services/notes.ts must agree — if you only rename one, the",
    "build breaks. That's the point: one keystroke, every reference.",
  ].join("\n"),
  solutions: {
    "src/models/note.ts": (s) => s.replace(/\bmkNote\b/g, "createNote"),
    "src/services/notes.ts": (s) => s.replace(/\bmkNote\b/g, "createNote"),
  },
};

export default task;

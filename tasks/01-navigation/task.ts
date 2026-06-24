import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 1,
  skill: "navigation & jump-to-definition",
  title: "Open the project and make your first edit",
  file: "src/server.ts",
  hint: 'rename the API_NAME constant to "notes-api".',
  instruction: [
    "task 1 · navigation",
    "Welcome to the notes API. First, learn to move around.",
    "Open files from the repo root with {find_file}, and use {jump_to_def} to leap",
    "to a symbol's definition (try it on buildServer).",
    "",
    'Change API_NAME below from "CHANGEME" to exactly:',
    '    "notes-api"',
    "Save with {save}, then run  ./vimple check",
  ].join("\n"),
  solutions: {
    "src/server.ts": (s) =>
      s.replace('export const API_NAME = "CHANGEME";', 'export const API_NAME = "notes-api";'),
  },
};

export default task;

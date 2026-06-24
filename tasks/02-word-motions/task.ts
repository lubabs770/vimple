import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 2,
  skill: "word & line motions",
  title: "Fix a typo with word motions",
  file: "src/routes/health.ts",
  hint: "fix the typo in the /health route's service field.",
  instruction: [
    "task 2 · word motions",
    "The /health response has a typo in its `service` field.",
    "Hop across words with {next_word} / {prev_word} / {end_of_word} to land on it,",
    "then fix the value so it reads exactly:",
    '    "notes-api"',
  ].join("\n"),
  solutions: {
    "src/routes/health.ts": (s) => s.replace('"notez-api"', '"notes-api"'),
  },
};

export default task;

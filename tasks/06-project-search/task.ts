import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 6,
  skill: "project search & quickfix",
  title: "Bump a version literal across the project",
  file: "src/server.ts",
  hint: 'change every "v0" literal to "v1" across the project.',
  instruction: [
    "task 6 · project-wide search & quickfix",
    'The version literal "v0" is hard-coded in three files (server, health route,',
    "service). Don't hunt them by hand.",
    "Search the project with {search_project} v0 to fill the quickfix list, then",
    "sweep them all with {quickfix_do} so every occurrence becomes:",
    '    "v1"',
  ].join("\n"),
  solutions: {
    "src/server.ts": (s) => s.replace('API_VERSION = "v0"', 'API_VERSION = "v1"'),
    "src/routes/health.ts": (s) => s.replace('version: "v0"', 'version: "v1"'),
    "src/services/notes.ts": (s) => s.replace('SCHEMA_VERSION = "v0"', 'SCHEMA_VERSION = "v1"'),
  },
};

export default task;

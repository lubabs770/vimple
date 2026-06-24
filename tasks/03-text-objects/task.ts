import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 3,
  skill: "change operators & text objects",
  title: "Fix a route path with a text object",
  file: "src/routes/notes.ts",
  hint: 'fix the GET-by-id route path to "/notes/:id".',
  instruction: [
    "task 3 · text objects",
    "The GET-by-id route points at the wrong path.",
    "Put your cursor inside the string and use {change_in_quotes} to retype it so",
    "the route registers exactly:",
    '    "/notes/:id"',
  ].join("\n"),
  solutions: {
    "src/routes/notes.ts": (s) =>
      s.replace('app.get("/notez/:id", getHandler);', 'app.get("/notes/:id", getHandler);'),
  },
};

export default task;

import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 9,
  skill: "multi-file feature",
  title: "Add a search endpoint end-to-end",
  file: "src/routes/notes.ts",
  hint: "wire GET /search/:query and implement searchNotes().",
  instruction: [
    "task 9 · multi-file feature",
    "Add a search endpoint that spans two files. Here in routes, register it:",
    '    app.get("/search/:query", searchHandler);',
    "Then jump to services/notes.ts and implement searchNotes(query) so it returns",
    "notes whose title contains `query`, case-insensitively. Set a mark before you",
    "jump so you can bounce back. The handler is already wired to the service.",
  ].join("\n"),
  solutions: {
    "src/routes/notes.ts": (s) =>
      s.replace("  void searchHandler;", '  app.get("/search/:query", searchHandler);'),
    "src/services/notes.ts": (s) =>
      s.replace(
        "export function searchNotes(query: string): Note[] {\n  void query;\n  return [];\n}",
        "export function searchNotes(query: string): Note[] {\n  const q = query.toLowerCase();\n  return listNotes().filter((n) => n.title.toLowerCase().includes(q));\n}",
      ),
  },
};

export default task;

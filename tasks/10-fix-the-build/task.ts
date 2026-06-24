import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 10,
  skill: "fix the build (clean types)",
  title: "Make the types honest and the build green",
  file: "src/handlers/notes.ts",
  hint: "fix noteToResponse and delete the @ts-expect-error.",
  instruction: [
    "task 10 · fix the build",
    "noteToResponse returns the wrong shape — it only compiles because of a",
    "// @ts-expect-error. Make it return a real NoteResponse:",
    "    return { id: note.id, title: note.title, tags: note.tags };",
    "…then delete the now-unused @ts-expect-error line so `tsc` is clean again.",
    "Run `npm run typecheck` to confirm zero errors.",
  ].join("\n"),
  solutions: {
    "src/handlers/notes.ts": (s) =>
      s.replace(
        "  // @ts-expect-error task 10: the return shape is wrong — make it match NoteResponse.\n  return { id: note.id, name: note.title };",
        "  return { id: note.id, title: note.title, tags: note.tags };",
      ),
  },
};

export default task;

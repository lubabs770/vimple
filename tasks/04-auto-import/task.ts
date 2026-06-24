import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 4,
  skill: "auto-import & completion",
  title: "Wire a service into a handler",
  file: "src/handlers/notes.ts",
  hint: "import addNote and make createHandler return 201.",
  instruction: [
    "task 4 · auto-import & completion",
    "createHandler ignores the service and returns a 501 stub.",
    "Import `addNote` from ../services/notes — let your LSP auto-import it, or type",
    "the name and {omni_complete} to complete it. Then replace the stub so it",
    "persists the note and returns 201:",
    "    return { status: 201, body: addNote(input) };",
  ].join("\n"),
  solutions: {
    "src/handlers/notes.ts": (s) =>
      s
        .replace(
          'import { getNote, listNotes, searchNotes } from "../services/notes";',
          'import { addNote, getNote, listNotes, searchNotes } from "../services/notes";',
        )
        .replace(
          '  // @vimple:anchor 04\n  // task 4: persist `input` via the service, then return the new note (status 201).\n  return { status: 501, body: { error: "not implemented" } };',
          "  return { status: 201, body: addNote(input) };",
        ),
  },
};

export default task;

import type { Task } from "../../src/runner/tasks";

const task: Task = {
  id: 8,
  skill: "macros",
  title: "Namespace a list with a macro",
  file: "src/services/notes.ts",
  hint: 'prefix every ACTIONS entry with "notes:" (try a macro).',
  instruction: [
    "task 8 · macros",
    "Each ACTION should be namespaced. Rather than editing four lines by hand,",
    'record a macro ({record_macro}q) that turns  "create",  into  "notes:create",',
    "then replay it ({play_macro}q) down the rest of the list. Result:",
    '    ["notes:create", "notes:read", "notes:update", "notes:remove"]',
  ].join("\n"),
  solutions: {
    "src/services/notes.ts": (s) =>
      s.replace(
        '  "create",\n  "read",\n  "update",\n  "remove",\n',
        '  "notes:create",\n  "notes:read",\n  "notes:update",\n  "notes:remove",\n',
      ),
  },
};

export default task;

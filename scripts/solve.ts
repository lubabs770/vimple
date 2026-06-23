// scripts/solve.ts — canonical solved sources, used by the completability test.
export const SOLVED_TODO = `export const APP_NAME = "vimple-todo";

export type Task = { id: number; title: string; done: boolean };

/** todo op */
export function addTask(tasks: Task[], title: string): Task[] {
  return [...tasks, { id: tasks.length + 1, title, done: false }];
}
/** todo op */
export function listOpen(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.done);
}
/** todo op */
export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: true } : t));
}
/** todo op */
export function removeTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((t) => t.id !== id);
}
`;

export const SOLVED_CLI = `import type { Task } from "./todo";

export function formatTask(t: Task): string {
  return \`[\${t.done ? "x" : " "}] \${t.id} \${t.title}\`;
}
`;

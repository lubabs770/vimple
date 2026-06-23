// src/todo.ts — the dead-simple todo CLI you build, one lesson at a time.
export const APP_NAME = "CHANGEME";

export type Task = { id: number; title: string; done: boolean };

// Lessons will complete these. Stubs throw so unfinished work is obvious.
export function addTask(tasks: Task[], title: string): Task[] {
  throw new Error("not implemented");
}
export function listOpen(tasks: Task[]): Task[] {
  throw new Error("not implemented");
}
export function completeTask(tasks: Task[], id: number): Task[] {
  throw new Error("not implemented");
}
export function removeTask(tasks: Task[], id: number): Task[] {
  throw new Error("not implemented");
}

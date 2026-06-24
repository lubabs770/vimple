import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type EditorMode = "own" | "turnkey";

export type State = {
  taskIndex: number;
  editorMode: EditorMode | null;
  setupDone: boolean;
};

const DEFAULT: State = { taskIndex: 0, editorMode: null, setupDone: false };
const file = (root: string) => join(root, ".vimple-state");

export function load(root: string): State {
  const f = file(root);
  if (!existsSync(f)) return { ...DEFAULT };
  try {
    const raw = JSON.parse(readFileSync(f, "utf8")) as Record<string, unknown>;
    return {
      taskIndex: typeof raw.taskIndex === "number" ? raw.taskIndex : 0,
      editorMode:
        raw.editorMode === "own" || raw.editorMode === "turnkey" ? raw.editorMode : null,
      setupDone: Boolean(raw.setupDone),
    };
  } catch {
    return { ...DEFAULT };
  }
}

export function save(root: string, state: State): void {
  writeFileSync(file(root), JSON.stringify(state, null, 2) + "\n", "utf8");
}

export function advance(root: string): State {
  const s = load(root);
  s.taskIndex += 1;
  save(root, s);
  return s;
}

export function reset(root: string, taskIndex = 0): State {
  const s = load(root);
  s.taskIndex = Math.max(0, taskIndex);
  save(root, s);
  return s;
}

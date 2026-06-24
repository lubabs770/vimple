import { basename, join } from "node:path";
import { statSync } from "node:fs";
import type { EditorMode } from "./state";

export type EditorSpec = { bin: string; args: string[]; env: Record<string, string> };

export function resolveEditor(
  env: NodeJS.ProcessEnv,
  opts: { mode: EditorMode | null; root: string; file?: string; line?: number },
): EditorSpec {
  // The file (and a `+<line>` jump to the instruction block) come LAST, so the
  // editor opens straight onto the task's buffer — never a config dashboard/start
  // screen — and the in-buffer instructions are on screen immediately.
  const open = openArgs(opts.file, opts.line);

  if (opts.mode === "turnkey") {
    // Load the bundled IDE config. nvim reads $XDG_CONFIG_HOME/nvim/init.lua.
    const bin = env.VIMPLE_EDITOR || "nvim";
    return { bin, args: open, env: { XDG_CONFIG_HOME: join(opts.root, "config", "turnkey") } };
  }

  // "own" (or unset): respect the learner's editor + config.
  const bin = env.VIMPLE_EDITOR || env.EDITOR || "vim";
  const cfg = env.VIMPLE_CONFIG;
  if (!cfg) return { bin, args: open, env: {} };
  if (isFileConfig(cfg)) return { bin, args: ["-u", cfg, ...open], env: {} };
  return { bin, args: open, env: { XDG_CONFIG_HOME: cfg } };
}

/** `+<line>` (jump on open) followed by the file path. Empty when no file given. */
function openArgs(file?: string, line?: number): string[] {
  if (!file) return [];
  return line && line > 1 ? [`+${line}`, file] : [file];
}

// A file config is loaded with `-u`, a dir config via `XDG_CONFIG_HOME`. When the
// path exists, trust the filesystem — otherwise a real dir whose name contains a dot
// (e.g. ~/.config) would be misread as a file. Fall back to a name heuristic only when
// the path does not exist yet.
function isFileConfig(cfg: string): boolean {
  try {
    return statSync(cfg).isFile();
  } catch {
    return /\.(vim|lua)$/.test(cfg) || basename(cfg).includes(".");
  }
}

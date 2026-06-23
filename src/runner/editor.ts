import { basename } from "node:path";
import { statSync } from "node:fs";

export type EditorSpec = { bin: string; args: string[]; env: Record<string, string> };

export function resolveEditor(env: NodeJS.ProcessEnv): EditorSpec {
  const bin = env.VIMPLE_EDITOR || env.EDITOR || "vim";
  const cfg = env.VIMPLE_CONFIG;
  if (!cfg) return { bin, args: [], env: {} };
  if (isFileConfig(cfg)) return { bin, args: ["-u", cfg], env: {} };
  return { bin, args: [], env: { XDG_CONFIG_HOME: cfg } };
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

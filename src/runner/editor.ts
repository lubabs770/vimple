import { basename } from "node:path";

export type EditorSpec = { bin: string; args: string[]; env: Record<string, string> };

export function resolveEditor(env: NodeJS.ProcessEnv): EditorSpec {
  const bin = env.VIMPLE_EDITOR || env.EDITOR || "vim";
  const cfg = env.VIMPLE_CONFIG;
  if (!cfg) return { bin, args: [], env: {} };
  const looksLikeFile = /\.(vim|lua)$/.test(cfg) || basename(cfg).includes(".");
  if (looksLikeFile) return { bin, args: ["-u", cfg], env: {} };
  return { bin, args: [], env: { XDG_CONFIG_HOME: cfg } };
}

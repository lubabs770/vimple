import { spawnSync } from "node:child_process";
import type { EditorMode } from "./state";

type Check = { label: string; ok: boolean; detail: string };

function run(cmd: string, args: string[]): { ok: boolean; out: string } {
  try {
    const r = spawnSync(cmd, args, { encoding: "utf8" });
    return { ok: r.status === 0, out: ((r.stdout || "") + (r.stderr || "")).trim() };
  } catch {
    return { ok: false, out: "not found" };
  }
}

function firstLine(s: string): string {
  return s.split("\n")[0] ?? "";
}

/** Verify the environment can deliver the IDE experience. Pure-ish: returns the
 *  checks so the caller decides how to print them. */
export function doctor(env: NodeJS.ProcessEnv, mode: EditorMode | null): Check[] {
  const checks: Check[] = [];

  const node = run("node", ["--version"]);
  checks.push({ label: "node", ok: node.ok, detail: firstLine(node.out) });

  const tsc = run("npx", ["tsc", "--version"]);
  checks.push({ label: "typescript (tsc)", ok: tsc.ok, detail: firstLine(tsc.out) });

  const editorBin =
    env.VIMPLE_EDITOR || (mode === "turnkey" ? "nvim" : env.EDITOR || "vim");
  const editor = run(editorBin, ["--version"]);
  checks.push({
    label: `editor (${editorBin})`,
    ok: editor.ok,
    detail: firstLine(editor.out) || "not found",
  });

  const lsp = run("typescript-language-server", ["--version"]);
  checks.push({
    label: "typescript-language-server",
    ok: lsp.ok,
    detail: lsp.ok ? firstLine(lsp.out) : "not found (needed for jump-to-def / auto-import / rename)",
  });

  return checks;
}

export function formatDoctor(checks: Check[]): string {
  const useColor = !process.env.NO_COLOR;
  const mark = (ok: boolean) =>
    ok ? (useColor ? "\x1b[32m✓\x1b[0m" : "✓") : useColor ? "\x1b[31m✗\x1b[0m" : "✗";
  return checks.map((c) => `  ${mark(c.ok)} ${c.label} — ${c.detail}`).join("\n");
}

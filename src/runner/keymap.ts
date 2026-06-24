import { readFileSync } from "node:fs";
import { join } from "node:path";

export function loadKeymap(repoRoot: string): Record<string, string> {
  return JSON.parse(readFileSync(join(repoRoot, "keymap.json"), "utf8")) as Record<
    string,
    string
  >;
}

export function resolveTemplate(text: string, keymap: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, action: string) => {
    const key = keymap[action];
    if (key === undefined) throw new Error(`Unknown keymap action: ${action}`);
    return key;
  });
}

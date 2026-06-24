import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import type { EditorMode } from "./state";
import { doctor, formatDoctor } from "./doctor";

/** First-run wizard: pick how you'll edit, then check the environment.
 *  Non-interactive shells (CI) default to "own" with no prompt. */
export async function runSetup(env: NodeJS.ProcessEnv): Promise<EditorMode> {
  let mode: EditorMode = "own";

  if (stdin.isTTY) {
    console.log("\nWelcome to vimple — let's set up your IDE.\n");
    console.log("  1) Use my own Vim/Neovim setup (you bring the LSP, finder, etc.)");
    console.log("  2) Use the shipped turnkey Neovim IDE config (LSP + finder, batteries included)\n");
    const rl = createInterface({ input: stdin, output: stdout });
    const answer = (await rl.question("Pick 1 or 2 [1]: ")).trim();
    rl.close();
    mode = answer === "2" ? "turnkey" : "own";
  } else {
    console.log("vimple: non-interactive shell — defaulting to your own editor (mode: own).");
  }

  console.log(`\nEditor mode: ${mode}\n`);
  console.log("Environment check:");
  console.log(formatDoctor(doctor(env, mode)));
  console.log("");
  return mode;
}

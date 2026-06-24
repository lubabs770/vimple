# vimple

Learn to use **Vim as an IDE** by doing real work in a real-feeling company
codebase — a small TypeScript **web API** you bring to life one task at a time.
Every task teaches one IDE-grade Vim skill (jump-to-definition, auto-import,
LSP rename, project search, macros, multi-file edits…), and the instructions are
waiting **right in the buffer**, as a comment block tailored to *your* keymap.

One command starts you, or picks up exactly where you left off. Finish all ten
tasks and you've got a working, type-checking, tested API you built entirely in
Vim.

## Quickstart

```bash
git clone <your-fork> vimple && cd vimple
npm install
./vimple            # start — or resume. first run asks how you want to edit.
```

That's the whole loop — **one command does everything:**

- `./vimple` — set up (first run), then open the project in Vim with the current
  task's instructions injected into the file you'll edit. When you **save & quit
  Vim, vimple grades it automatically**: green collapses the block and rolls you
  straight into the next task (same session, no second command); red shows what
  the grader saw, so you fix it and run `./vimple` again to pick up right here.

That's it — you never type a second command to advance. The rest are optional:

- `./vimple status` — progress.
- `./vimple reset [n]` — restart, or jump back to task `n`.
- `./vimple doctor` — re-check your environment (node, tsc, editor, LSP).
- `./vimple check` — re-grade the current task without opening Vim (handy for CI).

## How the instructions work

When you start a task, vimple writes a comment block into the real source file,
right where the work happens:

```ts
// ┄ vimple task 4 · auto-import & completion ┄
// Import `addNote` from ../services/notes (let your LSP auto-import it, or
// type the name and <C-x><C-o> to complete it). Then replace the stub so it
// returns { status: 201, body: addNote(input) };
// @vimple:anchor 04
```

You read it, do the edit, then save & quit Vim. vimple grades it for you; on
success the block disappears and the next task's block appears in its file. The
graders ignore these markers, so they never get in your way.

## First-run setup: your Vim, or batteries included

The first `./vimple` asks how you want to edit:

1. **Your own Vim/Neovim** — you bring the LSP, fuzzy finder, etc.
2. **Turnkey** — a bundled, dependency-free Neovim config (`config/turnkey/`)
   that wires Neovim's built-in LSP to `typescript-language-server`, so
   jump-to-def, auto-import, completion, rename and diagnostics work out of the
   box. (Needs `nvim` and `typescript-language-server` on your PATH; `./vimple
   doctor` tells you what's missing.)

Override anytime with env vars:

- `VIMPLE_EDITOR` — `vim`, `nvim`, or a full path (default `$EDITOR`, else `vim`).
- `VIMPLE_CONFIG` — a config **file** (loaded with `-u`) or a config **dir**
  (loaded via `XDG_CONFIG_HOME`). Default: your normal config.

## Make it yours

This is a template — fork or "Use this template", then point the remote at your
own repo. Your progress lives in `.vimple-state` (gitignored).

If you've remapped keys, edit `keymap.json` once so the in-buffer instructions
reference *your* keys instead of the defaults.

## What you build

A mini notes API: `src/server.ts` wires routes → handlers → services → models,
with real imports across files and a tiny in-repo HTTP layer (`src/lib/http.ts`)
so every jump-to-definition lands in your own code. See `AGENTS.md` for the repo
contract and how to add tasks.

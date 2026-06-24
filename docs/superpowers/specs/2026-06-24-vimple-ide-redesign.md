# vimple — IDE-in-a-Codebase Redesign

**Date:** 2026-06-24
**Status:** Draft (pending user review)
**Supersedes:** `docs/superpowers/specs/2026-06-23-vimple-design.md` (full rewrite)

## One-liner

`vimple` is a clone-and-own template repo that teaches you to use **Vim as an
IDE inside a realistic company codebase**. You work in a small but believable
**TypeScript web API** and progress through a ladder of tasks, each teaching one
IDE-grade Vim skill. The instructions live **as comment blocks inside the actual
source file**, personalized to *your* keymap. One command starts or resumes you.
The end artifact is a working, type-checking, tested web API you built entirely
in Vim.

## What changed from the previous design

| Before (2026-06-23) | After (this rewrite) |
|---------------------|----------------------|
| Toy single-file todo CLI | Realistic multi-module TS web API |
| Instructions in `lesson.txt`, printed to terminal | Instructions injected into the real source buffer as comments |
| "No server concepts" non-goal | Server concepts allowed (it's a web API) |
| Static lessons, runner reads only | Runner mutates source: expands/collapses task markers |

## Goals

- Learn Vim **as an IDE** — navigation, jump-to-definition, auto-import,
  completion, project-wide search, symbol rename, multi-file edits — by doing
  real work in a real-feeling codebase.
- Instructions live in the buffer, in the real file, personalized to your keys.
- One command to start or pick up exactly where you left off.
- Practice on **your own** editor/keybindings, or a shipped turnkey IDE config —
  the installer asks.
- Clone-and-own: your progress stays out of committed history.
- A tangible end artifact: a working, tested, type-checking web API.

## Non-goals (YAGNI)

- No reverse-detection of arbitrary keybindings — you edit `keymap.json` once.
- No AST / TS-compiler-API marker placement — plain text anchors only.
- Not a general Vim reference; it is a guided build.
- The learner never has to author the grading tests; they are pre-written.

## The codebase

A mini HTTP API (Fastify-style, kept dependency-light) — e.g. a "notes" service.
Big enough to *need* jump-to-definition, auto-import, project-wide search, and
multi-file edits; small enough to hold in your head. It ships partially stubbed
and grows as you complete tasks.

```
src/
├── server.ts            # wires routes, starts the app
├── routes/
│   ├── notes.ts         # route definitions
│   └── health.ts
├── handlers/
│   └── notes.ts         # request handlers (thin)
├── services/
│   └── notes.ts         # business logic (the meat you edit)
├── models/
│   └── note.ts          # types + factory
└── lib/
    ├── ids.ts           # id helper
    └── validation.ts
```

## Task & marker mechanics (Approach A: anchor-comment injection)

- The base codebase ships with tiny static **anchors** at each task's work site:

  ```ts
  // @vimple:anchor 04
  ```

- `./vimple` (start/resume) finds the current task's anchor and **expands it in
  place** into a full instruction comment block, resolved against the learner's
  `keymap.json`:

  ```ts
  // ┌─ vimple task 04 · auto-import & completion ──────────────
  // │ The handler needs `createNote` from ../services/notes.
  // │ Add the import (try your auto-import / completion), then
  // │ call it. Motions: {jump_to_def}=gd  {omni_complete}=<C-x><C-o>
  // └──────────────────────────────────────────────────────────
  // @vimple:anchor 04
  ```

- The learner opens Vim **at repo root and navigates** to the file themselves
  (finding the file via `:find` / fuzzy-finder is part of the skill). A one-line
  hint names the file. They perform the edit.
- `./vimple check`: on green, the runner **collapses** the block back to
  `// @vimple:done 04`, advances state, and expands the next anchor. On red, it
  shows expected-vs-actual.
- Markers are **auto-ignored by the tests** via a shared `stripVimple(src)`
  helper, and they live on their own comment lines so they never corrupt the
  learner's code. Injection is **idempotent** — re-running `./vimple` will not
  double-inject.

## Runner, commands & state

A bash shim `./vimple` delegates to `src/runner/*.ts` via `tsx` (same pattern as
today).

- `./vimple` — **the one command.** First run: setup wizard (see below).
  Otherwise: ensure the current anchor is expanded, print a one-line file hint +
  progress, open the editor at repo root.
- `./vimple check` — type-check + run the current task's hidden test; green
  advances, red shows the diff.
- `./vimple status` — `chapter / task N of M` plus a progress bar.
- `./vimple reset [n]` — back to task 1, or to task `n` (re-collapses later
  anchors and re-expands the target).
- `./vimple doctor` — re-run the environment check.

**State:** `.vimple-state` (gitignored) holds the current task index, the chosen
editor mode (own / turnkey), and which anchors are currently expanded — so
resume is exact and a personalized clone stays free of progress noise.

## Configuration

- `VIMPLE_EDITOR` — editor binary (`vim`, `nvim`, full path). Default `$EDITOR`,
  else `vim`.
- `VIMPLE_CONFIG` — config **file** (`-u <file>`) or **dir** (`XDG_CONFIG_HOME` /
  `MYVIMRC`). Default: the learner's normal config.
- `keymap.json` — maps semantic actions → keys (ships with vanilla defaults).
  Single source of truth for instruction-comment templating. Remappers edit it
  once.

## First-run setup wizard & tooling

On first `./vimple`, an interactive prompt asks: **bring your own Vim, or use the
shipped turnkey IDE config?**

- *Own:* respects `VIMPLE_EDITOR` / `VIMPLE_CONFIG`. The learner supplies
  LSP / finder.
- *Turnkey:* loads a bundled minimal Neovim/Vim config
  (typescript-language-server + a fuzzy finder) via `-u` / `XDG_CONFIG_HOME`, so
  vanilla users get the full IDE feel.

Either way it runs `doctor` (node, tsserver, vim/nvim version, LSP reachable) and
reports problems before the learner starts. The choice is saved in
`.vimple-state`.

## Curriculum (IDE-grade ladder)

Each task = one skill via one fully-specified edit; later tasks span files and
build real endpoints.

1. **Orientation & navigation** — open the project, `:find` / fuzzy-find, file
   tree, `gd` jump-to-definition.
2. **Word / line motions** — fix a typo in a handler string.
3. **Change operators & text objects** — `ciw`, `ci"`, `ci(` on a route path /
   config.
4. **Auto-import & completion** — wire a service into a handler using LSP
   auto-import + omni-complete.
5. **LSP rename** — rename a symbol across files (`models` → `routes`).
6. **Project search & quickfix** — `:grep` / `:vimgrep`, `:cdo` / `:cfdo` to
   apply a change across matches.
7. **Counts & combos** — `3dd`, `2cw` on repetitive route blocks.
8. **Macros** — record / replay an edit across several handlers.
9. **Multi-file feature** — implement a new endpoint end-to-end (route + handler
   + service + type), using marks / jumps.
10. **Fix the build** — resolve the remaining type / diagnostic errors so `tsc`
    is clean and the suite is green.

## Verification & testing

- **Per-task grading:** each task has a hidden `check.test.ts` (vitest). Because
  it is TS, the learner's code must compile and run to pass — so "hidden tests
  only" still enforces a real build.
- **Tool's own tests:** a small suite for the runner's pure logic — keymap
  template resolution, anchor expand / collapse / strip idempotency, state
  advancement, `reset`.
- **CI:** runs the canonical "solution" edits (`scripts/solve.ts`) to prove
  every task is completable end-to-end, then `npm test`.

## Repo layout

```
vimple/
├── README.md              # what it is, quickstart, make-it-your-own
├── AGENTS.md              # contributor + LLM dev guide (repo contract)
├── vimple                 # bash shim → src/runner via tsx (executable)
├── keymap.json            # semantic action -> your key (vanilla defaults)
├── package.json           # the TS web API project + runner deps
├── tsconfig.json
├── src/                   # the web API you build up (routes/handlers/services/...)
├── src/runner/            # the runner: state, keymap, markers, editor, check, cli
├── config/turnkey/        # bundled opt-in IDE config (LSP + finder)
├── tasks/
│   ├── 01-navigation/
│   │   ├── task.ts        # instruction-block template (templated vs keymap.json)
│   │   └── check.test.ts  # hidden grader
│   └── ...
├── scripts/solve.ts       # canonical solution edits (CI completability proof)
├── .vimple-state          # current task, editor mode, expanded anchors (gitignored)
└── .gitignore
```

## End result

A working, tested, type-checking TypeScript web API the learner built entirely in
Vim using IDE-grade workflows — plus a personalized `keymap.json` — a real
artifact, not just practice.
</content>
</invoke>

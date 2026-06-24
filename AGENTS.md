# Contributor & LLM guide

vimple teaches you to use **Vim as an IDE** by doing real work in a small
TypeScript web API (a "notes" service). Each task teaches one IDE-grade Vim skill;
the instructions live **in the buffer**, injected as comment blocks personalized
to your keymap. This file is the contract for extending it.

## Layout

- `vimple` — bash launcher → `src/runner/cli.ts` via tsx.
- `src/runner/*` — runner logic, one responsibility per file:
  - `state.ts` — `.vimple-state` (JSON: `taskIndex`, `editorMode`, `setupDone`).
  - `keymap.ts` — load `keymap.json`; resolve `{action}` tokens.
  - `markers.ts` — anchor injection: `expand` / `collapse` / `reanchor` /
    `stripVimple` (all idempotent, pure string transforms).
  - `tasks.ts` — load `tasks/NN-*/task.ts` metadata.
  - `editor.ts` — launch the editor (own config or turnkey).
  - `check.ts` — run a task's grader + `tsc --noEmit`.
  - `doctor.ts` / `setup.ts` — environment check + first-run wizard.
  - `cli.ts` — command dispatch.
- `src/{server,routes,handlers,services,models,lib}/*` — the web API you build up.
  It ships partially stubbed and **compiles at its start state**.
- `tasks/NN-name/` — `task.ts` (instruction template + canonical `solutions`) and
  `check.test.ts` (hidden grader).
- `config/turnkey/nvim/init.lua` — the opt-in batteries-included IDE config.
- `tests/` — runner unit tests. `scripts/solve.ts` — the completability solver.
- `.vimple-state` — progress (gitignored).

## How instructions get into the buffer (Approach A)

Each task site in `src/` is marked with a single anchor line, e.g. `// @vimple:anchor 04`.

- `./vimple` **expands** the current task's anchor: it inserts the instruction
  block (resolved against `keymap.json`) directly above the anchor, wrapped in
  `// @vimple:begin NN` … `// @vimple:end NN`. Idempotent. Then it opens Vim, and
  **when you quit Vim it runs the grader automatically** — no second command.
- On green the runner **collapses** the block and rewrites the anchor to
  `// @vimple:done NN`, advances, and expands the next task in the same session.
  (`./vimple check` does the same grade non-interactively, e.g. for CI.)
- `./vimple reset [n]` **re-anchors** tasks `≥ n` (drops blocks, `done` → `anchor`)
  so they can be done again. It does not revert your code edits.
- Tests never see markers: read source through `stripVimple()` (see
  `tasks/10-fix-the-build/check.test.ts`).

## Adding a task

1. Pick the next numeric prefix: `tasks/NN-name/`.
2. Add a `// @vimple:anchor NN` line at the exact work site in the relevant
   `src/` file. Keep the start state compiling (use a type-correct stub, or
   silence an intentional error with `// @ts-expect-error` if the task is to fix
   it).
3. `task.ts` — default-export a `Task` (see `src/runner/tasks.ts`):
   - `file` is the file containing the anchor (drives the hint + injection site).
   - `instruction` is plain text with `{action}` tokens from `keymap.json`
     (unknown actions throw at render).
   - `solutions` maps repo-relative paths → pure `(src) => src` transforms that
     produce the finished code. These power the solver/CI.
4. `check.test.ts` — a vitest grader that passes only when the edit is correct.
   Prefer asserting behavior via imports from `src/*`; keep it independent of
   other tasks so completing one never breaks another's check.
5. Add any new `{action}` to `keymap.json`.

## Commands

`./vimple` (start/resume) · `check` · `status` · `reset [n]` · `doctor`.

## Test & CI

- `npm run typecheck` — the product (`src` only) compiles at the start state.
  Task/runner test files are validated by running them, not by `tsc`.
- `npm test` — runner unit tests (`tests/**`): markers idempotency, keymap, state.
- `npm run solve` — applies every task's `solutions`, runs the full task suite,
  and type-checks the solved tree. Proves end-to-end completability. **Running it
  locally rewrites `src/`** — restore with `git checkout -- src tasks`.
- CI runs typecheck → unit tests → solve.
- The runner's `check` relies on `tasks/**/check.test.ts` staying in
  `vitest.config.ts`'s `include` globs — do not remove it.

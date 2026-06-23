# Contributor & LLM guide

vimple teaches Vim by having a learner build a tiny TS todo CLI through graded
lessons. This file is the contract for extending it.

## Layout

- `vimple` — bash launcher → `src/runner/cli.ts` via tsx.
- `src/runner/*` — runner logic, one responsibility per file (keymap, state,
  lessons, render, editor, check, cli). Tested in `tests/`.
- `src/todo.ts`, `src/cli.ts` — the learner-facing project (the thing being built).
- `lessons/NN-name/` — `lesson.txt` (plain text, templated) + `check.test.ts` (grader).
- `.vimple-state` — current 0-based lesson index (gitignored).

## Adding a lesson

1. Create `lessons/NN-name/` with the next numeric prefix.
2. `lesson.txt`: **plain text only**, no markdown. Reference keys via `{action}`
   placeholders (keys defined in `keymap.json`); unknown actions throw at render.
3. State the **exact** target text — learners never reason about TS.
4. `check.test.ts`: a Vitest test that passes only when the target edit exists.
   Either import from `src/*` and assert behavior, or read the source file and
   assert on its text.
5. Add the action to `keymap.json` if you use a new `{placeholder}`.
6. Update the solved source in `scripts/solve.ts` so `tests/completability.test.ts`
   stays green.

## Commands

`./vimple` (show) · `edit` · `check` · `status` · `reset [n]`.

## Test

- `npm test` — runner-logic tests plus the completability keystone (everything under
  `tests/`). The keystone applies the canonical solutions from `scripts/solve.ts` and
  runs every lesson check against them, so a lesson whose stated target can't satisfy
  its grader fails here. Green on a clean checkout.
- `npm run test:lessons` — runs the lesson graders (`lessons/**/check.test.ts`) directly
  against the working tree. On an unsolved repo these are red by design and go green as a
  learner completes each lesson; this is also what `./vimple check` runs for the current
  lesson. (The runner's `runCheck` relies on `lessons/**/check.test.ts` staying in
  `vitest.config.ts`'s `include` globs — do not remove it.)

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
6. Add the solved source to `scripts/solve.ts` so `tests/completability.test.ts`
   stays green.

## Commands

`./vimple` (show) · `edit` · `check` · `status` · `reset [n]`.

## Tests

The lesson checks under `lessons/**/check.test.ts` are **graders**: they are red
until a learner solves the corresponding lesson, so they are NOT part of the default
test run.

- `npm test` → runs `tests/**` only: the runner-logic suites PLUS
  `tests/completability.test.ts`, the keystone that applies every lesson's canonical
  solution (from `scripts/solve.ts`) in a temp copy and asserts all lesson checks pass.
  This stays green on the shipped (unsolved) repo, so CI uses it.
- `npm run test:lessons` → runs the raw lesson checks under `lessons/**`; expect these
  red until solved.
- `vitest.config.ts` keeps `lessons/**/check.test.ts` in its `include` globs because the
  runner's `check.ts` shells out to vitest for a single lesson's grader — don't remove it.

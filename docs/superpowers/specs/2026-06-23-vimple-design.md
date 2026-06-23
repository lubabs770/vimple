# vimple — Design Spec

**Date:** 2026-06-23
**Status:** Approved (pending spec review)

## One-liner

`vimple` (Vim + simple) is a template repo you clone and make your own. You learn
Vim **progressively** by building a **dead-simple TypeScript CLI todo app**, one
fully-specified edit at a time. The code is never the puzzle — every lesson states
the exact target text — so all effort goes to performing the edit efficiently in
Vim. The end result is a real, working, tested CLI you authored entirely in Vim,
plus a `keymap.json` documenting your own keymap.

## Goals

- Learn Vim by doing, terminal-first, with zero TypeScript reasoning required.
- Produce a tangible end artifact (a working, tested TS todo CLI), not just practice.
- Progressive curriculum from basics → macros/multi-file edits.
- Practice on **your own** editor and keybindings (Vim or Neovim, vanilla or remapped).
- "Clone and make it your own": git-init it, your progress stays out of committed history.

## Non-goals (YAGNI)

- No markdown lesson content (terminal-first; markdown renders ugly in a terminal).
- No reverse-lookup magic to auto-detect arbitrary keybindings.
- No browser/UI/server concepts — pure plain-text editing only.
- The learner never writes or reads TS logic; tests are pre-written graders.

## Repo layout

```
vimple/
├── README.md              # what it is, quickstart, how to make it your own
├── AGENTS.md              # contributor + LLM dev guide (repo contract, how to add lessons)
├── vimple                 # the runner script (bash, executable)
├── keymap.json            # semantic action -> your key (ships with vanilla defaults)
├── package.json           # the TS CLI project (deps: typescript, tsx, vitest)
├── tsconfig.json
├── src/                   # the CLI you build up, lesson by lesson (add/list/done/rm)
│   └── ...                # starts as stubs, grows as you progress
├── lessons/
│   ├── 01-basics/
│   │   ├── lesson.txt     # plain-text, ANSI-styled, templated against keymap.json
│   │   └── check.test.ts  # Vitest test; passes only when the target edit is correct
│   ├── 02-word-motions/
│   └── ...
├── .vimple-state          # current lesson index (gitignored)
└── .gitignore
```

## Lesson anatomy

Each lesson is a folder under `lessons/NN-name/` with two files:

- **`lesson.txt`** — plain text, no markdown. Rendered to the terminal by the runner
  with light ANSI styling (bold/color only). Contains: the Vim skill being taught,
  a one-line explanation, which file to open, and the **exact** edit to perform,
  stated unambiguously. Instruction text is **templated** against the learner's
  keymap, e.g.:

  ```
  {end_of_word} jumps to the end of a word. Use it to land on the typo,
  then {change_word} to fix it so the line reads exactly:
      const title = task.title;
  ```

  The runner resolves `{end_of_word}` → the learner's key (default `e`, or their
  override) before printing.

- **`check.test.ts`** — a pre-written Vitest test that passes only when the target
  code exists. The learner never authors TS; the test is the grader. The full set
  of lesson checks is also the project's own test suite.

## The learning loop

The learner does the navigating — opening and finding files is itself a Vim skill,
so the runner never opens the target file for you.

1. `./vimple` shows the current `lesson.txt`, resolved against `keymap.json`.
2. The learner opens the target file in **their** Vim (per the config env vars) and
   makes the edit. Early lessons explicitly teach `:e` / `:find` / the learner's own
   fuzzy-finder.
3. `./vimple check` runs the current lesson's `check.test.ts`.
4. **Green** → "✓ Lesson complete", advance the state pointer. **Red** → show the
   failure (expected vs. actual), let the learner retry.

Finishing all lessons ⇒ a fully passing test suite on a working CLI.

## Configuration

**Env vars (sensible defaults):**

- `VIMPLE_EDITOR` — editor binary (`vim`, `nvim`, or full path).
  Default: `$EDITOR`, else `vim`.
- `VIMPLE_CONFIG` — config **file** or **dir**, auto-detected:
  - file → launch with `-u <file>`
  - dir  → set `XDG_CONFIG_HOME` / `MYVIMRC` so a full setup (plugins) loads
  - Default: the learner's normal config.

**`keymap.json`** (repo file, not env) — maps semantic actions → keys, e.g.
`{ "end_of_word": "e", "change_word": "ciw", ... }`. Ships with vanilla Vim
defaults. Remappers edit this one file once; it doubles as a tidy artifact
documenting the learner's own keymap. This is the **single source of truth** for
template resolution (no auto-detection).

**State:** `.vimple-state` (gitignored) holds the current lesson index, keeping a
cloned-and-personalized repo free of progress noise.

## Runner commands (`./vimple`)

- `./vimple` — show the current lesson, resolved against `keymap.json`, plus a hint
  to start editing.
- `./vimple check` — run the current lesson's test; green advances state, red shows
  the failure.
- `./vimple status` — progress (e.g. `4/20`) with a simple bar.
- `./vimple reset [n]` — back to lesson 1, or to lesson `n`.

## Curriculum (progression)

Each lesson teaches one Vim skill via one mechanical, fully-specified edit to the
CLI:

1. File nav & basics — `:e` / `:w`, `h j k l`, save.
2. Word motions — `w b e`, fix a typo.
3. Line ops — `dd`, `o`/`O`, `yy`/`p`.
4. Change / operators — `cw`, `ciw`, `c$`.
5. Text objects — `ci"`, `ci(`, `dit`.
6. Search & replace — `/`, `:s`.
7. Counts & combos — `3dd`, `2dw`.
8. Macros — `qq … q`, `@q` to repeat an edit across lines.
9. Marks / jumps & multi-file edits.

…building the todo CLI (`add`, `list`, `done`, `rm`) up to a fully passing suite.

## Testing the tool itself

Distinct from the lesson checks (which grade the learner), a small Vitest suite
covers the runner's pure logic:

- **keymap resolution** — template `{end_of_word}` → key from `keymap.json`.
- **state advancement** — check pass advances the pointer; `reset` works.

CI runs `npm test` to ensure all lessons are completable end-to-end (the canonical
"solution" edits make every `check.test.ts` pass).

## AGENTS.md (contributor + LLM dev guide)

Markdown (it's a dev/tooling doc, not learner-facing terminal output). Documents:

- repo layout and the lesson contract (`lesson.txt` + `check.test.ts` pair),
- how to add a new lesson,
- the `{action}` keymap-template system and `keymap.json`,
- the runner's commands and state file.

## End result

A working, tested TS todo CLI the learner built entirely in Vim, plus a personalized
`keymap.json` — a real artifact, not just practice.

# vimple

Learn Vim by **building a real, dead-simple TypeScript todo CLI** — one
fully-specified edit at a time, in **your own** editor and keybindings. Clone it,
make it yours, finish the lessons, keep the CLI you built.

## Quickstart

```bash
git clone <your-fork> vimple && cd vimple
npm install
./vimple            # show the current lesson
./vimple edit       # open your Vim at the repo root — you navigate to the file
./vimple check      # grade your edit; pass advances you to the next lesson
./vimple status     # progress
./vimple reset      # start over (reset N jumps to lesson N+1)
```

## Make it yours

This is a template — fork or "Use this template", then `git init`/point the remote
at your own repo. Your progress lives in `.vimple-state` (gitignored), so commits
stay clean.

## Practice on your own setup

- `VIMPLE_EDITOR` — `vim`, `nvim`, or a full path (default `$EDITOR`, else `vim`).
- `VIMPLE_CONFIG` — a config **file** (loaded with `-u`) or a config **dir** (loaded
  via `XDG_CONFIG_HOME`). Default: your normal config.
- `keymap.json` — if you've remapped keys, edit this once so lesson instructions
  reference *your* keys instead of the defaults.

// Anchor-injection markers (Approach A).
//
// Base source files ship with a single anchor line per task site:
//     // @vimple:anchor 04
// `expand` turns that into a full instruction block (resolved against the
// learner's keymap) inserted directly above the anchor, delimited by begin/end
// sentinels. `collapse` removes the block and marks the anchor done. `stripVimple`
// removes every vimple marker so tests never see them. All three are idempotent
// and only ever touch their own comment lines, so they can never corrupt code.

export function pad(id: number): string {
  return String(id).padStart(2, "0");
}

function anchorRe(id: number): RegExp {
  return new RegExp(`^(\\s*)//\\s*@vimple:anchor\\s+0*${id}\\b`);
}
function beginRe(id: number): RegExp {
  return new RegExp(`//\\s*@vimple:begin\\s+0*${id}\\b`);
}
function endRe(id: number): RegExp {
  return new RegExp(`//\\s*@vimple:end\\s+0*${id}\\b`);
}

export function isExpanded(src: string, id: number): boolean {
  return beginRe(id).test(src);
}

/** Insert the instruction block above task `id`'s anchor. No-op if already expanded
 *  or if the anchor is gone. `lines` are plain text (no comment prefix). */
export function expand(src: string, id: number, lines: string[]): string {
  if (isExpanded(src, id)) return src;
  const rows = src.split("\n");
  const re = anchorRe(id);
  const i = rows.findIndex((r) => re.test(r));
  if (i < 0) return src;
  const indent = rows[i]!.match(re)![1] ?? "";
  const block = [
    `${indent}// @vimple:begin ${pad(id)}`,
    ...lines.map((l) => (l.length ? `${indent}// ${l}` : `${indent}//`)),
    `${indent}// @vimple:end ${pad(id)}`,
  ];
  rows.splice(i, 0, ...block);
  return rows.join("\n");
}

/** Remove task `id`'s instruction block and rewrite its anchor to `done`. */
export function collapse(src: string, id: number): string {
  const rows = src.split("\n");
  const out: string[] = [];
  const begin = beginRe(id);
  const end = endRe(id);
  const anchor = anchorRe(id);
  let skipping = false;
  for (const r of rows) {
    if (begin.test(r)) {
      skipping = true;
      continue;
    }
    if (end.test(r)) {
      skipping = false;
      continue;
    }
    if (skipping) continue;
    const m = r.match(anchor);
    if (m) {
      out.push(`${m[1] ?? ""}// @vimple:done ${pad(id)}`);
      continue;
    }
    out.push(r);
  }
  return out.join("\n");
}

/** Re-arm task `id`: drop any instruction block and turn a `done` marker back into
 *  a plain `anchor`, so the task can be started (and re-expanded) again. Used by
 *  `reset`. Idempotent; a pristine anchor is left untouched. */
export function reanchor(src: string, id: number): string {
  const rows = src.split("\n");
  const out: string[] = [];
  const begin = beginRe(id);
  const end = endRe(id);
  const done = new RegExp(`^(\\s*)//\\s*@vimple:done\\s+0*${id}\\b`);
  let skipping = false;
  for (const r of rows) {
    if (begin.test(r)) {
      skipping = true;
      continue;
    }
    if (end.test(r)) {
      skipping = false;
      continue;
    }
    if (skipping) continue;
    const m = r.match(done);
    if (m) {
      out.push(`${m[1] ?? ""}// @vimple:anchor ${pad(id)}`);
      continue;
    }
    out.push(r);
  }
  return out.join("\n");
}

/** Remove every vimple marker (blocks, anchors, done lines) for tests. */
export function stripVimple(src: string): string {
  const rows = src.split("\n");
  const out: string[] = [];
  let skipping = false;
  for (const r of rows) {
    if (/\/\/\s*@vimple:begin\b/.test(r)) {
      skipping = true;
      continue;
    }
    if (/\/\/\s*@vimple:end\b/.test(r)) {
      skipping = false;
      continue;
    }
    if (skipping) continue;
    if (/\/\/\s*@vimple:(anchor|done)\b/.test(r)) continue;
    out.push(r);
  }
  return out.join("\n");
}

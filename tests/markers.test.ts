import { test, expect } from "vitest";
import { expand, collapse, reanchor, stripVimple, isExpanded } from "../src/runner/markers";

const base = ["function f() {", "  // @vimple:anchor 04", "  return 501;", "}"].join("\n");
const lines = ["task 4", "do the thing"];

test("expand inserts a block above the anchor and is idempotent", () => {
  const once = expand(base, 4, lines);
  expect(isExpanded(once, 4)).toBe(true);
  expect(once).toContain("  // task 4");
  expect(once).toContain("  // @vimple:begin 04");
  expect(once).toContain("  // @vimple:anchor 04"); // anchor preserved
  expect(once).toContain("  return 501;"); // code untouched
  expect(expand(once, 4, lines)).toBe(once); // idempotent
});

test("collapse removes the block and marks the anchor done", () => {
  const expanded = expand(base, 4, lines);
  const collapsed = collapse(expanded, 4);
  expect(collapsed).toContain("// @vimple:done 04");
  expect(collapsed).not.toContain("@vimple:begin");
  expect(collapsed).not.toContain("task 4");
  expect(collapsed).toContain("  return 501;");
  expect(collapse(collapsed, 4)).toBe(collapsed); // idempotent
});

test("stripVimple removes every marker and is idempotent", () => {
  const expanded = expand(base, 4, lines);
  const stripped = stripVimple(expanded);
  expect(stripped).not.toContain("@vimple");
  expect(stripped).not.toContain("task 4");
  expect(stripped).toContain("  return 501;");
  expect(stripVimple(stripped)).toBe(stripped);
});

test("reanchor restores a done/expanded task so it can start again", () => {
  // done -> anchor
  const done = collapse(expand(base, 4, lines), 4);
  const rearmed = reanchor(done, 4);
  expect(rearmed).toContain("// @vimple:anchor 04");
  expect(rearmed).not.toContain("@vimple:done");
  // and re-expansion works again after re-arming
  expect(isExpanded(expand(rearmed, 4, lines), 4)).toBe(true);
  // expanded -> anchor (block dropped, anchor kept)
  const fromExpanded = reanchor(expand(base, 4, lines), 4);
  expect(fromExpanded).not.toContain("@vimple:begin");
  expect(fromExpanded).toContain("// @vimple:anchor 04");
  expect(reanchor(base, 4)).toBe(base); // pristine anchor untouched
});

test("expand on a missing anchor is a no-op", () => {
  expect(expand("no anchors here", 4, lines)).toBe("no anchors here");
});

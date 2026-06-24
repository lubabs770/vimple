import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { noteToResponse } from "../../src/handlers/notes";
import { stripVimple } from "../../src/runner/markers";

const here = fileURLToPath(new URL(".", import.meta.url));

test("noteToResponse returns a clean NoteResponse", () => {
  const note = { id: 7, title: "Title", body: "Body", tags: ["a", "b"] };
  expect(noteToResponse(note)).toEqual({ id: 7, title: "Title", tags: ["a", "b"] });
});

test("the @ts-expect-error escape hatch is gone", () => {
  const src = stripVimple(readFileSync(join(here, "../../src/handlers/notes.ts"), "utf8"));
  expect(src.includes("@ts-expect-error")).toBe(false);
});

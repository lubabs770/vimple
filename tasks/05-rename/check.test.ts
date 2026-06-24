import { test, expect, beforeEach } from "vitest";
import { createNote } from "../../src/models/note";
import { addNote, clearNotes } from "../../src/services/notes";
import { resetIds } from "../../src/lib/ids";

beforeEach(() => {
  clearNotes();
  resetIds();
});

test("mkNote was renamed to createNote and used consistently", () => {
  expect(createNote(1, "a", "b", ["x"])).toEqual({ id: 1, title: "a", body: "b", tags: ["x"] });
  // services must still build on the renamed factory:
  expect(addNote({ title: "z", body: "", tags: [] }).title).toBe("z");
});

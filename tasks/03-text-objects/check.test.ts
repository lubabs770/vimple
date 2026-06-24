import { test, expect, beforeEach } from "vitest";
import { buildServer } from "../../src/server";
import { addNote, clearNotes } from "../../src/services/notes";
import { resetIds } from "../../src/lib/ids";

beforeEach(() => {
  clearNotes();
  resetIds();
});

test("GET /notes/:id reaches the handler", async () => {
  addNote({ title: "first", body: "", tags: [] });
  const res = await buildServer().handle("GET", "/notes/1");
  expect(res.status).toBe(200);
});

import { test, expect, beforeEach } from "vitest";
import { buildServer } from "../../src/server";
import { addNote, clearNotes } from "../../src/services/notes";
import { resetIds } from "../../src/lib/ids";

beforeEach(() => {
  clearNotes();
  resetIds();
});

test("GET /search/:query returns case-insensitive title matches", async () => {
  addNote({ title: "Hello World", body: "", tags: [] });
  addNote({ title: "Goodbye", body: "", tags: [] });
  const res = await buildServer().handle("GET", "/search/hello");
  expect(res.status).toBe(200);
  const body = res.body as Array<{ title: string }>;
  expect(body.map((n) => n.title)).toEqual(["Hello World"]);
});

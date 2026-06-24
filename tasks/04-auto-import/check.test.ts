import { test, expect, beforeEach } from "vitest";
import { buildServer } from "../../src/server";
import { clearNotes } from "../../src/services/notes";
import { resetIds } from "../../src/lib/ids";

beforeEach(() => {
  clearNotes();
  resetIds();
});

test("POST /notes creates and returns the note", async () => {
  const res = await buildServer().handle("POST", "/notes", { title: "buy milk", body: "" });
  expect(res.status).toBe(201);
  expect((res.body as { title: string }).title).toBe("buy milk");
});

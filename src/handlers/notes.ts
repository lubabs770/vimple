// Request handlers. Thin: parse input, call the service, shape the response.
import type { Req, Res } from "../lib/http";
import { getNote, listNotes, searchNotes } from "../services/notes";
import { parseNoteInput } from "../lib/validation";
import type { Note, NoteResponse } from "../models/note";

export function listHandler(): Res {
  return { status: 200, body: listNotes() };
}

export function getHandler(req: Req): Res {
  const id = Number(req.params.id);
  const note = getNote(id);
  if (!note) return { status: 404, body: { error: "not found" } };
  return { status: 200, body: noteToResponse(note) };
}

export function createHandler(req: Req): Res {
  const input = parseNoteInput(req.body);
  if (!input) return { status: 400, body: { error: "invalid note" } };
  // @vimple:anchor 04
  // task 4: persist `input` via the service, then return the new note (status 201).
  return { status: 501, body: { error: "not implemented" } };
}

export function searchHandler(req: Req): Res {
  const notes = searchNotes(req.params.query ?? "");
  return { status: 200, body: notes };
}

// @vimple:anchor 10
export function noteToResponse(note: Note): NoteResponse {
  // @ts-expect-error task 10: the return shape is wrong — make it match NoteResponse.
  return { id: note.id, name: note.title };
}

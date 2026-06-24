// Business logic + the in-memory note store. This is the "meat" of the service.
import { nextId } from "../lib/ids";
import { mkNote, type Note } from "../models/note";
import type { NoteInput } from "../lib/validation";

// One of three places the schema version literal appears (see task 6).
export const SCHEMA_VERSION = "v0";

const store = new Map<number, Note>();

export function clearNotes(): void {
  store.clear();
}

export function listNotes(): Note[] {
  return [...store.values()];
}

export function getNote(id: number): Note | undefined {
  return store.get(id);
}

export function addNote(input: NoteInput): Note {
  const note = mkNote(nextId(), input.title, input.body, input.tags);
  store.set(note.id, note);
  return note;
}

// @vimple:anchor 07
export const DEFAULT_TAGS: string[] = [
  "inbox",
  "todo",
  "later",
  "scratch",
  "temp",
];

// @vimple:anchor 08
export const ACTIONS: string[] = [
  "create",
  "read",
  "update",
  "remove",
];

// TODO(9): make this return notes whose title contains `query` (case-insensitive).
export function searchNotes(query: string): Note[] {
  void query;
  return [];
}

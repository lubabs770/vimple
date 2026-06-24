// Request-body validation for notes.
export type NoteInput = {
  title: string;
  body: string;
  tags: string[];
};

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function parseNoteInput(data: unknown): NoteInput | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  if (!isNonEmptyString(d.title)) return null;
  const body = typeof d.body === "string" ? d.body : "";
  const tags = Array.isArray(d.tags)
    ? d.tags.filter((t): t is string => typeof t === "string")
    : [];
  return { title: d.title, body, tags };
}

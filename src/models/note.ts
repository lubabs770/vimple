// The Note domain model and the response shape the API returns.
export type Note = {
  id: number;
  title: string;
  body: string;
  tags: string[];
};

export type NoteResponse = {
  id: number;
  title: string;
  tags: string[];
};

// @vimple:anchor 05
export function mkNote(
  id: number,
  title: string,
  body: string,
  tags: string[] = [],
): Note {
  return { id, title, body, tags };
}

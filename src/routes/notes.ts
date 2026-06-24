import type { App } from "../lib/http";
import {
  listHandler,
  getHandler,
  createHandler,
  searchHandler,
} from "../handlers/notes";

export function registerNoteRoutes(app: App): void {
  app.get("/notes", listHandler);
  app.post("/notes", createHandler);
  // @vimple:anchor 03
  app.get("/notez/:id", getHandler);
  // @vimple:anchor 09
  // task 9: register `GET /search/:query` -> searchHandler here, and implement
  // searchNotes() in services/notes.ts so the endpoint actually returns matches.
  void searchHandler;
}

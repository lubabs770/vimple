import { createApp, type App } from "./lib/http";
import { registerNoteRoutes } from "./routes/notes";
import { registerHealthRoutes } from "./routes/health";

// @vimple:anchor 01
export const API_NAME = "CHANGEME";

// @vimple:anchor 06
export const API_VERSION = "v0";

export function buildServer(): App {
  const app = createApp();
  registerHealthRoutes(app);
  registerNoteRoutes(app);
  return app;
}

export function start(port = 3000): void {
  buildServer();
  console.log(`${API_NAME} ${API_VERSION} listening on :${port}`);
}

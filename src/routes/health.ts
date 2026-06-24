import type { App } from "../lib/http";

export function registerHealthRoutes(app: App): void {
  // @vimple:anchor 02
  app.get("/health", () => ({
    status: 200,
    body: { status: "ok", service: "notez-api", version: "v0" },
  }));
}

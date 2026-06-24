import { test, expect } from "vitest";
import { buildServer } from "../../src/server";

test("/health reports the correct service name", async () => {
  const res = await buildServer().handle("GET", "/health");
  expect((res.body as { service: string }).service).toBe("notes-api");
});

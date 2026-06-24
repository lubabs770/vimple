import { test, expect } from "vitest";
import { API_VERSION, buildServer } from "../../src/server";
import { SCHEMA_VERSION } from "../../src/services/notes";

test("every v0 literal became v1", async () => {
  expect(API_VERSION).toBe("v1");
  expect(SCHEMA_VERSION).toBe("v1");
  const res = await buildServer().handle("GET", "/health");
  expect((res.body as { version: string }).version).toBe("v1");
});

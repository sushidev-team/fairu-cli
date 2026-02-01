import { describe, test, expect, vi } from "vitest";
import React from "react";
import { HealthCheck } from "../commands/health.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

describe("HealthCheck", () => {
  test("renders health check result", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuHealthCheck: { status: "OK", version: "2.0.0" },
    });
    const { lastFrame } = renderWithClient(<HealthCheck />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Health Check");
    expect(output).toContain("OK");
    expect(output).toContain("2.0.0");
  });

  test("shows error when API unreachable", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuHealthCheck: null });
    const { lastFrame } = renderWithClient(<HealthCheck />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Could not reach");
  });
});

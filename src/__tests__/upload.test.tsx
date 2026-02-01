import { describe, test, expect, vi, beforeEach } from "vitest";
import React from "react";
import { Upload } from "../commands/upload.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
  return {
    ...actual,
    existsSync: vi.fn((path: string) => {
      if (typeof path === "string" && path.includes("test-file.jpg"))
        return true;
      if (typeof path === "string" && path.includes("nonexistent"))
        return false;
      return actual.existsSync(path);
    }),
    readFileSync: vi.fn((path: unknown, ...args: any[]) => {
      if (typeof path === "string" && path.includes("test-file.jpg")) {
        return Buffer.from("fake image data");
      }
      return (actual.readFileSync as any)(path, ...args);
    }),
  };
});

describe("Upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows success after upload completes", async () => {
    const client = createMockClient();
    client.upload.simple.mockResolvedValue({
      id: "uploaded-1",
      url: "https://files.fairu.app/uploaded-1",
    });
    const { lastFrame } = renderWithClient(
      <Upload filePath="/path/to/test-file.jpg" flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Upload complete");
    expect(output).toContain("uploaded-1");
  });

  test("shows error for nonexistent file", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <Upload filePath="/path/to/nonexistent.jpg" flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("File not found");
  });

  test("shows error when no file path provided", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <Upload filePath="" flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("File path is required");
  });
});

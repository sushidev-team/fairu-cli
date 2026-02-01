import { describe, test, expect, vi } from "vitest";
import React from "react";
import {
  PdfSignatureCreate,
  PdfSignatureStart,
  PdfSignatureCancel,
  FileAccessSign,
} from "../commands/signatures.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

describe("PdfSignatureCreate", () => {
  test("creates PDF signature request", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuPdfSignatureRequest: {
        id: "sig-1",
        status: "pending",
        config_url: "https://example.com/config",
      },
    });
    const { lastFrame } = renderWithClient(
      <PdfSignatureCreate flags={{ "file-id": "file-1", emails: "a@b.com,c@d.com" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("created successfully");
    expect(output).toContain("sig-1");
    expect(output).toContain("pending");
  });

  test("shows error when file-id missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <PdfSignatureCreate flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("--file-id is required");
  });
});

describe("PdfSignatureStart", () => {
  test("starts PDF signature request", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      startFairuPdfSignatureRequest: { id: "sig-1", status: "started" },
    });
    const { lastFrame } = renderWithClient(
      <PdfSignatureStart id="sig-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("started");
  });
});

describe("PdfSignatureCancel", () => {
  test("cancels PDF signature request", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <PdfSignatureCancel id="sig-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("cancelled");
  });
});

describe("FileAccessSign", () => {
  test("creates file access signatures", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuFileAccessSignature: [
        { file_id: "f-1", signature: "abc123", expires_at: "2024-12-31T23:59:59Z" },
        { file_id: "f-2", signature: "def456", expires_at: "2024-12-31T23:59:59Z" },
      ],
    });
    const { lastFrame } = renderWithClient(
      <FileAccessSign flags={{ ids: "f-1,f-2", "valid-for": "60" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("File Access Signatures");
    expect(output).toContain("f-1");
    expect(output).toContain("abc123");
  });

  test("shows error when ids missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <FileAccessSign flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("--ids is required");
  });
});

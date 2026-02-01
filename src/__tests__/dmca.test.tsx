import { describe, test, expect, vi } from "vitest";
import React from "react";
import { DmcaList, DmcaGet, DmcaCreate, DmcaUpdate } from "../commands/dmca.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockDmcas = [
  { id: "dmca-1", name: "John", email: "john@example.com", status: "open" },
  { id: "dmca-2", name: "Jane", email: "jane@example.com", status: "closed" },
];

describe("DmcaList", () => {
  test("renders list of DMCA complaints", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuDmcas: {
        data: mockDmcas,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(<DmcaList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("John");
    expect(output).toContain("Jane");
    expect(output).toContain("DMCA Complaints");
  });

  test("shows empty message", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuDmcas: { data: [], paginatorInfo: null },
    });
    const { lastFrame } = renderWithClient(<DmcaList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("No DMCA complaints found");
  });
});

describe("DmcaGet", () => {
  test("renders DMCA details", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuDmca: {
        id: "dmca-1",
        name: "John",
        email: "john@example.com",
        status: "open",
        reply: "Noted",
        reply_send: true,
      },
    });
    const { lastFrame } = renderWithClient(<DmcaGet id="dmca-1" />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("DMCA Details");
    expect(output).toContain("dmca-1");
    expect(output).toContain("John");
    expect(output).toContain("open");
  });

  test("shows not found", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuDmca: null });
    const { lastFrame } = renderWithClient(<DmcaGet id="unknown" />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("DmcaCreate", () => {
  test("submits DMCA complaint", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <DmcaCreate flags={{ name: "John", email: "john@example.com", url: "https://example.com/file" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("submitted");
  });

  test("shows error when fields missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <DmcaCreate flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("required");
  });
});

describe("DmcaUpdate", () => {
  test("updates DMCA and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      updateFairuDmcaComplain: { id: "dmca-1" },
    });
    const { lastFrame } = renderWithClient(
      <DmcaUpdate id="dmca-1" flags={{ reply: "Handled" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("updated");
  });
});

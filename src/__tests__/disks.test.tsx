import { describe, test, expect, vi } from "vitest";
import React from "react";
import {
  DiskList,
  DiskGet,
  DiskStatus,
  DiskCreate,
  DiskUpdate,
  DiskDelete,
} from "../commands/disks.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockDisks = [
  {
    id: "disk-1",
    name: "Primary",
    type: "s3",
    active: true,
    healthy: true,
    syncing: false,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "disk-2",
    name: "Backup",
    type: "ftp",
    active: false,
    healthy: false,
    syncing: true,
    createdAt: "2024-02-20T12:00:00Z",
  },
];

describe("DiskList", () => {
  test("renders list of disks", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuDisks: {
        data: mockDisks,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(<DiskList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Primary");
    expect(output).toContain("Backup");
    expect(output).toContain("Disks");
  });

  test("shows empty message", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuDisks: { data: [], paginatorInfo: null },
    });
    const { lastFrame } = renderWithClient(<DiskList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("No disks found");
  });
});

describe("DiskGet", () => {
  test("renders disk details", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuDisk: {
        id: "disk-1",
        name: "Primary",
        type: "s3",
        active: true,
        healthy: true,
        syncing: false,
        path: "/uploads",
        pattern: "*",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
    });
    const { lastFrame } = renderWithClient(<DiskGet id="disk-1" />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Disk Details");
    expect(output).toContain("disk-1");
    expect(output).toContain("Primary");
    expect(output).toContain("s3");
  });

  test("shows not found", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuDisk: null });
    const { lastFrame } = renderWithClient(<DiskGet id="unknown" />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("DiskStatus", () => {
  test("renders disk status", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuDiskStatus: {
        id: "disk-1",
        syncing: false,
        open: 5,
        pending: 3,
        synced: 100,
        failed: 2,
      },
    });
    const { lastFrame } = renderWithClient(<DiskStatus id="disk-1" />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Disk Status");
    expect(output).toContain("disk-1");
    expect(output).toContain("100");
  });
});

describe("DiskCreate", () => {
  test("creates disk and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuDisk: { id: "disk-new", name: "New Disk", type: "s3" },
    });
    const { lastFrame } = renderWithClient(
      <DiskCreate flags={{ name: "New Disk", type: "s3" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("created successfully");
  });

  test("shows error when name or type missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <DiskCreate flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("--name and --type are required");
  });
});

describe("DiskUpdate", () => {
  test("updates disk and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <DiskUpdate id="disk-1" flags={{ name: "Updated" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("updated");
  });
});

describe("DiskDelete", () => {
  test("deletes disk and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <DiskDelete id="disk-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("deleted");
  });
});

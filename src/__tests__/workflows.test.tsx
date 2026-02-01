import { describe, test, expect, vi } from "vitest";
import React from "react";
import {
  WorkflowList,
  WorkflowGet,
  WorkflowCreate,
  WorkflowUpdate,
  WorkflowDelete,
} from "../commands/workflows.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockWorkflows = [
  { id: "wf-1", name: "Import", type: "disk_sync", active: true, status: "running", createdAt: "2024-01-15T10:00:00Z" },
  { id: "wf-2", name: "Export", type: "export", active: false, status: "idle", createdAt: "2024-02-20T12:00:00Z" },
];

describe("WorkflowList", () => {
  test("renders list of workflows", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuWorkflows: {
        data: mockWorkflows,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(<WorkflowList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Import");
    expect(output).toContain("Export");
    expect(output).toContain("Workflows");
  });

  test("shows empty message", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuWorkflows: { data: [], paginatorInfo: null },
    });
    const { lastFrame } = renderWithClient(<WorkflowList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("No workflows found");
  });
});

describe("WorkflowGet", () => {
  test("renders workflow details", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuWorkflow: {
        id: "wf-1",
        name: "Import",
        type: "disk_sync",
        active: true,
        status: "running",
        has_error: false,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
    });
    const { lastFrame } = renderWithClient(<WorkflowGet id="wf-1" />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Workflow Details");
    expect(output).toContain("wf-1");
    expect(output).toContain("Import");
    expect(output).toContain("running");
  });

  test("shows not found", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuWorkflow: null });
    const { lastFrame } = renderWithClient(<WorkflowGet id="unknown" />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("WorkflowCreate", () => {
  test("creates workflow and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuWorkflow: { id: "wf-new", name: "New Workflow" },
    });
    const { lastFrame } = renderWithClient(
      <WorkflowCreate flags={{ name: "New Workflow", type: "disk_sync" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("created successfully");
  });

  test("shows error when name missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <WorkflowCreate flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("--name is required");
  });
});

describe("WorkflowUpdate", () => {
  test("updates workflow and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <WorkflowUpdate id="wf-1" flags={{ name: "Updated" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("updated");
  });
});

describe("WorkflowDelete", () => {
  test("deletes workflow and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <WorkflowDelete id="wf-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("deleted");
  });
});

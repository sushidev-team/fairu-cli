import { describe, test, expect, vi } from "vitest";
import React from "react";
import { RoleList, RoleGet, RoleCreate, RoleUpdate, RoleDelete } from "../commands/roles.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockRoles = [
  { id: "role-1", name: "Admin", createdAt: "2024-01-15T10:00:00Z" },
  { id: "role-2", name: "Editor", createdAt: "2024-02-20T12:00:00Z" },
];

describe("RoleList", () => {
  test("renders list of roles", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuRoles: {
        data: mockRoles,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(<RoleList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Admin");
    expect(output).toContain("Editor");
    expect(output).toContain("Roles");
  });

  test("shows empty message", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuRoles: { data: [], paginatorInfo: null },
    });
    const { lastFrame } = renderWithClient(<RoleList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("No roles found");
  });
});

describe("RoleGet", () => {
  test("renders role details", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuRole: {
        id: "role-1",
        name: "Admin",
        permissions: ["read", "write"],
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
    });
    const { lastFrame } = renderWithClient(<RoleGet id="role-1" />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Role Details");
    expect(output).toContain("role-1");
    expect(output).toContain("Admin");
    expect(output).toContain("read, write");
  });

  test("shows not found", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuRole: null });
    const { lastFrame } = renderWithClient(<RoleGet id="unknown" />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("RoleCreate", () => {
  test("creates role and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuRole: { id: "role-new", name: "Viewer" },
    });
    const { lastFrame } = renderWithClient(
      <RoleCreate flags={{ name: "Viewer", permissions: "read" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("created successfully");
  });

  test("shows error when name missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <RoleCreate flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("--name is required");
  });
});

describe("RoleUpdate", () => {
  test("updates role and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <RoleUpdate id="role-1" flags={{ name: "Super Admin" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("updated");
  });
});

describe("RoleDelete", () => {
  test("deletes role and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <RoleDelete id="role-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("deleted");
  });
});

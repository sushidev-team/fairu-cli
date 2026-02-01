import { describe, test, expect, vi } from "vitest";
import React from "react";
import { UserList, UserGet, UserInvite, UserDelete } from "../commands/users.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockUsers = [
  { id: "user-1", name: "Alice", email: "alice@example.com", status: "active", owner: true },
  { id: "user-2", name: "Bob", email: "bob@example.com", status: "invited", owner: false },
];

describe("UserList", () => {
  test("renders list of users", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuUsers: {
        data: mockUsers,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(<UserList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Alice");
    expect(output).toContain("Bob");
    expect(output).toContain("Users");
  });

  test("shows empty message", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuUsers: { data: [], paginatorInfo: null },
    });
    const { lastFrame } = renderWithClient(<UserList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("No users found");
  });
});

describe("UserGet", () => {
  test("renders user details", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuUser: mockUsers[0],
    });
    const { lastFrame } = renderWithClient(<UserGet id="user-1" />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("User Details");
    expect(output).toContain("user-1");
    expect(output).toContain("Alice");
    expect(output).toContain("alice@example.com");
  });

  test("shows not found", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuUser: null });
    const { lastFrame } = renderWithClient(<UserGet id="unknown" />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("UserInvite", () => {
  test("invites user and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <UserInvite flags={{ email: "new@example.com", role: "role-1" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("invited successfully");
  });

  test("shows error when fields missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <UserInvite flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("required");
  });
});

describe("UserDelete", () => {
  test("deletes user and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <UserDelete id="user-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("deleted");
  });
});

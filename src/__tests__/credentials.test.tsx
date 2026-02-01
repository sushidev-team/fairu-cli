import { describe, test, expect, vi } from "vitest";
import React from "react";
import {
  CredentialList,
  CredentialCreate,
  CredentialRevoke,
  CredentialDelete,
} from "../commands/credentials.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockCredentials = [
  {
    id: "cred-1",
    name: "Production",
    access_key_id: "AKID123",
    bucket: "my-bucket",
    active: true,
    permissions: ["read", "write"],
    created_at: "2024-01-15T10:00:00Z",
    expires_at: null,
  },
];

describe("CredentialList", () => {
  test("renders list of credentials", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuRakuCredentials: mockCredentials,
    });
    const { lastFrame } = renderWithClient(<CredentialList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Production");
    expect(output).toContain("AKID123");
    expect(output).toContain("Credentials");
  });

  test("shows empty message", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuRakuCredentials: [],
    });
    const { lastFrame } = renderWithClient(<CredentialList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("No credentials found");
  });
});

describe("CredentialCreate", () => {
  test("creates credential and shows secret", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuRakuCredential: {
        id: "cred-new",
        name: "Test",
        access_key_id: "AKID999",
        secret_access_key: "SECRET999",
        bucket: "test-bucket",
        permissions: ["read"],
      },
    });
    const { lastFrame } = renderWithClient(
      <CredentialCreate flags={{ permissions: "read", name: "Test", bucket: "test-bucket" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("created successfully");
    expect(output).toContain("AKID999");
    expect(output).toContain("SECRET999");
  });

  test("shows error when permissions missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <CredentialCreate flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("--permissions is required");
  });
});

describe("CredentialRevoke", () => {
  test("revokes credential and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <CredentialRevoke id="cred-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("revoked");
  });
});

describe("CredentialDelete", () => {
  test("deletes credential and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <CredentialDelete id="cred-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("deleted");
  });
});

import { describe, test, expect, vi } from "vitest";
import React from "react";
import { TenantInfo, TenantCreate, TenantUpdate, TenantDomains } from "../commands/tenant.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

describe("TenantInfo", () => {
  test("renders tenant info", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuTenant: { id: "tenant-1", name: "My Tenant" },
    });
    const { lastFrame } = renderWithClient(<TenantInfo />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Tenant Info");
    expect(output).toContain("tenant-1");
    expect(output).toContain("My Tenant");
  });

  test("shows not available when null", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuTenant: null });
    const { lastFrame } = renderWithClient(<TenantInfo />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("not available");
  });
});

describe("TenantCreate", () => {
  test("creates tenant and shows API key", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuTenant: {
        id: "new-tenant",
        name: "New",
        api_key: "sk-secret-key-123",
        created_at: "2024-01-15T10:00:00Z",
      },
    });
    const { lastFrame } = renderWithClient(
      <TenantCreate flags={{ name: "New" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("created successfully");
    expect(output).toContain("sk-secret-key-123");
  });

  test("shows error when name missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <TenantCreate flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("--name is required");
  });
});

describe("TenantUpdate", () => {
  test("updates tenant and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <TenantUpdate flags={{ name: "Updated Name" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("Tenant updated");
  });
});

describe("TenantDomains", () => {
  test("renders supported domains", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuSupportedDomains: ["fairu.app", "custom.domain.com", "files.example.org"],
    });
    const { lastFrame } = renderWithClient(<TenantDomains />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Supported Domains");
    expect(output).toContain("fairu.app");
    expect(output).toContain("custom.domain.com");
  });

  test("shows empty message when no domains", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuSupportedDomains: [],
    });
    const { lastFrame } = renderWithClient(<TenantDomains />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("No supported domains found");
  });
});

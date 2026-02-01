import { describe, test, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render } from "ink-testing-library";
import { CopyrightList, CopyrightGet } from "../commands/copyrights.js";
import { LicenseList, LicenseGet } from "../commands/licenses.js";
import { HealthCheck } from "../commands/health.js";
import { TenantInfo } from "../commands/tenant.js";
import { HelpCommand } from "../commands/help.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockCopyrights = [
  { id: "cr-1", name: "CC BY 4.0", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "cr-2", name: "All Rights Reserved", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
];

const mockLicenses = [
  { id: "lic-1", name: "Standard", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "lic-2", name: "Extended", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
];

describe("CopyrightList", () => {
  test("renders list of copyrights", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuCopyrights: {
        data: mockCopyrights,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(
      <CopyrightList flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("CC BY 4.0");
    expect(output).toContain("All Rights Reserved");
  });
});

describe("CopyrightGet", () => {
  test("renders copyright details", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuCopyright: mockCopyrights[0] });
    const { lastFrame } = renderWithClient(
      <CopyrightGet id="cr-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Copyright Details");
    expect(output).toContain("cr-1");
    expect(output).toContain("CC BY 4.0");
  });

  test("shows not found for unknown id", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuCopyright: null });
    const { lastFrame } = renderWithClient(
      <CopyrightGet id="unknown" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("LicenseList", () => {
  test("renders list of licenses", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuLicenses: {
        data: mockLicenses,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(
      <LicenseList flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Standard");
    expect(output).toContain("Extended");
  });
});

describe("LicenseGet", () => {
  test("renders license details", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuLicense: mockLicenses[0] });
    const { lastFrame } = renderWithClient(
      <LicenseGet id="lic-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("License Details");
    expect(output).toContain("lic-1");
    expect(output).toContain("Standard");
  });

  test("shows not found for unknown id", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuLicense: null });
    const { lastFrame } = renderWithClient(
      <LicenseGet id="unknown" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("HealthCheck", () => {
  test("renders health status", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuHealthCheck: { status: "OK", version: "1.2.3" },
    });
    const { lastFrame } = renderWithClient(<HealthCheck />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Health Check");
    expect(output).toContain("OK");
    expect(output).toContain("1.2.3");
  });
});

describe("TenantInfo", () => {
  test("renders tenant information", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuTenant: { id: "tenant-1", name: "My Workspace" },
    });
    const { lastFrame } = renderWithClient(<TenantInfo />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Tenant Info");
    expect(output).toContain("tenant-1");
    expect(output).toContain("My Workspace");
  });
});

describe("HelpCommand", () => {
  test("renders help text with all resources", () => {
    const { lastFrame } = render(<HelpCommand />);
    const output = lastFrame();
    expect(output).toContain("Fairu CLI");
    expect(output).toContain("assets");
    expect(output).toContain("folders");
    expect(output).toContain("galleries");
    expect(output).toContain("copyrights");
    expect(output).toContain("licenses");
    expect(output).toContain("disks");
    expect(output).toContain("dmca");
    expect(output).toContain("roles");
    expect(output).toContain("users");
    expect(output).toContain("workflows");
    expect(output).toContain("credentials");
    expect(output).toContain("signatures");
    expect(output).toContain("upload");
    expect(output).toContain("health");
    expect(output).toContain("tenant");
    expect(output).toContain("config");
  });
});

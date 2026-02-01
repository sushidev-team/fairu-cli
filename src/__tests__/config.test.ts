import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// We need to mock the config path before importing
const TEST_DIR = join(tmpdir(), "fairu-cli-test-" + Date.now());

vi.mock("node:os", async () => {
  const actual = await vi.importActual<typeof import("node:os")>("node:os");
  return {
    ...actual,
    homedir: () => TEST_DIR,
  };
});

// Import after mock setup
const {
  loadConfig,
  saveConfig,
  addTenant,
  removeTenant,
  switchTenant,
  getTenantConfig,
  getConfigPath,
} = await import("../config.js");

describe("config", () => {
  beforeEach(() => {
    if (!existsSync(TEST_DIR)) {
      mkdirSync(TEST_DIR, { recursive: true });
    }
    // Clean up any existing config
    const configDir = join(TEST_DIR, ".fairu");
    if (existsSync(configDir)) {
      rmSync(configDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
  });

  test("loadConfig returns defaults when no config file exists", () => {
    const config = loadConfig();
    expect(config.current).toBe("default");
    expect(config.tenants).toEqual({});
  });

  test("addTenant creates a tenant and makes it current if first", () => {
    addTenant("staging", { token: "test-token-123" });
    const config = loadConfig();
    expect(config.current).toBe("staging");
    expect(config.tenants.staging).toBeDefined();
    expect(config.tenants.staging.token).toBe("test-token-123");
    expect(config.tenants.staging.url).toBe("https://fairu.app/graphql");
    expect(config.tenants.staging.fileProxyUrl).toBe("https://files.fairu.app");
  });

  test("addTenant with custom url", () => {
    addTenant("custom", {
      token: "tok-123",
      url: "https://custom.api.com/graphql",
    });
    const config = loadConfig();
    expect(config.tenants.custom.url).toBe("https://custom.api.com/graphql");
    expect(config.tenants.custom.token).toBe("tok-123");
  });

  test("getTenantConfig returns current tenant", () => {
    addTenant("myteam", { token: "abc" });
    const tenant = getTenantConfig();
    expect(tenant).not.toBeNull();
    expect(tenant!.token).toBe("abc");
    expect(tenant!.name).toBe("myteam");
  });

  test("getTenantConfig returns named tenant", () => {
    addTenant("first", { token: "t1" });
    addTenant("second", { token: "t2" });
    const tenant = getTenantConfig("second");
    expect(tenant).not.toBeNull();
    expect(tenant!.token).toBe("t2");
  });

  test("getTenantConfig returns null for unknown tenant", () => {
    const tenant = getTenantConfig("nonexistent");
    expect(tenant).toBeNull();
  });

  test("removeTenant removes and returns true", () => {
    addTenant("removeme", { token: "tok" });
    const result = removeTenant("removeme");
    expect(result).toBe(true);
    const config = loadConfig();
    expect(config.tenants.removeme).toBeUndefined();
  });

  test("removeTenant returns false for unknown", () => {
    const result = removeTenant("unknown");
    expect(result).toBe(false);
  });

  test("switchTenant changes current", () => {
    addTenant("first", { token: "t1" });
    addTenant("second", { token: "t2" });
    switchTenant("second");
    const config = loadConfig();
    expect(config.current).toBe("second");
  });

  test("switchTenant returns false for unknown", () => {
    const result = switchTenant("nonexistent");
    expect(result).toBe(false);
  });

  test("loadConfig handles corrupted config file", () => {
    const configDir = join(TEST_DIR, ".fairu");
    mkdirSync(configDir, { recursive: true });
    writeFileSync(join(configDir, "config.json"), "not valid json", "utf-8");
    const config = loadConfig();
    expect(config.current).toBe("default");
    expect(config.tenants).toEqual({});
  });

  test("loadConfig migrates old flat config format", () => {
    const configDir = join(TEST_DIR, ".fairu");
    mkdirSync(configDir, { recursive: true });
    writeFileSync(
      join(configDir, "config.json"),
      JSON.stringify({ token: "old-token", url: "https://old.api.com/graphql" }),
      "utf-8",
    );
    const config = loadConfig();
    expect(config.current).toBe("default");
    expect(config.tenants.default.token).toBe("old-token");
    expect(config.tenants.default.url).toBe("https://old.api.com/graphql");
  });

  test("getConfigPath returns expected path", () => {
    const path = getConfigPath();
    expect(path).toContain(".fairu");
    expect(path).toContain("config.json");
  });
});

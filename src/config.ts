import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export interface TenantConfig {
  name: string;
  token: string;
  url: string;
  fileProxyUrl: string;
  tenantId?: string;
}

export interface FairuConfig {
  current: string;
  tenants: Record<string, TenantConfig>;
}

const CONFIG_DIR = join(homedir(), ".fairu");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const DEFAULT_TENANT: TenantConfig = {
  name: "default",
  token: "",
  url: "https://fairu.app/graphql",
  fileProxyUrl: "https://files.fairu.app",
};

const DEFAULT_CONFIG: FairuConfig = {
  current: "default",
  tenants: {},
};

export function loadConfig(): FairuConfig {
  if (!existsSync(CONFIG_FILE)) {
    return { ...DEFAULT_CONFIG, tenants: {} };
  }
  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw);

    // Migration: old flat config -> new multi-tenant
    if (parsed.token && !parsed.tenants) {
      return {
        current: "default",
        tenants: {
          default: {
            name: "default",
            token: parsed.token,
            url: parsed.url || DEFAULT_TENANT.url,
            fileProxyUrl: parsed.fileProxyUrl || DEFAULT_TENANT.fileProxyUrl,
          },
        },
      };
    }

    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG, tenants: {} };
  }
}

export function saveConfig(config: FairuConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}

export function getTenantConfig(
  tenantName?: string,
): TenantConfig | null {
  const config = loadConfig();
  const name = tenantName || config.current;
  return config.tenants[name] || null;
}

export function addTenant(
  name: string,
  tenant: Partial<TenantConfig> & { token: string },
): void {
  const config = loadConfig();
  config.tenants[name] = {
    name,
    url: DEFAULT_TENANT.url,
    fileProxyUrl: DEFAULT_TENANT.fileProxyUrl,
    ...tenant,
  };
  if (Object.keys(config.tenants).length === 1) {
    config.current = name;
  }
  saveConfig(config);
}

export function removeTenant(name: string): boolean {
  const config = loadConfig();
  if (!config.tenants[name]) return false;
  delete config.tenants[name];
  if (config.current === name) {
    const remaining = Object.keys(config.tenants);
    config.current = remaining[0] || "default";
  }
  saveConfig(config);
  return true;
}

export function switchTenant(name: string): boolean {
  const config = loadConfig();
  if (!config.tenants[name]) return false;
  config.current = name;
  saveConfig(config);
  return true;
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export function getConfigDir(): string {
  return CONFIG_DIR;
}

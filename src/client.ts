import React, { createContext, useContext } from "react";
import { createVanillaClient, type VanillaFairuClient } from "@fairu/sdk/vanilla";
import type { TenantConfig } from "./config.js";

const ClientContext = createContext<VanillaFairuClient | null>(null);

export function useClient(): VanillaFairuClient {
  const client = useContext(ClientContext);
  if (!client) {
    throw new Error("No Fairu client available.");
  }
  return client;
}

export const ClientProvider = ClientContext.Provider;

export function buildClient(tenant: TenantConfig): VanillaFairuClient {
  return createVanillaClient({
    url: tenant.url,
    token: tenant.token,
    fileProxyUrl: tenant.fileProxyUrl,
  });
}

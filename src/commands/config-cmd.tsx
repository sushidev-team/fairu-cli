import React from "react";
import { Box, Text, useApp } from "ink";
import {
  loadConfig,
  addTenant,
  removeTenant,
  switchTenant,
  getConfigPath,
} from "../config.js";

interface ConfigCommandProps {
  action: string;
  positional: string[];
  flags: Record<string, string | boolean>;
}

export function ConfigCommand({ action, positional, flags }: ConfigCommandProps) {
  const app = useApp();
  let content: React.ReactNode;

  switch (action) {
    case "add": {
      const name = positional[0];
      const token = flags.token as string;
      if (!name || !token) {
        content = (
          <Text color="red">
            Usage: fairu config add &lt;name&gt; --token &lt;token&gt; [--url &lt;url&gt;] [--tenant-id &lt;id&gt;]
          </Text>
        );
        break;
      }
      addTenant(name, {
        token,
        ...(flags.url ? { url: flags.url as string } : {}),
        ...(flags["tenant-id"] ? { tenantId: flags["tenant-id"] as string } : {}),
      });
      content = <Text color="green">Tenant &quot;{name}&quot; added.</Text>;
      break;
    }

    case "remove": {
      const name = positional[0];
      if (!name) {
        content = <Text color="red">Usage: fairu config remove &lt;name&gt;</Text>;
        break;
      }
      if (removeTenant(name)) {
        content = <Text color="green">Tenant &quot;{name}&quot; removed.</Text>;
      } else {
        content = <Text color="red">Tenant &quot;{name}&quot; not found.</Text>;
      }
      break;
    }

    case "use": {
      const name = positional[0];
      if (!name) {
        content = <Text color="red">Usage: fairu config use &lt;name&gt;</Text>;
        break;
      }
      if (switchTenant(name)) {
        content = <Text color="green">Switched to tenant &quot;{name}&quot;.</Text>;
      } else {
        content = <Text color="red">Tenant &quot;{name}&quot; not found.</Text>;
      }
      break;
    }

    case "set-token": {
      const token = positional[0];
      if (!token) {
        content = <Text color="red">Usage: fairu config set-token &lt;token&gt;</Text>;
        break;
      }
      addTenant("default", { token });
      content = <Text color="green">Token saved for &quot;default&quot; tenant.</Text>;
      break;
    }

    case "list": {
      const config = loadConfig();
      const tenants = Object.entries(config.tenants);
      if (!tenants.length) {
        content = (
          <Box flexDirection="column">
            <Text color="yellow">No tenants configured.</Text>
            <Text dimColor>Run: fairu config add &lt;name&gt; --token &lt;token&gt;</Text>
          </Box>
        );
        break;
      }
      content = (
        <Box flexDirection="column">
          <Text bold color="cyan">Configured Tenants</Text>
          <Text> </Text>
          {tenants.map(([key, tenant]) => (
            <Box key={key}>
              <Text>
                {config.current === key ? <Text color="green"> * </Text> : "   "}
                <Text bold>{key}</Text>
                <Text dimColor> ({tenant.url})</Text>
                {tenant.tenantId && <Text dimColor> [tenant: {tenant.tenantId}]</Text>}
              </Text>
            </Box>
          ))}
          <Text> </Text>
          <Text dimColor>Config: {getConfigPath()}</Text>
        </Box>
      );
      break;
    }

    case "show":
    default: {
      const config = loadConfig();
      const current = config.tenants[config.current];
      content = (
        <Box flexDirection="column">
          <Text bold color="cyan">Configuration</Text>
          <Text> </Text>
          <Text>  File:            {getConfigPath()}</Text>
          <Text>  Active Tenant:   {config.current}</Text>
          <Text>  Total Tenants:   {Object.keys(config.tenants).length}</Text>
          {current && (
            <>
              <Text> </Text>
              <Text bold>  Current Tenant:</Text>
              <Text>    URL:          {current.url}</Text>
              <Text>    FileProxy:    {current.fileProxyUrl}</Text>
              <Text>    Token:        {current.token ? current.token.slice(0, 12) + "..." : "(not set)"}</Text>
              {current.tenantId && <Text>    Tenant ID:    {current.tenantId}</Text>}
            </>
          )}
        </Box>
      );
      break;
    }
  }

  React.useEffect(() => {
    app.exit();
  }, []);

  return <>{content}</>;
}

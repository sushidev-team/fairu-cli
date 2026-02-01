import React from "react";
import { render } from "ink";
import { createRequire } from "module";
import { ClientProvider, buildClient } from "./client.js";
import { App } from "./app.js";
import { ConfigCommand } from "./commands/config-cmd.js";
import { HelpCommand } from "./commands/help.js";
import { getTenantConfig } from "./config.js";
import { parseArgs } from "./utils.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const args = parseArgs(process.argv);

if (args.flags.version) {
  console.log(`@fairu/cli v${pkg.version}`);
  process.exit(0);
}

if (args.flags.help || args.resource === "help" || !args.resource) {
  const instance = render(<HelpCommand />);
  await instance.waitUntilExit();
  process.exit(0);
}

if (args.resource === "config") {
  const instance = render(
    <ConfigCommand action={args.action} positional={args.positional} flags={args.flags} />,
  );
  await instance.waitUntilExit();
  process.exit(0);
}

// All other commands need API access
const tenantName = args.flags.tenant as string | undefined;
const tenantConfig = getTenantConfig(tenantName);

if (!tenantConfig || !tenantConfig.token) {
  console.error(
    tenantName
      ? `Tenant "${tenantName}" not found or has no token. Run: fairu config add ${tenantName} --token <token>`
      : "No tenant configured. Run: fairu config add <name> --token <token>",
  );
  process.exit(1);
}

const client = buildClient(tenantConfig);

const instance = render(
  <ClientProvider value={client}>
    <App
      resource={args.resource}
      action={args.action}
      positional={args.positional}
      flags={args.flags}
      tenantId={tenantConfig.tenantId}
    />
  </ClientProvider>,
);

await instance.waitUntilExit();
process.exit(0);

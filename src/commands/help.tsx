import React from "react";
import { Box, Text, useApp } from "ink";

interface CommandProps {
  action: string;
  args?: string;
  flags?: string;
  description?: string;
}

function Command({ action, args, flags, description }: CommandProps) {
  return (
    <Box marginLeft={2}>
      <Text color="green">{action}</Text>
      {args && <Text color="yellow"> {args}</Text>}
      {flags && <Text color="gray"> {flags}</Text>}
      {description && <Text color="gray" dimColor> — {description}</Text>}
    </Box>
  );
}

interface ResourceSectionProps {
  name: string;
  children: React.ReactNode;
}

function ResourceSection({ name, children }: ResourceSectionProps) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text color="cyan" bold>◆ </Text>
        <Text color="cyan" bold>{name}</Text>
      </Box>
      {children}
    </Box>
  );
}

function Divider() {
  return <Text color="gray" dimColor>{"─".repeat(60)}</Text>;
}

export function HelpCommand() {
  const app = useApp();

  React.useEffect(() => {
    app.exit();
  }, []);

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="magenta" bold>⬡ Fairu CLI</Text>
        <Text color="gray"> v0.1.0</Text>
      </Box>

      {/* Usage */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold>Usage:</Text>
        <Box marginLeft={2}>
          <Text color="white">fairu </Text>
          <Text color="gray">[--tenant &lt;name&gt;] </Text>
          <Text color="cyan">&lt;resource&gt; </Text>
          <Text color="green">&lt;action&gt; </Text>
          <Text color="yellow">[args] </Text>
          <Text color="gray">[--flags]</Text>
        </Box>
      </Box>

      <Divider />
      <Text bold color="white"> Resources</Text>
      <Text> </Text>

      {/* Assets */}
      <ResourceSection name="assets">
        <Command action="list" flags="[--folder <id>] [--page <n>] [--per-page <n>]" />
        <Command action="list-all" flags="[--cursor <s>] [--limit <n>]" description="paginated flat list" />
        <Command action="get" args="<id>" />
        <Command action="get-by-path" args="<path>" />
        <Command action="get-many" flags="--ids <id,id,...>" />
        <Command action="search" args="<query>" flags="[--page <n>]" />
        <Command action="total-size" flags="--ids <id,id,...>" />
        <Command action="url" args="<path>" flags="--tenant-id <id> [--width] [--height] [--quality]" />
        <Command action="update" args="<id>" flags="[--name] [--alt] [--caption] [--description] [--active] [--blocked]" />
        <Command action="delete" args="<id>" />
        <Command action="rename" args="<id>" flags="--name <name>" />
        <Command action="move" args="<id>" flags="[--to <folderId>]" />
        <Command action="duplicate" args="<id>" flags="[--to <folderId>]" />
        <Command action="block" args="<id>" />
        <Command action="unblock" args="<id>" />
        <Command action="replace" args="<id>" />
        <Command action="redownload" args="<id>" />
      </ResourceSection>

      {/* Folders */}
      <ResourceSection name="folders">
        <Command action="list" flags="[--parent <id>] [--search <q>] [--page <n>]" />
        <Command action="get" args="<path>" />
        <Command action="create" flags="--name <name> [--parent <id>] [--auto-assign-copyright]" />
        <Command action="update" args="<id>" flags="[--name] [--parent] [--auto-assign-copyright]" />
        <Command action="delete" args="<id>" />
        <Command action="rename" args="<id>" flags="--name <name>" />
        <Command action="move" args="<id>" flags="[--to <parentId>]" />
        <Command action="ftp" args="<id>" description="FTP credentials" />
        <Command action="upload-share" args="<id>" flags="[--name] [--expires]" />
      </ResourceSection>

      {/* Galleries */}
      <ResourceSection name="galleries">
        <Command action="list" flags="[--search <q>] [--page <n>]" />
        <Command action="get" args="<id>" />
        <Command action="items" args="<id>" flags="[--page <n>]" />
        <Command action="create" flags="--name <name> [--description] [--location] [--date]" />
        <Command action="update" args="<id>" flags="[--name] [--description] [--location] [--date]" />
        <Command action="delete" args="<id>" />
        <Command action="share" args="<id>" />
      </ResourceSection>

      {/* Copyrights */}
      <ResourceSection name="copyrights">
        <Command action="list" flags="[--page <n>]" />
        <Command action="get" args="<id>" />
        <Command action="create" flags="--name <name> [--email] [--phone] [--website]" />
        <Command action="update" args="<id>" flags="[--name] [--email] [--phone] [--website]" />
        <Command action="delete" args="<id>" flags="[--delete-assets] [--delete-licenses]" />
      </ResourceSection>

      {/* Licenses */}
      <ResourceSection name="licenses">
        <Command action="list" flags="[--page <n>]" />
        <Command action="get" args="<id>" />
        <Command action="create" flags="--name <name> [--copyright-id] [--type] [--start] [--end]" />
        <Command action="update" args="<id>" flags="[--name] [--copyright-id] [--type]" />
        <Command action="delete" args="<id>" flags="[--delete-assets]" />
      </ResourceSection>

      {/* Disks */}
      <ResourceSection name="disks">
        <Command action="list" flags="[--page <n>]" />
        <Command action="get" args="<id>" />
        <Command action="status" args="<id>" />
        <Command action="create" flags="--name <n> --type <t> [--folder-id] [--path] [--active]" />
        <Command action="update" args="<id>" flags="[--name] [--type] [--active]" />
        <Command action="delete" args="<id>" />
      </ResourceSection>

      {/* DMCA */}
      <ResourceSection name="dmca">
        <Command action="list" flags="[--page <n>]" />
        <Command action="get" args="<id>" />
        <Command action="create" flags="--name <n> --email <e> --url <u> [--text]" />
        <Command action="update" args="<id>" flags="[--reply] [--reply-send]" />
      </ResourceSection>

      {/* Roles */}
      <ResourceSection name="roles">
        <Command action="list" flags="[--page <n>]" />
        <Command action="get" args="<id>" />
        <Command action="create" flags="--name <name> [--permissions <p1,p2,...>]" />
        <Command action="update" args="<id>" flags="[--name] [--permissions]" />
        <Command action="delete" args="<id>" />
      </ResourceSection>

      {/* Users */}
      <ResourceSection name="users">
        <Command action="list" flags="[--page <n>]" />
        <Command action="get" args="<id>" />
        <Command action="invite" flags="--email <email> --role <roleId>" />
        <Command action="delete" args="<id>" />
      </ResourceSection>

      {/* Workflows */}
      <ResourceSection name="workflows">
        <Command action="list" flags="[--page <n>]" />
        <Command action="get" args="<id>" />
        <Command action="create" flags="--name <name> [--type] [--active] [--structure <json>]" />
        <Command action="update" args="<id>" flags="[--name] [--type] [--active]" />
        <Command action="delete" args="<id>" />
      </ResourceSection>

      {/* Credentials */}
      <ResourceSection name="credentials">
        <Command action="list" description="S3/Raku credentials" />
        <Command action="create" flags="--permissions <p1,p2,...> [--name] [--bucket]" />
        <Command action="revoke" args="<id>" />
        <Command action="delete" args="<id>" />
      </ResourceSection>

      {/* Signatures */}
      <ResourceSection name="signatures">
        <Command action="pdf-create" flags="--file-id <id> [--emails <e1,e2,...>]" />
        <Command action="pdf-start" args="<id>" />
        <Command action="pdf-cancel" args="<id>" />
        <Command action="file-access" flags="--ids <id,id,...> [--valid-for <min>]" />
      </ResourceSection>

      {/* Tenant */}
      <ResourceSection name="tenant">
        <Command action="info" description="show tenant information" />
        <Command action="create" flags="--name <name>" />
        <Command action="update" flags="[--name] [--use-ai] [--custom-domain]" />
        <Command action="domains" description="list supported domains" />
      </ResourceSection>

      <Divider />
      <Text bold color="white"> Other Commands</Text>
      <Text> </Text>

      {/* Upload */}
      <ResourceSection name="upload">
        <Command action="<file>" flags="[--folder <id>] [--alt <text>]" description="upload a file" />
      </ResourceSection>

      {/* Health */}
      <ResourceSection name="health">
        <Box marginLeft={2}><Text color="gray">Check API connection status</Text></Box>
      </ResourceSection>

      {/* Config */}
      <ResourceSection name="config">
        <Command action="show" description="current configuration" />
        <Command action="list" description="list all tenants" />
        <Command action="add" args="<name>" flags="--token <t> [--url <u>]" description="add tenant" />
        <Command action="remove" args="<name>" description="remove tenant" />
        <Command action="use" args="<name>" description="switch active tenant" />
        <Command action="set-token" args="<token>" description="quick setup" />
      </ResourceSection>

      <Divider />

      {/* Global Flags */}
      <Box flexDirection="column" marginTop={1}>
        <Text bold color="white">Global Flags:</Text>
        <Box marginLeft={2}>
          <Text color="yellow">--tenant</Text>
          <Text color="gray"> &lt;name&gt;   Use a specific tenant configuration</Text>
        </Box>
        <Box marginLeft={2}>
          <Text color="yellow">--help</Text>
          <Text color="gray">            Show this help message</Text>
        </Box>
        <Box marginLeft={2}>
          <Text color="yellow">--version</Text>
          <Text color="gray">         Show version number</Text>
        </Box>
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>Documentation: </Text>
        <Text color="blue" underline>https://fairu.app/docs</Text>
      </Box>
    </Box>
  );
}

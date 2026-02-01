# Fairu CLI

Command-line interface for managing digital assets with [Fairu](https://fairu.app).

## Installation

```bash
npm install -g @fairu/cli
```

Or use directly with npx:

```bash
npx @fairu/cli --help
```

## Quick Start

```bash
# Configure your API token
fairu config set-token <your-api-token>

# Check connection
fairu health

# List assets
fairu assets list

# Upload a file
fairu upload ./photo.jpg --folder <folder-id>
```

## Configuration

Fairu CLI supports multiple tenant configurations:

```bash
# Add a tenant
fairu config add production --token <token>

# Add with custom API URL
fairu config add staging --token <token> --url https://fairu.dev/graphql

# List configured tenants
fairu config list

# Switch active tenant
fairu config use production

# Show current config
fairu config show

# Use specific tenant for a command
fairu --tenant staging assets list
```

Configuration is stored in `~/.fairu/config.json`.

## Commands

### Assets

```bash
fairu assets list [--folder <id>] [--page <n>] [--per-page <n>]
fairu assets list-all [--cursor <s>] [--limit <n>]
fairu assets get <id>
fairu assets get-by-path <path>
fairu assets get-many --ids <id,id,...>
fairu assets search <query> [--page <n>]
fairu assets total-size --ids <id,id,...>
fairu assets url <path> --tenant-id <id> [--width <n>] [--height <n>]
fairu assets update <id> [--name <n>] [--alt <t>] [--caption <t>] [--description <t>]
fairu assets delete <id>
fairu assets rename <id> --name <name>
fairu assets move <id> [--to <folderId>]
fairu assets duplicate <id> [--to <folderId>]
fairu assets block <id>
fairu assets unblock <id>
fairu assets replace <id>
fairu assets redownload <id>
```

### Folders

```bash
fairu folders list [--parent <id>] [--search <q>] [--page <n>]
fairu folders get <path>
fairu folders create --name <name> [--parent <id>]
fairu folders update <id> [--name <n>]
fairu folders delete <id>
fairu folders rename <id> --name <name>
fairu folders move <id> [--to <parentId>]
fairu folders ftp <id>
fairu folders upload-share <id> [--name <n>] [--expires <duration>]
```

### Galleries

```bash
fairu galleries list [--search <q>] [--page <n>]
fairu galleries get <id>
fairu galleries items <id> [--page <n>]
fairu galleries create --name <name> [--description <t>] [--location <l>]
fairu galleries update <id> [--name <n>] [--description <t>]
fairu galleries delete <id>
fairu galleries share <id>
```

### Copyrights

```bash
fairu copyrights list [--page <n>]
fairu copyrights get <id>
fairu copyrights create --name <name> [--email <e>] [--phone <p>] [--website <w>]
fairu copyrights update <id> [--name <n>] [--email <e>]
fairu copyrights delete <id> [--delete-assets] [--delete-licenses]
```

### Licenses

```bash
fairu licenses list [--page <n>]
fairu licenses get <id>
fairu licenses create --name <name> [--copyright-id <id>] [--type <t>]
fairu licenses update <id> [--name <n>]
fairu licenses delete <id> [--delete-assets]
```

### Disks

```bash
fairu disks list [--page <n>]
fairu disks get <id>
fairu disks status <id>
fairu disks create --name <n> --type <t> [--folder-id <id>] [--path <p>]
fairu disks update <id> [--name <n>] [--active]
fairu disks delete <id>
```

### DMCA

```bash
fairu dmca list [--page <n>]
fairu dmca get <id>
fairu dmca create --name <n> --email <e> --url <u> [--text <t>]
fairu dmca update <id> [--reply <t>] [--reply-send]
```

### Roles

```bash
fairu roles list [--page <n>]
fairu roles get <id>
fairu roles create --name <name> [--permissions <p1,p2,...>]
fairu roles update <id> [--name <n>] [--permissions <p1,p2,...>]
fairu roles delete <id>
```

### Users

```bash
fairu users list [--page <n>]
fairu users get <id>
fairu users invite --email <email> --role <roleId>
fairu users delete <id>
```

### Workflows

```bash
fairu workflows list [--page <n>]
fairu workflows get <id>
fairu workflows create --name <name> [--type <t>] [--active]
fairu workflows update <id> [--name <n>] [--active]
fairu workflows delete <id>
```

### Credentials (S3/Raku)

```bash
fairu credentials list
fairu credentials create --permissions <p1,p2,...> [--name <n>] [--bucket <b>]
fairu credentials revoke <id>
fairu credentials delete <id>
```

### Signatures

```bash
fairu signatures pdf-create --file-id <id> [--emails <e1,e2,...>]
fairu signatures pdf-start <id>
fairu signatures pdf-cancel <id>
fairu signatures file-access --ids <id,id,...> [--valid-for <minutes>]
```

### Tenant

```bash
fairu tenant info
fairu tenant create --name <name>
fairu tenant update [--name <n>] [--use-ai] [--custom-domain <d>]
fairu tenant domains
```

### Upload

```bash
fairu upload <file> [--folder <id>] [--alt <text>]
```

### Health

```bash
fairu health
```

## Local Development

### Setup

```bash
# Clone the repository
git clone https://github.com/fairu-media/fairu-cli.git
cd fairu-cli

# Install dependencies
npm install
```

### Running Locally

Use the development script to run commands without building:

```bash
# Using the dev script (recommended)
./bin/fairu-dev --help
./bin/fairu-dev config show
./bin/fairu-dev assets list

# Or with npm (requires -- to pass arguments)
npm run dev -- --help
npm run dev -- assets list
```

### Building

```bash
# Build the CLI
npm run build

# Run the built version
node dist/cli.js --help

# Or link globally for testing
npm link
fairu --help
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npx vitest run src/__tests__/assets.test.tsx
```

### Project Structure

```
src/
├── cli.tsx              # Entry point, argument parsing
├── app.tsx              # Main router (resource → action)
├── client.ts            # SDK client setup & React context
├── config.ts            # Multi-tenant configuration
├── graphql.ts           # All GraphQL queries/mutations
├── utils.ts             # Utility functions
├── components/          # Shared UI components
│   ├── Spinner.tsx
│   └── ErrorMessage.tsx
├── commands/            # Command implementations
│   ├── assets.tsx
│   ├── folders.tsx
│   ├── galleries.tsx
│   └── ...
└── __tests__/           # Test files
    ├── test-utils.tsx   # Mock client & render helpers
    ├── assets.test.tsx
    └── ...
```

### Adding a New Command

1. Add GraphQL query/mutation to `src/graphql.ts`
2. Create component in `src/commands/{resource}.tsx`
3. Add routing in `src/app.tsx`
4. Update help text in `src/commands/help.tsx`
5. Add tests in `src/__tests__/{resource}.test.tsx`

## Global Flags

```
--tenant <name>   Use a specific tenant configuration
--help            Show help
--version         Show version
```

## Requirements

- Node.js >= 20.0.0

## License

MIT

# Fairu CLI — Project Rules

## SDK-to-CLI Derivation

The CLI derives its operations from the `@fairu/sdk`. The SDK source of truth is:
- `node_modules/@fairu/sdk/dist/generated/graphql.d.ts` — all GraphQL Queries/Mutations
- `node_modules/@fairu/sdk/dist/vanilla.d.ts` — VanillaFairuClient Interface

### Resource Mapping
- GraphQL type `fairu{Resource}` → CLI resource (lowercase, plural): `fairuCopyright` → `copyrights`
- Each SDK resource gets its own command file: `src/commands/{resource}.tsx`
- Each SDK resource gets its own test file: `src/__tests__/{resource}.test.tsx`
- All GraphQL strings are centralized in `src/graphql.ts`, grouped by resource

### Action Mapping
| SDK Pattern | CLI Action | Example |
|---|---|---|
| `fairu{Resources}(page, perPage)` (Query) | `list` | `fairu copyrights list` |
| `fairu{Resource}(id)` (Query) | `get` | `fairu copyrights get <id>` |
| `create{FairuResource}(data)` (Mutation) | `create` | `fairu copyrights create --name "..."` |
| `update{FairuResource}(data)` (Mutation) | `update` | `fairu copyrights update <id> --name "..."` |
| `delete{FairuResource}(id)` (Mutation) | `delete` | `fairu copyrights delete <id>` |
| Special Mutations | descriptive name | `block`, `unblock`, `rename`, `move`, `share`, `invite`, `revoke`, `ftp`, `replace`, `redownload` |

### DTO → CLI Flags
- Each field of an SDK DTO (e.g., `FairuCopyrightDto`) becomes a CLI flag
- camelCase → kebab-case: `copyrightId` → `--copyright-id`
- Boolean fields: `--flag` (no value = true)
- Required DTO fields → Required CLI flags (validation in component)

### Internal Operations
The following SDK operations are internal and NOT exposed as standalone CLI commands:
- `getFairuMultipartPartUrl`, `completeFairuMultipartUpload`, `abortFairuMultipartUpload` → internal to Upload command
- `createFairuUploadLink` → internal to Upload command
- `initFairuMultipartUpload` → internal to Upload command

### Component Pattern
Each CLI action is a React component (Ink) following this pattern:
1. `useApp()` + `useClient()` hooks
2. `useState` with `{ loading, data/done, error }`
3. `useEffect` for API call
4. `useEffect` for `app.exit()` when `!loading`
5. Render: Spinner → Error → Result

### Pagination
- All list commands support `--page` and `--per-page`
- SDK pagination type: `DefaultPaginator` with `currentPage`, `lastPage`, `total`, `hasMorePages`

### Routing
- `src/app.tsx`: Top-level switch on resource, then render function with switch on action
- `src/cli.tsx`: Resource list for help check, client provider setup
- `src/commands/help.tsx`: Help text for all resources and actions

### Tests
- Mock client via `src/__tests__/test-utils.tsx`: `createMockClient()` + `renderWithClient()`
- Each command gets at least one test for the success case
- List/Get tests check the rendered output for expected values
- Create/Update/Delete tests verify `client.mutate`/`client.query` calls + success message

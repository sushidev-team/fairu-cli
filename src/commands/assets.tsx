import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatBytes, formatDate } from "../utils.js";
import {
  SEARCH_ASSETS,
  BLOCK_ASSET,
  UNBLOCK_ASSET,
  RENAME_ASSET,
  MOVE_ASSET,
  DUPLICATE_ASSET,
  GET_ASSET_BY_PATH,
  REPLACE_ASSET,
  REDOWNLOAD_ASSET,
  ALL_FILES_FLAT,
  MULTIPLE_FILES,
  FILES_TOTAL_SIZE,
  FILE_URL_BY_PATH,
} from "../graphql.js";

// ─── List Assets ──────────────────────────────────────────

export function AssetsList({
  flags,
}: {
  flags: Record<string, string | boolean>;
}) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.assets
      .list({
        folderId: flags.folder as string | undefined,
        page: flags.page ? Number(flags.page) : 1,
        perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
      })
      .then((result) => setState({ loading: false, data: result, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Loading assets..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  const { data: assets, paginatorInfo: pagination } = state.data;

  if (!assets?.length) return <Text color="yellow">No assets found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Assets</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={20}><Text bold dimColor>Type</Text></Box>
        <Box width={10}><Text bold dimColor>Size</Text></Box>
      </Box>
      {assets.map((a: any) => (
        <Box key={a.id}>
          <Box width={38}><Text>{a.id}</Text></Box>
          <Box width={30}><Text>{a.name}</Text></Box>
          <Box width={20}><Text dimColor>{a.mimeType}</Text></Box>
          <Box width={10}><Text dimColor>{formatBytes(a.size)}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <>
          <Text> </Text>
          <Text dimColor>
            Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)
          </Text>
        </>
      )}
    </Box>
  );
}

// ─── Get Asset ────────────────────────────────────────────

export function AssetGet({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Asset ID is required." }); return; }
    client.assets
      .find(id)
      .then((asset) => setState({ loading: false, data: asset, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Loading asset..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Asset not found.</Text>;

  const a = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Asset Details</Text>
      <Text> </Text>
      <Text>  ID:          {a.id}</Text>
      <Text>  Name:        {a.name}</Text>
      <Text>  MIME Type:   {a.mimeType}</Text>
      <Text>  Size:        {formatBytes(a.size)}</Text>
      <Text>  Alt:         {a.alt || "-"}</Text>
      <Text>  Caption:     {a.caption || "-"}</Text>
      <Text>  Description: {a.description || "-"}</Text>
      <Text>  Blocked:     {a.blocked ? "Yes" : "No"}</Text>
      <Text>  Created:     {formatDate(a.createdAt)}</Text>
      <Text>  Updated:     {formatDate(a.updatedAt)}</Text>
    </Box>
  );
}

// ─── Search Assets ────────────────────────────────────────

export function AssetSearch({
  query,
  flags,
}: {
  query: string;
  flags: Record<string, string | boolean>;
}) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!query) { setState({ loading: false, data: null, error: "Search query is required." }); return; }
    client
      .query<any>(SEARCH_ASSETS, {
        search: query,
        page: flags.page ? Number(flags.page) : 1,
        perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
      })
      .then((result) => setState({ loading: false, data: result?.fairuSearch, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Searching..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const assets = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;

  if (!assets.length)
    return <Text color="yellow">No results for &quot;{query}&quot;.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Search Results for &quot;{query}&quot;</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={20}><Text bold dimColor>Type</Text></Box>
      </Box>
      {assets.map((a: any) => (
        <Box key={a.id}>
          <Box width={38}><Text>{a.id}</Text></Box>
          <Box width={30}><Text>{a.name}</Text></Box>
          <Box width={20}><Text dimColor>{a.mimeType}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <>
          <Text> </Text>
          <Text dimColor>
            Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)
          </Text>
        </>
      )}
    </Box>
  );
}

// ─── Delete Asset ─────────────────────────────────────────

export function AssetDelete({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Asset ID is required." }); return; }
    client.assets.delete(id)
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting asset..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Asset {id} deleted successfully.</Text>;
}

// ─── Block Asset ──────────────────────────────────────────

export function AssetBlock({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Asset ID is required." }); return; }
    client.mutate(BLOCK_ASSET, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Blocking asset..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Asset {id} blocked.</Text>;
}

// ─── Unblock Asset ────────────────────────────────────────

export function AssetUnblock({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Asset ID is required." }); return; }
    client.mutate(UNBLOCK_ASSET, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Unblocking asset..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Asset {id} unblocked.</Text>;
}

// ─── Rename Asset ─────────────────────────────────────────

export function AssetRename({ id, name }: { id: string; name: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id || !name) { setState({ loading: false, done: false, error: "Asset ID and --name are required." }); return; }
    client.mutate(RENAME_ASSET, { id, name })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Renaming asset..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Asset {id} renamed to &quot;{name}&quot;.</Text>;
}

// ─── Move Asset ───────────────────────────────────────────

export function AssetMove({ id, targetFolder }: { id: string; targetFolder?: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Asset ID is required." }); return; }
    client.mutate(MOVE_ASSET, { id, parent: targetFolder || null })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Moving asset..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Asset {id} moved to {targetFolder || "root"}.</Text>;
}

// ─── Duplicate Asset ──────────────────────────────────────

export function AssetDuplicate({ id, targetFolder }: { id: string; targetFolder?: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Asset ID is required." }); return; }
    client.mutate(DUPLICATE_ASSET, { id, parent: targetFolder || null })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Duplicating asset..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Asset {id} duplicated.</Text>;
}

// ─── Update Asset ─────────────────────────────────────────

export function AssetUpdate({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Asset ID is required." }); return; }
    const data: any = { id };
    if (flags.name) data.name = flags.name;
    if (flags.alt) data.alt = flags.alt;
    if (flags.caption) data.caption = flags.caption;
    if (flags.description) data.description = flags.description;
    if (flags.active !== undefined) data.active = flags.active === true || flags.active === "true";
    if (flags.blocked !== undefined) data.blocked = flags.blocked === true || flags.blocked === "true";
    if (flags["focal-point"]) data.focal_point = flags["focal-point"];
    if (flags["copyright-ids"]) data.copyrightIds = (flags["copyright-ids"] as string).split(",").map((s) => s.trim());
    if (flags["license-ids"]) data.licenseIds = (flags["license-ids"] as string).split(",").map((s) => s.trim());

    client.assets.update(data)
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Updating asset..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Asset {id} updated.</Text>;
}

// ─── Get Asset by Path ───────────────────────────────────

export function AssetGetByPath({ path }: { path: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!path) { setState({ loading: false, data: null, error: "Asset path is required." }); return; }
    client.query<any>(GET_ASSET_BY_PATH, { path })
      .then((result) => setState({ loading: false, data: result?.fairuFileByPath, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Loading asset..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Asset not found.</Text>;

  const a = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Asset Details</Text>
      <Text> </Text>
      <Text>  ID:          {a.id}</Text>
      <Text>  Name:        {a.name}</Text>
      <Text>  MIME Type:   {a.mimeType}</Text>
      <Text>  Size:        {formatBytes(a.size)}</Text>
      <Text>  Alt:         {a.alt || "-"}</Text>
      <Text>  Caption:     {a.caption || "-"}</Text>
      <Text>  Description: {a.description || "-"}</Text>
      <Text>  Blocked:     {a.blocked ? "Yes" : "No"}</Text>
      <Text>  Created:     {formatDate(a.createdAt)}</Text>
      <Text>  Updated:     {formatDate(a.updatedAt)}</Text>
    </Box>
  );
}

// ─── Replace Asset ───────────────────────────────────────

export function AssetReplace({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Asset ID is required." }); return; }
    client.mutate<any>(REPLACE_ASSET, { id })
      .then((result) => setState({ loading: false, data: result?.replaceFairuFile, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Requesting replacement URL..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">Upload URL for replacement:</Text>
      <Text>{state.data.upload_url}</Text>
    </Box>
  );
}

// ─── Redownload Asset ────────────────────────────────────

export function AssetRedownload({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Asset ID is required." }); return; }
    client.mutate(REDOWNLOAD_ASSET, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Triggering redownload..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Asset {id} redownload triggered.</Text>;
}

// ─── List All Assets (flat, cursor-based) ────────────────

export function AssetListAll({
  flags,
}: {
  flags: Record<string, string | boolean>;
}) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(ALL_FILES_FLAT, {
      cursor: (flags.cursor as string) || null,
      limit: flags.limit ? Number(flags.limit) : null,
    })
      .then((result) => setState({ loading: false, data: result?.fairuAllFilesFlat, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Loading all assets..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const assets = state.data || [];
  if (!assets.length) return <Text color="yellow">No assets found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">All Assets (flat)</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={20}><Text bold dimColor>Type</Text></Box>
        <Box width={10}><Text bold dimColor>Size</Text></Box>
      </Box>
      {assets.map((a: any) => (
        <Box key={a.id}>
          <Box width={38}><Text>{a.id}</Text></Box>
          <Box width={30}><Text>{a.name}</Text></Box>
          <Box width={20}><Text dimColor>{a.mimeType}</Text></Box>
          <Box width={10}><Text dimColor>{formatBytes(a.size)}</Text></Box>
        </Box>
      ))}
      <Text> </Text>
      <Text dimColor>{assets.length} assets returned</Text>
    </Box>
  );
}

// ─── Get Multiple Assets ─────────────────────────────────

export function AssetGetMany({
  flags,
}: {
  flags: Record<string, string | boolean>;
}) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const idsRaw = flags.ids as string;
    if (!idsRaw) { setState({ loading: false, data: null, error: "--ids is required." }); return; }
    const ids = idsRaw.split(",").map((id) => id.trim());
    client.query<any>(MULTIPLE_FILES, { ids })
      .then((result) => setState({ loading: false, data: result?.fairuMultipleFiles, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Loading assets..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const assets = state.data || [];
  if (!assets.length) return <Text color="yellow">No assets found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Assets</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={20}><Text bold dimColor>Type</Text></Box>
        <Box width={10}><Text bold dimColor>Size</Text></Box>
      </Box>
      {assets.map((a: any) => (
        <Box key={a.id}>
          <Box width={38}><Text>{a.id}</Text></Box>
          <Box width={30}><Text>{a.name}</Text></Box>
          <Box width={20}><Text dimColor>{a.mimeType}</Text></Box>
          <Box width={10}><Text dimColor>{formatBytes(a.size)}</Text></Box>
        </Box>
      ))}
    </Box>
  );
}

// ─── Total Size ──────────────────────────────────────────

export function AssetTotalSize({
  flags,
}: {
  flags: Record<string, string | boolean>;
}) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const idsRaw = flags.ids as string;
    if (!idsRaw) { setState({ loading: false, data: null, error: "--ids is required." }); return; }
    const ids = idsRaw.split(",").map((id) => id.trim());
    client.query<any>(FILES_TOTAL_SIZE, { ids })
      .then((result) => setState({ loading: false, data: result?.fairuFilesTotalSize, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Calculating total size..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Total Size</Text>
      <Text> </Text>
      <Text>  {formatBytes(state.data)}</Text>
    </Box>
  );
}

// ─── Asset URL by Path ───────────────────────────────────

export function AssetUrl({
  path,
  flags,
}: {
  path: string;
  flags: Record<string, string | boolean>;
}) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!path) { setState({ loading: false, data: null, error: "Asset path is required." }); return; }
    const tenantId = flags["tenant-id"] as string;
    if (!tenantId) { setState({ loading: false, data: null, error: "--tenant-id is required." }); return; }
    const vars: any = { path, tenantId };
    if (flags.width) vars.width = Number(flags.width);
    if (flags.height) vars.height = Number(flags.height);
    if (flags.quality) vars.quality = Number(flags.quality);
    if (flags.version) vars.version = flags.version;
    client.query<any>(FILE_URL_BY_PATH, vars)
      .then((result) => setState({ loading: false, data: result?.fairuFileUrlByPath, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => {
    if (!state.loading) app.exit();
  }, [state.loading]);

  if (state.loading) return <Spinner label="Resolving URL..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">URL not found.</Text>;

  return <Text>{state.data}</Text>;
}

import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import {
  FOLDER_CONTENTS,
  FOLDER_BY_PATH,
  CREATE_FOLDER,
  UPDATE_FOLDER,
  DELETE_FOLDER,
  RENAME_FOLDER,
  MOVE_FOLDER,
  CREATE_FOLDER_FTP,
  CREATE_FOLDER_UPLOAD_SHARE,
} from "../graphql.js";

// ─── List Folder Contents ─────────────────────────────────

export function FolderList({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(FOLDER_CONTENTS, {
      folder: (flags.parent as string) || null,
      search: (flags.search as string) || null,
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
    })
      .then((result) => setState({ loading: false, data: result?.fairuFolder, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading folder contents..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const entries = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;
  if (!entries.length) return <Text color="yellow">Folder is empty.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Folder Contents</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={10}><Text bold dimColor>Type</Text></Box>
        <Box width={22}><Text bold dimColor>Created</Text></Box>
      </Box>
      {entries.map((entry: any) => (
        <Box key={entry.id}>
          <Box width={38}><Text>{entry.id}</Text></Box>
          <Box width={30}><Text>{entry.name}</Text></Box>
          <Box width={10}><Text dimColor>{entry.__typename === "FairuFolder" ? "folder" : "asset"}</Text></Box>
          <Box width={22}><Text dimColor>{formatDate(entry.createdAt)}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Get Folder by Path ───────────────────────────────────

export function FolderGet({ path }: { path: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!path) { setState({ loading: false, data: null, error: "Folder path is required." }); return; }
    client.query<any>(FOLDER_BY_PATH, { path })
      .then((result) => setState({ loading: false, data: result?.fairuFolderByPath, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading folder..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Folder not found.</Text>;

  const f = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Folder Details</Text>
      <Text> </Text>
      <Text>  ID:      {f.id}</Text>
      <Text>  Name:    {f.name}</Text>
      <Text>  Created: {formatDate(f.createdAt)}</Text>
      <Text>  Updated: {formatDate(f.updatedAt)}</Text>
    </Box>
  );
}

// ─── Create Folder ────────────────────────────────────────

export function FolderCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const name = flags.name as string;
    if (!name) { setState({ loading: false, data: null, error: "--name is required." }); return; }
    const data: any = { name };
    if (flags.parent) data.parent = flags.parent;
    if (flags["auto-assign-copyright"] !== undefined) data.auto_assign_copyright = flags["auto-assign-copyright"] === true || flags["auto-assign-copyright"] === "true";
    if (flags["copyright-ids"]) data.copyright_ids = (flags["copyright-ids"] as string).split(",").map((s) => s.trim());
    if (flags["inherit-copyright-assignment"] !== undefined) data.inherit_copyright_assignment = flags["inherit-copyright-assignment"] === true || flags["inherit-copyright-assignment"] === "true";
    client.mutate<any>(CREATE_FOLDER, { data })
      .then((result) => setState({ loading: false, data: result?.createFairuFolder, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating folder..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">Folder created successfully.</Text>
      {state.data && <Text>  ID: {state.data.id}</Text>}
    </Box>
  );
}

// ─── Delete Folder ────────────────────────────────────────

export function FolderDelete({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Folder ID is required." }); return; }
    client.mutate(DELETE_FOLDER, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting folder..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Folder {id} deleted.</Text>;
}

// ─── Rename Folder ────────────────────────────────────────

export function FolderRename({ id, name }: { id: string; name: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id || !name) { setState({ loading: false, done: false, error: "Folder ID and --name are required." }); return; }
    client.mutate(RENAME_FOLDER, { id, name })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Renaming folder..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Folder {id} renamed to &quot;{name}&quot;.</Text>;
}

// ─── Move Folder ──────────────────────────────────────────

export function FolderMove({ id, targetParent }: { id: string; targetParent?: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Folder ID is required." }); return; }
    client.mutate(MOVE_FOLDER, { id, parent: targetParent || null })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Moving folder..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Folder {id} moved to {targetParent || "root"}.</Text>;
}

// ─── Update Folder ────────────────────────────────────────

export function FolderUpdate({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Folder ID is required." }); return; }
    const data: any = { id };
    if (flags.name) data.name = flags.name;
    if (flags.parent) data.parent = flags.parent;
    if (flags["auto-assign-copyright"] !== undefined) data.auto_assign_copyright = flags["auto-assign-copyright"] === true || flags["auto-assign-copyright"] === "true";
    if (flags["copyright-ids"]) data.copyright_ids = (flags["copyright-ids"] as string).split(",").map((s) => s.trim());
    if (flags["inherit-copyright-assignment"] !== undefined) data.inherit_copyright_assignment = flags["inherit-copyright-assignment"] === true || flags["inherit-copyright-assignment"] === "true";
    client.mutate(UPDATE_FOLDER, { data })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Updating folder..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Folder {id} updated.</Text>;
}

// ─── Folder FTP ──────────────────────────────────────────

export function FolderFtp({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Folder ID is required." }); return; }
    client.mutate<any>(CREATE_FOLDER_FTP, { id })
      .then((result) => setState({ loading: false, data: result?.createFairuFolderFTP, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating FTP connection..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">FTP connection created.</Text>
      <Text>  Disk ID: {state.data.id}</Text>
      <Text>  Type:    {state.data.type}</Text>
    </Box>
  );
}

// ─── Folder Upload Share ─────────────────────────────────

export function FolderUploadShare({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Folder ID is required." }); return; }
    const name = (flags.name as string) || null;
    const expires_in = (flags.expires as string) || null;
    client.mutate<any>(CREATE_FOLDER_UPLOAD_SHARE, { id, name, expires_in })
      .then((result) => setState({ loading: false, data: result?.createFairuFolderUploadShareLink, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating upload share link..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">Upload share link created:</Text>
      <Text>{state.data.url}</Text>
    </Box>
  );
}

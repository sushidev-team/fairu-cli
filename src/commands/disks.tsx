import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import {
  LIST_DISKS,
  GET_DISK,
  GET_DISK_STATUS,
  CREATE_DISK,
  UPDATE_DISK,
  DELETE_DISK,
} from "../graphql.js";

// ─── List Disks ──────────────────────────────────────────

export function DiskList({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(LIST_DISKS, {
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
    })
      .then((result) => setState({ loading: false, data: result?.fairuDisks, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading disks..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const disks = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;
  if (!disks.length) return <Text color="yellow">No disks found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Disks</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={20}><Text bold dimColor>Name</Text></Box>
        <Box width={8}><Text bold dimColor>Type</Text></Box>
        <Box width={8}><Text bold dimColor>Active</Text></Box>
        <Box width={8}><Text bold dimColor>Healthy</Text></Box>
      </Box>
      {disks.map((d: any) => (
        <Box key={d.id}>
          <Box width={38}><Text>{d.id}</Text></Box>
          <Box width={20}><Text>{d.name}</Text></Box>
          <Box width={8}><Text dimColor>{d.type}</Text></Box>
          <Box width={8}><Text dimColor>{d.active ? "Yes" : "No"}</Text></Box>
          <Box width={8}><Text dimColor>{d.healthy ? "Yes" : "No"}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Get Disk ────────────────────────────────────────────

export function DiskGet({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Disk ID is required." }); return; }
    client.query<any>(GET_DISK, { id })
      .then((result) => setState({ loading: false, data: result?.fairuDisk, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading disk..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Disk not found.</Text>;

  const d = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Disk Details</Text>
      <Text> </Text>
      <Text>  ID:      {d.id}</Text>
      <Text>  Name:    {d.name}</Text>
      <Text>  Type:    {d.type}</Text>
      <Text>  Active:  {d.active ? "Yes" : "No"}</Text>
      <Text>  Healthy: {d.healthy ? "Yes" : "No"}</Text>
      <Text>  Syncing: {d.syncing ? "Yes" : "No"}</Text>
      <Text>  Path:    {d.path || "-"}</Text>
      <Text>  Pattern: {d.pattern || "-"}</Text>
      <Text>  Created: {formatDate(d.createdAt)}</Text>
      <Text>  Updated: {formatDate(d.updatedAt)}</Text>
    </Box>
  );
}

// ─── Disk Status ─────────────────────────────────────────

export function DiskStatus({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Disk ID is required." }); return; }
    client.query<any>(GET_DISK_STATUS, { id })
      .then((result) => setState({ loading: false, data: result?.fairuDiskStatus, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading disk status..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Disk status not found.</Text>;

  const s = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Disk Status</Text>
      <Text> </Text>
      <Text>  ID:      {s.id}</Text>
      <Text>  Syncing: {s.syncing ? "Yes" : "No"}</Text>
      <Text>  Open:    {s.open}</Text>
      <Text>  Pending: {s.pending}</Text>
      <Text>  Synced:  {s.synced}</Text>
      <Text>  Failed:  {s.failed}</Text>
    </Box>
  );
}

// ─── Create Disk ─────────────────────────────────────────

export function DiskCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const name = flags.name as string;
    const type = flags.type as string;
    if (!name || !type) { setState({ loading: false, data: null, error: "--name and --type are required." }); return; }
    const data: any = { name, type };
    if (flags["folder-id"]) data.folder_id = flags["folder-id"];
    if (flags.path) data.path = flags.path;
    if (flags.pattern) data.pattern = flags.pattern;
    if (flags.active !== undefined) data.active = flags.active === true || flags.active === "true";
    if (flags.credentials) data.credentials = JSON.parse(flags.credentials as string);
    if (flags["delete-at-origin"] !== undefined) data.delete_at_origin = flags["delete-at-origin"] === true || flags["delete-at-origin"] === "true";

    client.mutate<any>(CREATE_DISK, { data })
      .then((result) => setState({ loading: false, data: result?.createFairuDisk, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating disk..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">Disk created successfully.</Text>
      {state.data && <Text>  ID: {state.data.id}</Text>}
    </Box>
  );
}

// ─── Update Disk ─────────────────────────────────────────

export function DiskUpdate({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Disk ID is required." }); return; }
    const data: any = { id };
    if (flags.name) data.name = flags.name;
    if (flags.type) data.type = flags.type;
    if (flags["folder-id"]) data.folder_id = flags["folder-id"];
    if (flags.path) data.path = flags.path;
    if (flags.pattern) data.pattern = flags.pattern;
    if (flags.active !== undefined) data.active = flags.active === true || flags.active === "true";
    if (flags.credentials) data.credentials = JSON.parse(flags.credentials as string);
    if (flags["delete-at-origin"] !== undefined) data.delete_at_origin = flags["delete-at-origin"] === true || flags["delete-at-origin"] === "true";

    client.mutate(UPDATE_DISK, { data })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Updating disk..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Disk {id} updated.</Text>;
}

// ─── Delete Disk ─────────────────────────────────────────

export function DiskDelete({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Disk ID is required." }); return; }
    client.mutate(DELETE_DISK, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting disk..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Disk {id} deleted.</Text>;
}

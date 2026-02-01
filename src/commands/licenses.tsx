import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import { LIST_LICENSES, GET_LICENSE, CREATE_LICENSE, UPDATE_LICENSE, DELETE_LICENSE } from "../graphql.js";

// ─── List Licenses ────────────────────────────────────────

export function LicenseList({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(LIST_LICENSES, {
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
    })
      .then((result) => setState({ loading: false, data: result?.fairuLicenses, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading licenses..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const licenses = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;
  if (!licenses.length) return <Text color="yellow">No licenses found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Licenses</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={22}><Text bold dimColor>Created</Text></Box>
      </Box>
      {licenses.map((l: any) => (
        <Box key={l.id}>
          <Box width={38}><Text>{l.id}</Text></Box>
          <Box width={30}><Text>{l.name}</Text></Box>
          <Box width={22}><Text dimColor>{formatDate(l.createdAt)}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Get License ──────────────────────────────────────────

export function LicenseGet({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "License ID is required." }); return; }
    client.query<any>(GET_LICENSE, { id })
      .then((result) => setState({ loading: false, data: result?.fairuLicense, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading license..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">License not found.</Text>;

  const l = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">License Details</Text>
      <Text> </Text>
      <Text>  ID:      {l.id}</Text>
      <Text>  Name:    {l.name}</Text>
      <Text>  Created: {formatDate(l.createdAt)}</Text>
      <Text>  Updated: {formatDate(l.updatedAt)}</Text>
    </Box>
  );
}

// ─── Create License ──────────────────────────────────────

export function LicenseCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!flags.name) { setState({ loading: false, data: null, error: "--name is required." }); return; }
    const data: Record<string, any> = { name: flags.name };
    if (flags["copyright-id"]) data.copyright_id = flags["copyright-id"];
    if (flags.type) data.type = flags.type;
    if (flags.start) data.start = flags.start;
    if (flags.end) data.end = flags.end;
    if (flags.days) data.days = Number(flags.days);
    if (flags.active !== undefined) data.active = flags.active === true || flags.active === "true";
    if (flags.default !== undefined) data.default = flags.default === true || flags.default === "true";
    if (flags.interval) data.interval = flags.interval;
    if (flags["replace-date"]) data.replace_date = flags["replace-date"];
    if (flags["replace-license"] !== undefined) data.replace_license = flags["replace-license"] === true || flags["replace-license"] === "true";
    if (flags["replace-license-id"]) data.replace_license_id = flags["replace-license-id"];
    client.mutate<any>(CREATE_LICENSE, { data })
      .then((result) => setState({ loading: false, data: result?.createFairuLicense, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating license..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  return (
    <Box flexDirection="column">
      <Text color="green">License created successfully.</Text>
      <Text>  ID: {state.data?.id}</Text>
    </Box>
  );
}

// ─── Update License ──────────────────────────────────────

export function LicenseUpdate({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "License ID is required." }); return; }
    const data: Record<string, any> = { id };
    if (flags.name) data.name = flags.name;
    if (flags["copyright-id"]) data.copyright_id = flags["copyright-id"];
    if (flags.type) data.type = flags.type;
    if (flags.start) data.start = flags.start;
    if (flags.end) data.end = flags.end;
    if (flags.days) data.days = Number(flags.days);
    if (flags.active !== undefined) data.active = flags.active === true || flags.active === "true";
    if (flags.default !== undefined) data.default = flags.default === true || flags.default === "true";
    if (flags.interval) data.interval = flags.interval;
    if (flags["replace-date"]) data.replace_date = flags["replace-date"];
    if (flags["replace-license"] !== undefined) data.replace_license = flags["replace-license"] === true || flags["replace-license"] === "true";
    if (flags["replace-license-id"]) data.replace_license_id = flags["replace-license-id"];
    client.mutate<any>(UPDATE_LICENSE, { data })
      .then((result) => setState({ loading: false, data: result, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Updating license..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  return <Text color="green">License {id} updated.</Text>;
}

// ─── Delete License ──────────────────────────────────────

export function LicenseDelete({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "License ID is required." }); return; }
    client.mutate<any>(DELETE_LICENSE, { id, deleteAssets: flags["delete-assets"] || false })
      .then((result) => setState({ loading: false, data: result, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting license..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  return <Text color="green">License {id} deleted.</Text>;
}

import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import { LIST_COPYRIGHTS, GET_COPYRIGHT, CREATE_COPYRIGHT, UPDATE_COPYRIGHT, DELETE_COPYRIGHT } from "../graphql.js";

// ─── List Copyrights ──────────────────────────────────────

export function CopyrightList({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(LIST_COPYRIGHTS, {
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
    })
      .then((result) => setState({ loading: false, data: result?.fairuCopyrights, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading copyrights..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const copyrights = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;
  if (!copyrights.length) return <Text color="yellow">No copyrights found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Copyrights</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={22}><Text bold dimColor>Created</Text></Box>
      </Box>
      {copyrights.map((c: any) => (
        <Box key={c.id}>
          <Box width={38}><Text>{c.id}</Text></Box>
          <Box width={30}><Text>{c.name}</Text></Box>
          <Box width={22}><Text dimColor>{formatDate(c.createdAt)}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Get Copyright ────────────────────────────────────────

export function CopyrightGet({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Copyright ID is required." }); return; }
    client.query<any>(GET_COPYRIGHT, { id })
      .then((result) => setState({ loading: false, data: result?.fairuCopyright, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading copyright..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Copyright not found.</Text>;

  const c = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Copyright Details</Text>
      <Text> </Text>
      <Text>  ID:      {c.id}</Text>
      <Text>  Name:    {c.name}</Text>
      <Text>  Created: {formatDate(c.createdAt)}</Text>
      <Text>  Updated: {formatDate(c.updatedAt)}</Text>
    </Box>
  );
}

// ─── Create Copyright ────────────────────────────────────

export function CopyrightCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!flags.name) { setState({ loading: false, data: null, error: "--name is required." }); return; }
    const data: Record<string, any> = { name: flags.name };
    if (flags.email) data.email = flags.email;
    if (flags.phone) data.phone = flags.phone;
    if (flags.website) data.website = flags.website;
    client.mutate<any>(CREATE_COPYRIGHT, { data })
      .then((result) => setState({ loading: false, data: result?.createFairuCopyright, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating copyright..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  return (
    <Box flexDirection="column">
      <Text color="green">Copyright created successfully.</Text>
      <Text>  ID: {state.data?.id}</Text>
    </Box>
  );
}

// ─── Update Copyright ────────────────────────────────────

export function CopyrightUpdate({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Copyright ID is required." }); return; }
    const data: Record<string, any> = { id };
    if (flags.name) data.name = flags.name;
    if (flags.email) data.email = flags.email;
    if (flags.phone) data.phone = flags.phone;
    if (flags.website) data.website = flags.website;
    client.mutate<any>(UPDATE_COPYRIGHT, { data })
      .then((result) => setState({ loading: false, data: result, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Updating copyright..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  return <Text color="green">Copyright {id} updated.</Text>;
}

// ─── Delete Copyright ────────────────────────────────────

export function CopyrightDelete({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Copyright ID is required." }); return; }
    client.mutate<any>(DELETE_COPYRIGHT, { id, deleteAssets: flags["delete-assets"] || false, deleteLicenses: flags["delete-licenses"] || false })
      .then((result) => setState({ loading: false, data: result, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting copyright..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  return <Text color="green">Copyright {id} deleted.</Text>;
}

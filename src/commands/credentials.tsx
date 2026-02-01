import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import {
  LIST_CREDENTIALS,
  CREATE_CREDENTIAL,
  REVOKE_CREDENTIAL,
  DELETE_CREDENTIAL,
} from "../graphql.js";

// ─── List Credentials ────────────────────────────────────

export function CredentialList({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(LIST_CREDENTIALS, {})
      .then((result) => setState({ loading: false, data: result?.fairuRakuCredentials, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading credentials..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const credentials = state.data || [];
  if (!credentials.length) return <Text color="yellow">No credentials found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Credentials</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={20}><Text bold dimColor>Name</Text></Box>
        <Box width={20}><Text bold dimColor>Access Key</Text></Box>
        <Box width={8}><Text bold dimColor>Active</Text></Box>
      </Box>
      {credentials.map((c: any) => (
        <Box key={c.id}>
          <Box width={38}><Text>{c.id}</Text></Box>
          <Box width={20}><Text>{c.name}</Text></Box>
          <Box width={20}><Text dimColor>{c.access_key_id}</Text></Box>
          <Box width={8}><Text dimColor>{c.active ? "Yes" : "No"}</Text></Box>
        </Box>
      ))}
    </Box>
  );
}

// ─── Create Credential ──────────────────────────────────

export function CredentialCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const permissionsRaw = flags.permissions as string;
    if (!permissionsRaw) { setState({ loading: false, data: null, error: "--permissions is required." }); return; }
    const permissions = permissionsRaw.split(",").map((p) => p.trim());
    const name = (flags.name as string) || undefined;
    const bucket = (flags.bucket as string) || undefined;
    client.mutate<any>(CREATE_CREDENTIAL, { name, bucket, permissions })
      .then((result) => setState({ loading: false, data: result?.createFairuRakuCredential, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating credential..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const c = state.data;
  return (
    <Box flexDirection="column">
      <Text color="green">Credential created successfully.</Text>
      {c && (
        <>
          <Text>  ID:         {c.id}</Text>
          <Text>  Access Key: {c.access_key_id}</Text>
          <Text> </Text>
          <Text bold color="red">Store this secret! It will not be shown again:</Text>
          <Text bold>  {c.secret_access_key}</Text>
        </>
      )}
    </Box>
  );
}

// ─── Revoke Credential ──────────────────────────────────

export function CredentialRevoke({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Credential ID is required." }); return; }
    client.mutate(REVOKE_CREDENTIAL, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Revoking credential..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Credential {id} revoked.</Text>;
}

// ─── Delete Credential ──────────────────────────────────

export function CredentialDelete({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Credential ID is required." }); return; }
    client.mutate(DELETE_CREDENTIAL, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting credential..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Credential {id} deleted.</Text>;
}

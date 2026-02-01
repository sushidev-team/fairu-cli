import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import {
  LIST_DMCAS,
  GET_DMCA,
  CREATE_DMCA,
  UPDATE_DMCA,
} from "../graphql.js";

// ─── List DMCAs ──────────────────────────────────────────

export function DmcaList({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(LIST_DMCAS, {
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
    })
      .then((result) => setState({ loading: false, data: result?.fairuDmcas, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading DMCA complaints..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const dmcas = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;
  if (!dmcas.length) return <Text color="yellow">No DMCA complaints found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">DMCA Complaints</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={20}><Text bold dimColor>Name</Text></Box>
        <Box width={25}><Text bold dimColor>Email</Text></Box>
        <Box width={10}><Text bold dimColor>Status</Text></Box>
      </Box>
      {dmcas.map((d: any) => (
        <Box key={d.id}>
          <Box width={38}><Text>{d.id}</Text></Box>
          <Box width={20}><Text>{d.name}</Text></Box>
          <Box width={25}><Text dimColor>{d.email}</Text></Box>
          <Box width={10}><Text dimColor>{d.status}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Get DMCA ────────────────────────────────────────────

export function DmcaGet({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "DMCA ID is required." }); return; }
    client.query<any>(GET_DMCA, { id })
      .then((result) => setState({ loading: false, data: result?.fairuDmca, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading DMCA complaint..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">DMCA complaint not found.</Text>;

  const d = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">DMCA Details</Text>
      <Text> </Text>
      <Text>  ID:         {d.id}</Text>
      <Text>  Name:       {d.name}</Text>
      <Text>  Email:      {d.email}</Text>
      <Text>  Status:     {d.status}</Text>
      <Text>  Reply:      {d.reply || "-"}</Text>
      <Text>  Reply Send: {d.reply_send ? "Yes" : "No"}</Text>
    </Box>
  );
}

// ─── Create DMCA ─────────────────────────────────────────

export function DmcaCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    const name = flags.name as string;
    const email = flags.email as string;
    const url = flags.url as string;
    if (!name || !email || !url) { setState({ loading: false, done: false, error: "--name, --email, and --url are required." }); return; }
    const data: any = { name, email, url };
    if (flags.text) data.text = flags.text;

    client.mutate(CREATE_DMCA, { data })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Submitting DMCA complaint..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">DMCA complaint submitted.</Text>;
}

// ─── Update DMCA ─────────────────────────────────────────

export function DmcaUpdate({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "DMCA ID is required." }); return; }
    const data: any = { id };
    if (flags.reply) data.reply = flags.reply;
    if (flags["reply-send"] !== undefined) data.reply_send = flags["reply-send"] === true || flags["reply-send"] === "true";

    client.mutate<any>(UPDATE_DMCA, { data })
      .then((result) => setState({ loading: false, data: result?.updateFairuDmcaComplain, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Updating DMCA complaint..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">DMCA {id} updated.</Text>;
}

import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import {
  LIST_WORKFLOWS,
  GET_WORKFLOW,
  CREATE_WORKFLOW,
  UPDATE_WORKFLOW,
  DELETE_WORKFLOW,
} from "../graphql.js";

// ─── List Workflows ──────────────────────────────────────

export function WorkflowList({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(LIST_WORKFLOWS, {
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
    })
      .then((result) => setState({ loading: false, data: result?.fairuWorkflows, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading workflows..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const workflows = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;
  if (!workflows.length) return <Text color="yellow">No workflows found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Workflows</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={20}><Text bold dimColor>Name</Text></Box>
        <Box width={30}><Text bold dimColor>Type</Text></Box>
        <Box width={8}><Text bold dimColor>Active</Text></Box>
        <Box width={12}><Text bold dimColor>Status</Text></Box>
      </Box>
      {workflows.map((w: any) => (
        <Box key={w.id}>
          <Box width={38}><Text>{w.id}</Text></Box>
          <Box width={20}><Text>{w.name}</Text></Box>
          <Box width={30}><Text dimColor>{w.type}</Text></Box>
          <Box width={8}><Text dimColor>{w.active ? "Yes" : "No"}</Text></Box>
          <Box width={12}><Text dimColor>{w.status}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Get Workflow ────────────────────────────────────────

export function WorkflowGet({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Workflow ID is required." }); return; }
    client.query<any>(GET_WORKFLOW, { id })
      .then((result) => setState({ loading: false, data: result?.fairuWorkflow, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading workflow..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Workflow not found.</Text>;

  const w = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Workflow Details</Text>
      <Text> </Text>
      <Text>  ID:        {w.id}</Text>
      <Text>  Name:      {w.name}</Text>
      <Text>  Type:      {w.type}</Text>
      <Text>  Active:    {w.active ? "Yes" : "No"}</Text>
      <Text>  Status:    {w.status}</Text>
      <Text>  Has Error: {w.has_error ? "Yes" : "No"}</Text>
      <Text>  Created:   {formatDate(w.createdAt)}</Text>
      <Text>  Updated:   {formatDate(w.updatedAt)}</Text>
    </Box>
  );
}

// ─── Create Workflow ─────────────────────────────────────

export function WorkflowCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const name = flags.name as string;
    if (!name) { setState({ loading: false, data: null, error: "--name is required." }); return; }
    const data: any = { name };
    if (flags.type) data.type = flags.type;
    if (flags.active !== undefined) data.active = flags.active === true || flags.active === "true";
    if (flags.structure) data.structure = JSON.parse(flags.structure as string);
    client.mutate<any>(CREATE_WORKFLOW, { data })
      .then((result) => setState({ loading: false, data: result?.createFairuWorkflow, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating workflow..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">Workflow created successfully.</Text>
      {state.data && <Text>  ID: {state.data.id}</Text>}
    </Box>
  );
}

// ─── Update Workflow ─────────────────────────────────────

export function WorkflowUpdate({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Workflow ID is required." }); return; }
    const data: any = { id };
    if (flags.name) data.name = flags.name;
    if (flags.type) data.type = flags.type;
    if (flags.active !== undefined) data.active = flags.active === true || flags.active === "true";
    if (flags.structure) data.structure = JSON.parse(flags.structure as string);
    client.mutate(UPDATE_WORKFLOW, { data })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Updating workflow..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Workflow {id} updated.</Text>;
}

// ─── Delete Workflow ─────────────────────────────────────

export function WorkflowDelete({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Workflow ID is required." }); return; }
    client.mutate(DELETE_WORKFLOW, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting workflow..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Workflow {id} deleted.</Text>;
}

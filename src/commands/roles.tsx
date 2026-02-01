import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import {
  LIST_ROLES,
  GET_ROLE,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
} from "../graphql.js";

// ─── List Roles ──────────────────────────────────────────

export function RoleList({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(LIST_ROLES, {
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
    })
      .then((result) => setState({ loading: false, data: result?.fairuRoles, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading roles..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const roles = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;
  if (!roles.length) return <Text color="yellow">No roles found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Roles</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={22}><Text bold dimColor>Created</Text></Box>
      </Box>
      {roles.map((r: any) => (
        <Box key={r.id}>
          <Box width={38}><Text>{r.id}</Text></Box>
          <Box width={30}><Text>{r.name}</Text></Box>
          <Box width={22}><Text dimColor>{formatDate(r.createdAt)}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Get Role ────────────────────────────────────────────

export function RoleGet({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Role ID is required." }); return; }
    client.query<any>(GET_ROLE, { id })
      .then((result) => setState({ loading: false, data: result?.fairuRole, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading role..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Role not found.</Text>;

  const r = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Role Details</Text>
      <Text> </Text>
      <Text>  ID:          {r.id}</Text>
      <Text>  Name:        {r.name}</Text>
      <Text>  Permissions: {r.permissions?.length ? r.permissions.join(", ") : "-"}</Text>
      <Text>  Created:     {formatDate(r.createdAt)}</Text>
      <Text>  Updated:     {formatDate(r.updatedAt)}</Text>
    </Box>
  );
}

// ─── Create Role ─────────────────────────────────────────

export function RoleCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const name = flags.name as string;
    if (!name) { setState({ loading: false, data: null, error: "--name is required." }); return; }
    const data: any = { name };
    if (flags.permissions) data.permissions = (flags.permissions as string).split(",").map((p) => p.trim());

    client.mutate<any>(CREATE_ROLE, { data })
      .then((result) => setState({ loading: false, data: result?.createFairuRole, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating role..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">Role created successfully.</Text>
      {state.data && <Text>  ID: {state.data.id}</Text>}
    </Box>
  );
}

// ─── Update Role ─────────────────────────────────────────

export function RoleUpdate({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Role ID is required." }); return; }
    const data: any = { id };
    if (flags.name) data.name = flags.name;
    if (flags.permissions) data.permissions = (flags.permissions as string).split(",").map((p) => p.trim());

    client.mutate(UPDATE_ROLE, { data })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Updating role..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Role {id} updated.</Text>;
}

// ─── Delete Role ─────────────────────────────────────────

export function RoleDelete({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Role ID is required." }); return; }
    client.mutate(DELETE_ROLE, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting role..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Role {id} deleted.</Text>;
}

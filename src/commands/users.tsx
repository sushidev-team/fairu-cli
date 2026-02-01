import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import {
  LIST_USERS,
  GET_USER,
  INVITE_USER,
  DELETE_USER,
} from "../graphql.js";

// ─── List Users ──────────────────────────────────────────

export function UserList({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(LIST_USERS, {
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
    })
      .then((result) => setState({ loading: false, data: result?.fairuUsers, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading users..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const users = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;
  if (!users.length) return <Text color="yellow">No users found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Users</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={20}><Text bold dimColor>Name</Text></Box>
        <Box width={25}><Text bold dimColor>Email</Text></Box>
        <Box width={10}><Text bold dimColor>Status</Text></Box>
        <Box width={6}><Text bold dimColor>Owner</Text></Box>
      </Box>
      {users.map((u: any) => (
        <Box key={u.id}>
          <Box width={38}><Text>{u.id}</Text></Box>
          <Box width={20}><Text>{u.name}</Text></Box>
          <Box width={25}><Text>{u.email}</Text></Box>
          <Box width={10}><Text dimColor>{u.status}</Text></Box>
          <Box width={6}><Text dimColor>{u.owner ? "Yes" : "No"}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Get User ────────────────────────────────────────────

export function UserGet({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "User ID is required." }); return; }
    client.query<any>(GET_USER, { id })
      .then((result) => setState({ loading: false, data: result?.fairuUser, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading user..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">User not found.</Text>;

  const u = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">User Details</Text>
      <Text> </Text>
      <Text>  ID:     {u.id}</Text>
      <Text>  Name:   {u.name}</Text>
      <Text>  Email:  {u.email}</Text>
      <Text>  Status: {u.status}</Text>
      <Text>  Owner:  {u.owner ? "Yes" : "No"}</Text>
    </Box>
  );
}

// ─── Invite User ─────────────────────────────────────────

export function UserInvite({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    const email = flags.email as string;
    const role = flags.role as string;
    if (!email || !role) { setState({ loading: false, done: false, error: "--email and --role are required." }); return; }
    client.mutate(INVITE_USER, { email, role })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Inviting user..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">User invited successfully.</Text>;
}

// ─── Delete User ─────────────────────────────────────────

export function UserDelete({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "User ID is required." }); return; }
    client.mutate(DELETE_USER, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting user..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">User {id} deleted.</Text>;
}

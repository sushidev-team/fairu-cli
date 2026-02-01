import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import {
  LIST_GALLERIES,
  GET_GALLERY,
  GALLERY_ITEMS,
  CREATE_GALLERY,
  UPDATE_GALLERY,
  DELETE_GALLERY,
  SHARE_GALLERY,
} from "../graphql.js";

// ─── List Galleries ───────────────────────────────────────

export function GalleryList({
  flags,
  tenantId,
}: {
  flags: Record<string, string | boolean>;
  tenantId?: string;
}) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const tenants = tenantId ? [tenantId] : [];
    client.query<any>(LIST_GALLERIES, {
      tenants,
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
      search: (flags.search as string) || null,
    })
      .then((result) => setState({ loading: false, data: result?.fairuGalleries, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading galleries..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const galleries = state.data?.data || [];
  const pagination = state.data?.paginatorInfo;
  if (!galleries.length) return <Text color="yellow">No galleries found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Galleries</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={22}><Text bold dimColor>Created</Text></Box>
      </Box>
      {galleries.map((g: any) => (
        <Box key={g.id}>
          <Box width={38}><Text>{g.id}</Text></Box>
          <Box width={30}><Text>{g.name}</Text></Box>
          <Box width={22}><Text dimColor>{formatDate(g.createdAt)}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Get Gallery ──────────────────────────────────────────

export function GalleryGet({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Gallery ID is required." }); return; }
    client.query<any>(GET_GALLERY, { id })
      .then((result) => setState({ loading: false, data: result?.fairuGallery, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading gallery..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Gallery not found.</Text>;

  const g = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Gallery Details</Text>
      <Text> </Text>
      <Text>  ID:          {g.id}</Text>
      <Text>  Name:        {g.name}</Text>
      <Text>  Description: {g.description || "-"}</Text>
      <Text>  Location:    {g.location || "-"}</Text>
      <Text>  Date:        {g.date || "-"}</Text>
      <Text>  Created:     {formatDate(g.createdAt)}</Text>
      <Text>  Updated:     {formatDate(g.updatedAt)}</Text>
    </Box>
  );
}

// ─── Gallery Items ────────────────────────────────────────

export function GalleryItems({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Gallery ID is required." }); return; }
    client.query<any>(GALLERY_ITEMS, {
      id,
      page: flags.page ? Number(flags.page) : 1,
      perPage: flags["per-page"] ? Number(flags["per-page"]) : 20,
    })
      .then((result) => setState({ loading: false, data: result?.fairuGallery, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading gallery items..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const items = state.data?.itemsPaginated?.data || [];
  const pagination = state.data?.itemsPaginated?.paginatorInfo;
  const galleryName = state.data?.name;

  if (!items.length) return <Text color="yellow">Gallery is empty.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Gallery Items{galleryName ? ` - ${galleryName}` : ""}</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>ID</Text></Box>
        <Box width={30}><Text bold dimColor>Name</Text></Box>
        <Box width={20}><Text bold dimColor>Type</Text></Box>
      </Box>
      {items.map((item: any) => (
        <Box key={item.id}>
          <Box width={38}><Text>{item.id}</Text></Box>
          <Box width={30}><Text>{item.name}</Text></Box>
          <Box width={20}><Text dimColor>{item.mimeType}</Text></Box>
        </Box>
      ))}
      {pagination && (
        <><Text> </Text><Text dimColor>Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</Text></>
      )}
    </Box>
  );
}

// ─── Create Gallery ───────────────────────────────────────

export function GalleryCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const name = flags.name as string;
    if (!name) { setState({ loading: false, data: null, error: "--name is required." }); return; }
    const data: any = { name };
    if (flags.description) data.description = flags.description;
    if (flags.location) data.location = flags.location;
    if (flags.active !== undefined) data.active = flags.active === true || flags.active === "true";
    if (flags.date) data.date = flags.date;
    if (flags["exclude-from-list"] !== undefined) data.exclude_from_list = flags["exclude-from-list"] === true || flags["exclude-from-list"] === "true";
    if (flags["folder-id"]) data.folder_id = flags["folder-id"];
    if (flags["sorting-direction"]) data.sorting_direction = flags["sorting-direction"];
    if (flags["sorting-field"]) data.sorting_field = flags["sorting-field"];

    client.mutate<any>(CREATE_GALLERY, { data })
      .then((result) => setState({ loading: false, data: result?.createFairuGallery, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating gallery..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">Gallery created successfully.</Text>
      {state.data && <Text>  ID: {state.data.id}</Text>}
    </Box>
  );
}

// ─── Delete Gallery ───────────────────────────────────────

export function GalleryDelete({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Gallery ID is required." }); return; }
    client.mutate(DELETE_GALLERY, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Deleting gallery..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Gallery {id} deleted.</Text>;
}

// ─── Update Gallery ───────────────────────────────────────

export function GalleryUpdate({ id, flags }: { id: string; flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Gallery ID is required." }); return; }
    const data: any = { id };
    if (flags.name) data.name = flags.name;
    if (flags.description) data.description = flags.description;
    if (flags.location) data.location = flags.location;
    if (flags.active !== undefined) data.active = flags.active === true || flags.active === "true";
    if (flags.date) data.date = flags.date;
    if (flags["exclude-from-list"] !== undefined) data.exclude_from_list = flags["exclude-from-list"] === true || flags["exclude-from-list"] === "true";
    if (flags["folder-id"]) data.folder_id = flags["folder-id"];
    if (flags["sorting-direction"]) data.sorting_direction = flags["sorting-direction"];
    if (flags["sorting-field"]) data.sorting_field = flags["sorting-field"];

    client.mutate(UPDATE_GALLERY, { data })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Updating gallery..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Gallery {id} updated.</Text>;
}

// ─── Share Gallery ────────────────────────────────────────

export function GalleryShare({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: string | null; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Gallery ID is required." }); return; }
    client.mutate<any>(SHARE_GALLERY, { id })
      .then((result) => setState({ loading: false, data: result?.createFairuGalleryShareLink, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating share link..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">Share link created:</Text>
      <Text> </Text>
      <Text bold>{state.data}</Text>
    </Box>
  );
}

import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { TENANT_INFO, CREATE_TENANT, UPDATE_TENANT, SUPPORTED_DOMAINS } from "../graphql.js";
import { formatDate } from "../utils.js";

export function TenantInfo() {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(TENANT_INFO)
      .then((result) => setState({ loading: false, data: result?.fairuTenant, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading tenant info..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="yellow">Tenant info not available.</Text>;

  const t = state.data;
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Tenant Info</Text>
      <Text> </Text>
      <Text>  ID:   {t.id}</Text>
      <Text>  Name: {t.name}</Text>
    </Box>
  );
}

// ─── Create Tenant ───────────────────────────────────────

export function TenantCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const name = flags.name as string;
    if (!name) { setState({ loading: false, data: null, error: "--name is required." }); return; }
    client.mutate<any>(CREATE_TENANT, { name })
      .then((result) => setState({ loading: false, data: result?.createFairuTenant, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating tenant..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return (
    <Box flexDirection="column">
      <Text color="green">Tenant created successfully.</Text>
      <Text>  ID:      {state.data.id}</Text>
      <Text>  Name:    {state.data.name}</Text>
      <Text>  API Key: <Text bold>{state.data.api_key}</Text></Text>
      <Text dimColor>  (Save your API key now — it won't be shown again!)</Text>
    </Box>
  );
}

// ─── Update Tenant ───────────────────────────────────────

export function TenantUpdate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    const vars: any = {};
    if (flags.name) vars.name = flags.name;
    if (flags["use-ai"] !== undefined) vars.use_ai = flags["use-ai"];
    if (flags["use-ai-onupload"] !== undefined) vars.use_ai_onupload = flags["use-ai-onupload"];
    if (flags["custom-domain"]) vars.custom_domain = flags["custom-domain"];
    if (flags["force-file-alt"] !== undefined) vars.force_file_alt = flags["force-file-alt"];
    if (flags["force-file-caption"] !== undefined) vars.force_file_caption = flags["force-file-caption"];
    if (flags["force-file-description"] !== undefined) vars.force_file_description = flags["force-file-description"];
    if (flags["force-file-policy"] !== undefined) vars.force_file_policy = flags["force-file-policy"];
    if (flags["force-file-copyright"] !== undefined) vars.force_file_copyright = flags["force-file-copyright"];
    if (flags["force-license"] !== undefined) vars.force_license = flags["force-license"];
    if (flags["ai-blur-faces"] !== undefined) vars.ai_blur_faces = flags["ai-blur-faces"];
    if (flags["ai-language"]) vars.ai_language = flags["ai-language"];
    if (flags["ai-nsfw"] !== undefined) vars.ai_nsfw = flags["ai-nsfw"];
    if (flags["avatar-id"]) vars.avatar_id = flags["avatar-id"];
    if (flags["block-files-with-error"] !== undefined) vars.block_files_with_error = flags["block-files-with-error"];
    if (flags["hide-dotfiles"] !== undefined) vars.hide_dotfiles = flags["hide-dotfiles"];

    client.mutate(UPDATE_TENANT, vars)
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Updating tenant..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">Tenant updated.</Text>;
}

// ─── Supported Domains ──────────────────────────────────

export function TenantDomains() {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(SUPPORTED_DOMAINS)
      .then((result) => setState({ loading: false, data: result?.fairuSupportedDomains, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Loading supported domains..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const domains = state.data || [];
  if (!domains.length) return <Text color="yellow">No supported domains found.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Supported Domains</Text>
      <Text> </Text>
      {domains.map((d: string, i: number) => (
        <Text key={i}>  {d}</Text>
      ))}
    </Box>
  );
}

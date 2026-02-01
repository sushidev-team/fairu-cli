import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatDate } from "../utils.js";
import {
  CREATE_PDF_SIGNATURE,
  START_PDF_SIGNATURE,
  CANCEL_PDF_SIGNATURE,
  CREATE_FILE_ACCESS_SIGNATURE,
} from "../graphql.js";

// ─── Create PDF Signature ────────────────────────────────

export function PdfSignatureCreate({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const fileId = flags["file-id"] as string;
    if (!fileId) { setState({ loading: false, data: null, error: "--file-id is required." }); return; }
    const emailsRaw = flags.emails as string;
    const emailsArray = emailsRaw ? emailsRaw.split(",").map((e) => e.trim()) : undefined;
    const data: any = { file_id: fileId, emails: emailsArray };
    client.mutate<any>(CREATE_PDF_SIGNATURE, { data })
      .then((result) => setState({ loading: false, data: result?.createFairuPdfSignatureRequest, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating PDF signature request..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const s = state.data;
  return (
    <Box flexDirection="column">
      <Text color="green">PDF signature request created successfully.</Text>
      {s && (
        <>
          <Text>  ID:     {s.id}</Text>
          <Text>  Status: {s.status}</Text>
        </>
      )}
    </Box>
  );
}

// ─── Start PDF Signature ─────────────────────────────────

export function PdfSignatureStart({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, data: null, error: "Signature request ID is required." }); return; }
    client.mutate<any>(START_PDF_SIGNATURE, { id })
      .then((result) => setState({ loading: false, data: result?.startFairuPdfSignatureRequest, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Starting PDF signature request..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const s = state.data;
  return (
    <Box flexDirection="column">
      <Text color="green">PDF signature request {id} started.</Text>
      {s && <Text>  Status: {s.status}</Text>}
    </Box>
  );
}

// ─── Cancel PDF Signature ────────────────────────────────

export function PdfSignatureCancel({ id }: { id: string }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; done: boolean; error: string | null }>({
    loading: true, done: false, error: null,
  });

  useEffect(() => {
    if (!id) { setState({ loading: false, done: false, error: "Signature request ID is required." }); return; }
    client.mutate(CANCEL_PDF_SIGNATURE, { id })
      .then(() => setState({ loading: false, done: true, error: null }))
      .catch((e: Error) => setState({ loading: false, done: false, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Cancelling PDF signature request..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  return <Text color="green">PDF signature request {id} cancelled.</Text>;
}

// ─── File Access Sign ────────────────────────────────────

export function FileAccessSign({ flags }: { flags: Record<string, string | boolean> }) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    const idsRaw = flags.ids as string;
    if (!idsRaw) { setState({ loading: false, data: null, error: "--ids is required." }); return; }
    const idsArray = idsRaw.split(",").map((id) => id.trim());
    const validFor = flags["valid-for"] ? Number(flags["valid-for"]) : null;
    client.mutate<any>(CREATE_FILE_ACCESS_SIGNATURE, { ids: idsArray, valid_for_minutes: validFor || null })
      .then((result) => setState({ loading: false, data: result?.createFairuFileAccessSignature, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Creating file access signatures..." />;
  if (state.error) return <ErrorMessage error={state.error} />;

  const signatures = state.data || [];
  if (!signatures.length) return <Text color="yellow">No signatures returned.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">File Access Signatures</Text>
      <Text> </Text>
      <Box>
        <Box width={38}><Text bold dimColor>File ID</Text></Box>
        <Box width={40}><Text bold dimColor>Signature</Text></Box>
        <Box width={22}><Text bold dimColor>Expires</Text></Box>
      </Box>
      {signatures.map((s: any) => (
        <Box key={s.file_id}>
          <Box width={38}><Text>{s.file_id}</Text></Box>
          <Box width={40}><Text>{s.signature}</Text></Box>
          <Box width={22}><Text dimColor>{formatDate(s.expires_at)}</Text></Box>
        </Box>
      ))}
    </Box>
  );
}

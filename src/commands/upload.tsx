import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { formatBytes } from "../utils.js";

export function Upload({
  filePath,
  flags,
}: {
  filePath: string;
  flags: Record<string, string | boolean>;
}) {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{
    status: "idle" | "uploading" | "done" | "error";
    progress: number;
    result: any;
    error: string | null;
  }>({ status: "idle", progress: 0, result: null, error: null });

  useEffect(() => {
    if (!filePath) {
      setState((s) => ({ ...s, status: "error", error: "File path is required." }));
      return;
    }
    if (!existsSync(filePath)) {
      setState((s) => ({ ...s, status: "error", error: `File not found: ${filePath}` }));
      return;
    }

    setState((s) => ({ ...s, status: "uploading" }));

    const buffer = readFileSync(filePath);
    const fileName = basename(filePath);
    const file = new File([buffer], fileName);

    client.upload
      .simple(file, {
        folderId: flags.folder as string | undefined,
        alt: flags.alt as string | undefined,
        onProgress: (pct: number) => {
          setState((s) => ({ ...s, progress: pct }));
        },
      })
      .then((result) => setState({ status: "done", progress: 100, result, error: null }))
      .catch((e: Error) => setState((s) => ({ ...s, status: "error", error: e.message })));
  }, []);

  useEffect(() => {
    if (state.status === "done" || state.status === "error") app.exit();
  }, [state.status]);

  if (state.status === "error") return <ErrorMessage error={state.error!} />;

  if (state.status === "done" && state.result) {
    return (
      <Box flexDirection="column">
        <Text color="green">Upload complete!</Text>
        <Text>  ID:  {state.result.id}</Text>
        <Text>  URL: {state.result.url}</Text>
      </Box>
    );
  }

  const pct = state.progress;
  const barWidth = 30;
  const filled = Math.round((pct / 100) * barWidth);
  const bar = "\u2588".repeat(filled) + "\u2591".repeat(barWidth - filled);

  return (
    <Box flexDirection="column">
      <Text>
        <Text color="cyan">Uploading</Text> {basename(filePath || "")}
      </Text>
      <Text>
        <Text color="green">{bar}</Text> {pct.toFixed(0)}%
      </Text>
    </Box>
  );
}

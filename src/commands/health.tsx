import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import { useClient } from "../client.js";
import { Spinner } from "../components/Spinner.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import { HEALTH_CHECK } from "../graphql.js";

export function HealthCheck() {
  const app = useApp();
  const client = useClient();
  const [state, setState] = useState<{ loading: boolean; data: any; error: string | null }>({
    loading: true, data: null, error: null,
  });

  useEffect(() => {
    client.query<any>(HEALTH_CHECK)
      .then((result) => setState({ loading: false, data: result?.fairuHealthCheck, error: null }))
      .catch((e: Error) => setState({ loading: false, data: null, error: e.message }));
  }, []);

  useEffect(() => { if (!state.loading) app.exit(); }, [state.loading]);

  if (state.loading) return <Spinner label="Checking health..." />;
  if (state.error) return <ErrorMessage error={state.error} />;
  if (!state.data) return <Text color="red">Could not reach the API.</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Health Check</Text>
      <Text> </Text>
      <Text>  Status:  <Text color="green" bold>{state.data.status || "OK"}</Text></Text>
      {state.data.version && <Text>  Version: {state.data.version}</Text>}
    </Box>
  );
}

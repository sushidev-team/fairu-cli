import React from "react";
import { Box, Text } from "ink";

interface ErrorMessageProps {
  error: Error | string | unknown;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  let message: string;
  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = String(error);
  }

  return (
    <Box flexDirection="column">
      <Text color="red" bold>
        Error
      </Text>
      <Text color="red">{message}</Text>
    </Box>
  );
}

import React from "react";
import { vi } from "vitest";
import { render as inkRender } from "ink-testing-library";
import { ClientProvider } from "../client.js";

export function createMockClient() {
  return {
    assets: {
      list: vi.fn().mockResolvedValue({ data: [], paginatorInfo: null }),
      find: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined),
    },
    upload: {
      simple: vi.fn().mockResolvedValue({
        id: "uploaded-1",
        url: "https://files.fairu.app/uploaded-1",
      }),
    },
    query: vi.fn().mockResolvedValue({}),
    mutate: vi.fn().mockResolvedValue({}),
  };
}

export type MockClient = ReturnType<typeof createMockClient>;

export function renderWithClient(
  element: React.ReactElement,
  client?: MockClient,
) {
  const mockClient = client || createMockClient();
  const instance = inkRender(
    <ClientProvider value={mockClient as any}>{element}</ClientProvider>,
  );
  return {
    lastFrame: instance.lastFrame,
    frames: instance.frames,
    stdin: instance.stdin,
    unmount: instance.unmount,
    cleanup: instance.cleanup,
    mockClient,
  };
}

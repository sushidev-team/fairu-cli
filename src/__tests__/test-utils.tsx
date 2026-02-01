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

  // Helper to get the last non-empty frame (before app.exit() clears it)
  const getLastFrame = () => {
    const frames = instance.frames;
    // Find last non-empty frame (skip frames that are just whitespace/newlines)
    for (let i = frames.length - 1; i >= 0; i--) {
      const frame = frames[i];
      if (frame && frame.trim().length > 0) {
        return frame;
      }
    }
    return instance.lastFrame();
  };

  return {
    lastFrame: getLastFrame,
    frames: instance.frames,
    stdin: instance.stdin,
    unmount: instance.unmount,
    cleanup: instance.cleanup,
    mockClient,
  };
}

export async function waitForRender(ms = 100): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

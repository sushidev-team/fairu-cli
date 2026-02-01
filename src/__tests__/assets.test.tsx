import { describe, test, expect, vi, beforeEach } from "vitest";
import React from "react";
import {
  AssetsList,
  AssetGet,
  AssetSearch,
  AssetDelete,
  AssetBlock,
  AssetUnblock,
  AssetRename,
  AssetMove,
  AssetDuplicate,
  AssetUpdate,
} from "../commands/assets.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockAssets = [
  {
    id: "asset-1",
    name: "photo.jpg",
    mimeType: "image/jpeg",
    size: 102400,
    alt: "A photo",
    caption: "My caption",
    description: "A nice photo",
    blocked: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "asset-2",
    name: "document.pdf",
    mimeType: "application/pdf",
    size: 2048000,
    alt: "",
    caption: "",
    description: "",
    blocked: false,
    createdAt: "2024-02-20T12:00:00Z",
    updatedAt: "2024-02-20T12:00:00Z",
  },
];

describe("AssetsList", () => {
  test("renders list of assets", async () => {
    const client = createMockClient();
    client.assets.list.mockResolvedValue({
      data: mockAssets,
      paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
    });
    const { lastFrame } = renderWithClient(<AssetsList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("photo.jpg");
    expect(output).toContain("document.pdf");
    expect(output).toContain("Assets");
  });

  test("shows pagination info", async () => {
    const client = createMockClient();
    client.assets.list.mockResolvedValue({
      data: mockAssets,
      paginatorInfo: { currentPage: 1, lastPage: 3, total: 50 },
    });
    const { lastFrame } = renderWithClient(<AssetsList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Page 1");
    expect(output).toContain("50 total");
  });

  test("shows empty message when no assets", async () => {
    const client = createMockClient();
    client.assets.list.mockResolvedValue({
      data: [],
      paginatorInfo: null,
    });
    const { lastFrame } = renderWithClient(<AssetsList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("No assets found");
  });
});

describe("AssetGet", () => {
  test("renders asset details", async () => {
    const client = createMockClient();
    client.assets.find.mockResolvedValue(mockAssets[0]);
    const { lastFrame } = renderWithClient(<AssetGet id="asset-1" />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Asset Details");
    expect(output).toContain("asset-1");
    expect(output).toContain("photo.jpg");
    expect(output).toContain("image/jpeg");
    expect(output).toContain("A photo");
  });

  test("shows not found when asset is null", async () => {
    const client = createMockClient();
    client.assets.find.mockResolvedValue(null);
    const { lastFrame } = renderWithClient(<AssetGet id="unknown" />, client);
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("AssetSearch", () => {
  test("renders search results", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuSearch: {
        data: mockAssets,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(
      <AssetSearch query="photo" flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("Search Results");
    expect(output).toContain("photo.jpg");
  });

  test("shows no results message", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuSearch: { data: [], paginatorInfo: null },
    });
    const { lastFrame } = renderWithClient(
      <AssetSearch query="nonexistent" flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("No results");
  });
});

describe("AssetDelete", () => {
  test("calls delete and shows success", async () => {
    const client = createMockClient();
    client.assets.delete.mockResolvedValue(undefined);
    const { lastFrame } = renderWithClient(
      <AssetDelete id="asset-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.assets.delete).toHaveBeenCalledWith("asset-1");
    expect(output).toContain("deleted successfully");
  });
});

describe("AssetBlock", () => {
  test("calls mutate and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <AssetBlock id="asset-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("blocked");
  });
});

describe("AssetUnblock", () => {
  test("calls mutate and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <AssetUnblock id="asset-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("unblocked");
  });
});

describe("AssetRename", () => {
  test("calls mutate and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <AssetRename id="asset-1" name="renamed.jpg" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("renamed");
  });
});

describe("AssetMove", () => {
  test("calls mutate and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <AssetMove id="asset-1" targetFolder="folder-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("moved");
  });

  test("moves to root when no target", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <AssetMove id="asset-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(output).toContain("root");
  });
});

describe("AssetDuplicate", () => {
  test("calls mutate and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <AssetDuplicate id="asset-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("duplicated");
  });
});

describe("AssetUpdate", () => {
  test("calls assets.update with data", async () => {
    const client = createMockClient();
    client.assets.update.mockResolvedValue(undefined);
    const { lastFrame } = renderWithClient(
      <AssetUpdate
        id="asset-1"
        flags={{ name: "new-name.jpg", alt: "new alt text" }}
      />,
      client,
    );
    await new Promise((r) => setTimeout(r, 100));
    const output = lastFrame();
    expect(client.assets.update).toHaveBeenCalledWith({
      id: "asset-1",
      name: "new-name.jpg",
      alt: "new alt text",
    });
    expect(output).toContain("updated");
  });
});

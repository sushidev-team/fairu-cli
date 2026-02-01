import { describe, test, expect, vi, beforeEach } from "vitest";
import React from "react";
import {
  FolderList,
  FolderGet,
  FolderCreate,
  FolderDelete,
  FolderRename,
  FolderMove,
  FolderUpdate,
} from "../commands/folders.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockEntries = [
  {
    id: "folder-1",
    name: "Images",
    __typename: "FairuFolder",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "asset-1",
    name: "photo.jpg",
    __typename: "FairuAsset",
    createdAt: "2024-01-16T10:00:00Z",
  },
];

const mockFolder = {
  id: "folder-1",
  name: "Images",
  path: "/Images",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
};

describe("FolderList", () => {
  test("renders folder contents", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuFolder: {
        data: mockEntries,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(<FolderList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Images");
    expect(output).toContain("photo.jpg");
    expect(output).toContain("folder");
    expect(output).toContain("asset");
  });

  test("shows pagination", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuFolder: {
        data: mockEntries,
        paginatorInfo: { currentPage: 1, lastPage: 2, total: 20 },
      },
    });
    const { lastFrame } = renderWithClient(<FolderList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Page 1");
  });

  test("shows empty message", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuFolder: { data: [], paginatorInfo: null },
    });
    const { lastFrame } = renderWithClient(<FolderList flags={{}} />, client);
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("empty");
  });
});

describe("FolderGet", () => {
  test("renders folder details", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuFolderByPath: mockFolder });
    const { lastFrame } = renderWithClient(
      <FolderGet path="/Images" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Folder Details");
    expect(output).toContain("folder-1");
    expect(output).toContain("Images");
  });

  test("shows not found for unknown path", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuFolderByPath: null });
    const { lastFrame } = renderWithClient(
      <FolderGet path="/Unknown" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("FolderCreate", () => {
  test("creates folder and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuFolder: { id: "new-folder-1", name: "New Folder" },
    });
    const { lastFrame } = renderWithClient(
      <FolderCreate flags={{ name: "New Folder" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("created successfully");
  });

  test("shows error when name missing", async () => {
    const client = createMockClient();
    const { lastFrame } = renderWithClient(
      <FolderCreate flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("--name is required");
  });
});

describe("FolderDelete", () => {
  test("deletes folder and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <FolderDelete id="folder-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("deleted");
  });
});

describe("FolderRename", () => {
  test("renames folder and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <FolderRename id="folder-1" name="Renamed" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("renamed");
  });
});

describe("FolderMove", () => {
  test("moves folder and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <FolderMove id="folder-1" targetParent="folder-2" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("moved");
  });
});

describe("FolderUpdate", () => {
  test("updates folder and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <FolderUpdate id="folder-1" flags={{ name: "Updated" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("updated");
  });
});

import { describe, test, expect, vi, beforeEach } from "vitest";
import React from "react";
import {
  GalleryList,
  GalleryGet,
  GalleryItems,
  GalleryCreate,
  GalleryDelete,
  GalleryUpdate,
  GalleryShare,
} from "../commands/galleries.js";
import { createMockClient, renderWithClient } from "./test-utils.js";

const mockGalleries = [
  {
    id: "gallery-1",
    name: "Portfolio",
    description: "My work",
    location: "Vienna",
    date: "2024-06-01",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "gallery-2",
    name: "Showcase",
    description: "",
    createdAt: "2024-02-20T12:00:00Z",
    updatedAt: "2024-02-20T12:00:00Z",
  },
];

const mockItems = [
  { id: "item-1", name: "photo1.jpg", mimeType: "image/jpeg" },
  { id: "item-2", name: "photo2.png", mimeType: "image/png" },
];

describe("GalleryList", () => {
  test("renders list of galleries", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuGalleries: {
        data: mockGalleries,
        paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
      },
    });
    const { lastFrame } = renderWithClient(
      <GalleryList flags={{}} tenantId="t-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Portfolio");
    expect(output).toContain("Showcase");
    expect(output).toContain("Galleries");
  });

  test("shows empty message", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuGalleries: { data: [], paginatorInfo: null },
    });
    const { lastFrame } = renderWithClient(
      <GalleryList flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("No galleries found");
  });
});

describe("GalleryGet", () => {
  test("renders gallery details", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuGallery: mockGalleries[0] });
    const { lastFrame } = renderWithClient(
      <GalleryGet id="gallery-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("Gallery Details");
    expect(output).toContain("gallery-1");
    expect(output).toContain("Portfolio");
  });

  test("shows not found for unknown id", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({ fairuGallery: null });
    const { lastFrame } = renderWithClient(
      <GalleryGet id="unknown" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("not found");
  });
});

describe("GalleryItems", () => {
  test("renders gallery items", async () => {
    const client = createMockClient();
    client.query.mockResolvedValue({
      fairuGallery: {
        name: "Portfolio",
        itemsPaginated: {
          data: mockItems,
          paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 },
        },
      },
    });
    const { lastFrame } = renderWithClient(
      <GalleryItems id="gallery-1" flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("photo1.jpg");
    expect(output).toContain("photo2.png");
  });
});

describe("GalleryCreate", () => {
  test("creates gallery and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuGallery: { id: "gallery-new", name: "New Gallery" },
    });
    const { lastFrame } = renderWithClient(
      <GalleryCreate flags={{ name: "New Gallery" }} />,
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
      <GalleryCreate flags={{}} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(output).toContain("--name is required");
  });
});

describe("GalleryDelete", () => {
  test("deletes gallery and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <GalleryDelete id="gallery-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("deleted");
  });
});

describe("GalleryUpdate", () => {
  test("updates gallery and shows success", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({});
    const { lastFrame } = renderWithClient(
      <GalleryUpdate id="gallery-1" flags={{ name: "Updated" }} />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("updated");
  });
});

describe("GalleryShare", () => {
  test("creates share link and displays it", async () => {
    const client = createMockClient();
    client.mutate.mockResolvedValue({
      createFairuGalleryShareLink: "https://fairu.app/share/abc123",
    });
    const { lastFrame } = renderWithClient(
      <GalleryShare id="gallery-1" />,
      client,
    );
    await new Promise((r) => setTimeout(r, 50));
    const output = lastFrame();
    expect(client.mutate).toHaveBeenCalled();
    expect(output).toContain("https://fairu.app/share/abc123");
  });
});

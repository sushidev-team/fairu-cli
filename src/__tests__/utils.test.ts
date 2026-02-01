import { describe, test, expect } from "vitest";
import { parseArgs, formatBytes, formatDate } from "../utils.js";

describe("parseArgs", () => {
  test("parses resource and action", () => {
    const result = parseArgs(["node", "cli.js", "assets", "list"]);
    expect(result.resource).toBe("assets");
    expect(result.action).toBe("list");
    expect(result.positional).toEqual([]);
    expect(result.flags).toEqual({});
  });

  test("parses positional arguments", () => {
    const result = parseArgs([
      "node",
      "cli.js",
      "assets",
      "get",
      "abc-123",
    ]);
    expect(result.resource).toBe("assets");
    expect(result.action).toBe("get");
    expect(result.positional).toEqual(["abc-123"]);
  });

  test("parses --flag value", () => {
    const result = parseArgs([
      "node",
      "cli.js",
      "assets",
      "list",
      "--folder",
      "folder-id",
    ]);
    expect(result.flags.folder).toBe("folder-id");
  });

  test("parses --flag=value", () => {
    const result = parseArgs([
      "node",
      "cli.js",
      "assets",
      "list",
      "--folder=folder-id",
    ]);
    expect(result.flags.folder).toBe("folder-id");
  });

  test("parses boolean flags", () => {
    const result = parseArgs([
      "node",
      "cli.js",
      "assets",
      "list",
      "--help",
    ]);
    expect(result.flags.help).toBe(true);
  });

  test("parses short flags with value", () => {
    const result = parseArgs([
      "node",
      "cli.js",
      "assets",
      "list",
      "-p",
      "2",
    ]);
    expect(result.flags.p).toBe("2");
  });

  test("returns empty resource/action when no args", () => {
    const result = parseArgs(["node", "cli.js"]);
    expect(result.resource).toBe("");
    expect(result.action).toBe("");
  });

  test("handles multiple positional args", () => {
    const result = parseArgs([
      "node",
      "cli.js",
      "assets",
      "search",
      "my",
      "query",
    ]);
    expect(result.positional).toEqual(["my", "query"]);
  });

  test("handles mixed flags and positional args", () => {
    const result = parseArgs([
      "node",
      "cli.js",
      "assets",
      "search",
      "query",
      "--page",
      "2",
      "--per-page",
      "10",
    ]);
    expect(result.positional).toEqual(["query"]);
    expect(result.flags.page).toBe("2");
    expect(result.flags["per-page"]).toBe("10");
  });
});

describe("formatBytes", () => {
  test("formats 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  test("formats null/undefined", () => {
    expect(formatBytes(null)).toBe("0 B");
    expect(formatBytes(undefined)).toBe("0 B");
  });

  test("formats bytes", () => {
    expect(formatBytes(500)).toBe("500.0 B");
  });

  test("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
  });

  test("formats megabytes", () => {
    expect(formatBytes(1048576)).toBe("1.0 MB");
  });

  test("formats gigabytes", () => {
    expect(formatBytes(1073741824)).toBe("1.0 GB");
  });
});

describe("formatDate", () => {
  test("formats null/undefined", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
  });

  test("formats ISO date string", () => {
    const result = formatDate("2024-01-15T10:30:00.000Z");
    expect(result).toBeTruthy();
    expect(result).not.toBe("-");
  });
});

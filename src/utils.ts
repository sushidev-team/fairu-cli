export function formatBytes(bytes: number | undefined | null): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function formatDate(date: string | undefined | null): string {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
}

export interface ParsedArgs {
  resource: string;
  action: string;
  positional: string[];
  flags: Record<string, string | boolean>;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};

  // First pass: extract all flags
  const nonFlags: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg.startsWith("--")) {
      const eqIndex = arg.indexOf("=");
      if (eqIndex !== -1) {
        flags[arg.slice(2, eqIndex)] = arg.slice(eqIndex + 1);
      } else if (i + 1 < args.length && !args[i + 1]!.startsWith("-")) {
        flags[arg.slice(2)] = args[++i]!;
      } else {
        flags[arg.slice(2)] = true;
      }
    } else if (arg.startsWith("-") && arg.length > 1) {
      const key = arg.slice(1);
      if (i + 1 < args.length && !args[i + 1]!.startsWith("-")) {
        flags[key] = args[++i]!;
      } else {
        flags[key] = true;
      }
    } else {
      nonFlags.push(arg);
    }
  }

  const resource = nonFlags[0] || "";
  const action = nonFlags[1] || "";

  for (let i = 2; i < nonFlags.length; i++) {
    positional.push(nonFlags[i]!);
  }

  return { resource, action, positional, flags };
}

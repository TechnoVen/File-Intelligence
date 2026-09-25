/** Rust owns these wire contracts. Keep fixtures and Rust serialization in sync. */
export interface FoundationStatus {
  contractVersion: 1;
  phase: "foundation";
  capabilities: {
    rootSelection: false;
    scanning: false;
    proposalGeneration: false;
    execution: false;
    localAi: false;
  };
}

export const errorCodes = [
  "invalid_input", "root_not_authorized", "root_revoked", "outside_root",
  "parent_traversal", "absolute_path_not_allowed", "link_not_allowed",
  "unsupported_path", "not_found", "not_directory", "permission_denied",
  "cancelled", "io_error", "internal_error",
] as const;

export interface AppError {
  code: (typeof errorCodes)[number];
  message: string;
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

export function decodeFoundationStatus(value: unknown): FoundationStatus {
  const keys = ["rootSelection", "scanning", "proposalGeneration", "execution", "localAi"];
  if (!record(value) || !exactKeys(value, ["contractVersion", "phase", "capabilities"]) ||
      value.contractVersion !== 1 || value.phase !== "foundation" ||
      !record(value.capabilities) || !exactKeys(value.capabilities, keys)) {
    throw new Error("Unsupported foundation response.");
  }
  const capabilities = value.capabilities;
  if (!keys.every((key) => capabilities[key] === false)) {
    throw new Error("Unexpected foundation capabilities.");
  }
  return {
    contractVersion: 1,
    phase: "foundation",
    capabilities: { rootSelection: false, scanning: false, proposalGeneration: false, execution: false, localAi: false },
  };
}

export function decodeAppError(value: unknown): AppError | null {
  if (!record(value) || !exactKeys(value, ["code", "message"]) ||
      typeof value.message !== "string") return null;
  const code = errorCodes.find((code) => code === value.code);
  return code ? { code, message: value.message } : null;
}

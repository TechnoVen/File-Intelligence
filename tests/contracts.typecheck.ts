// Runs with Node's built-in TypeScript stripping; also checked by svelte-check.
import fixtures from "./fixtures/ipc-contracts.json" with { type: "json" };
import type { FoundationStatus } from "../src/lib/ipc/contracts";
// Node needs the source extension; the project's bundler type-checking does not.
const modulePath = "../src/lib/ipc/contracts.ts";
const { decodeAppError, decodeFoundationStatus }: typeof import("../src/lib/ipc/contracts") = await import(modulePath);

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const status: FoundationStatus = decodeFoundationStatus(fixtures.status);
assert(JSON.stringify(status) === JSON.stringify(fixtures.status), "Status fixture drift");
assert(decodeAppError(fixtures.error)?.code === "permission_denied", "Error fixture drift");

for (const invalid of [null, [], {}, { ...fixtures.status, contractVersion: 2 },
  { ...fixtures.status, extra: true },
  { ...fixtures.status, capabilities: { ...fixtures.status.capabilities, execution: true } },
  { ...fixtures.status, capabilities: { ...fixtures.status.capabilities, scanning: "false" } }]) {
  let rejected = false;
  try { decodeFoundationStatus(invalid); } catch { rejected = true; }
  assert(rejected, "Malformed status accepted");
}
for (const invalid of ["transport error", null, { code: "unknown", message: "test" },
  { code: "io_error", message: 123 }, { ...fixtures.error, extra: "unexpected" }]) {
  assert(decodeAppError(invalid) === null, "Transport/malformed error accepted as application error");
}
console.log("IPC contract checks passed.");

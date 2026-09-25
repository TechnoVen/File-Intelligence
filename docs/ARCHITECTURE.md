# Architecture

## Baseline

Production uses Rust, Tauri 2, Svelte/SvelteKit, and TypeScript.
SQLite is planned. Local inference is planned behind a replaceable
abstraction.

Phase 0B implements foundation status, internal Rust root/path observations,
analysis grants, structured errors, job primitives, and provisional lifecycle
vocabulary. It does not implement scanning, persistence, proposal generation,
file mutation, recovery execution, or AI.
The domain responsibilities below remain planned unless described as implemented.

## Implemented foundation modules

- `commands`: only `get_foundation_status`; no filesystem access.
- `contracts`: wire DTOs, opaque identifiers, and provisional lifecycle enums.
- `error`: stable error codes with path-free public messages.
- `roots`: optional Master Root configuration and process-local analysis grants.
- `paths`: lexical validation and point-in-time existing-path observations.
- `jobs`: progress records and cooperative cancellation; no workers or scheduler.
- `test_support`: test-only synthetic temporary fixtures under the repository's
  `src-tauri/target`, with no environment-selected temporary parent.

The application starts no root registry or filesystem job. Root preparation,
authorization, revocation, and observation are exercised only by fixture tests
in this phase. Master Root configuration does not grant analysis permission.
Root IDs cannot be reused within a registry after revocation; runtime and durable
ID allocation across sessions remain future work.

Proposal, Journal, Transaction, and Recovery enums are explicitly provisional
vocabulary, not transition engines, storage schemas, or execution APIs.
An `IntentDurable` enum value is not evidence of a durable journal write.

## Foundation wire contract

Rust owns the wire contract. JSON fields use camelCase, enum values use snake_case,
and IDs are opaque strings. Progress sequence/count values serialize as decimal
strings; an unknown total is null. Cancellation requests are idempotent and shared,
but acknowledgement is a separate job state. Phase 1 must implement bounded worker
checkpoints, terminal-status retention, and rejection of late progress updates.

The sole production application command reports contract version 1 and foundation
status, with root selection, scanning, proposal generation, execution, and AI all
unavailable. No root/path helper is exposed through IPC. The application command
manifest and main-window permission allow only `get_foundation_status`; opener
registration and permission are absent. Existing opener dependencies remain unused.

The frontend wrapper accepts unknown IPC data and validates the status/error shape.
It distinguishes application errors, transport failures, and contract mismatches.
Manual TypeScript definitions are checked against shared synthetic JSON fixtures
and Rust serialization tests. This is not generated structural equivalence.
Backend-only lifecycle vocabulary is not duplicated in frontend types.

Production CSP permits local assets and Tauri IPC, with no remote content or eval.
The development CSP additionally permits loopback Vite HMR. Non-loopback development
hosts require a deliberate future policy change; they are not implicitly allowed.
Desktop runtime CSP/IPC behavior still needs interactive platform validation.

## Observation is not operation-time authorization

Relative requests reject absolute paths, prefixes, parent traversal, and implicit
empty-root selection. Root selection is explicit; existing root candidates resolve
ancestor aliases and expose the resolved location for future confirmation.
Selected roots that are links are rejected. Existing children are inspected for
links component by component, canonicalized, and checked using path components.
Missing paths are errors; no destination or parent is created.

Windows input policy rejects UNC/device roots, reparse points, stream syntax, and
ambiguous reserved names. Unix native path bytes are preserved without lossy
conversion, case folding, or Unicode normalization for authorization.
Lexical non-Unicode preservation is tested on Unix. The local macOS filesystem
rejects invalid UTF-8 filenames; the disk-level non-Unicode case targets Linux
and is not claimed as a macOS filesystem pass.

These checks are point-in-time observations. They cannot detect every replacement
with another ordinary directory at the same path and do not close TOCTOU races.
They do not inspect mount boundaries. Phase 1 must establish operation-time
containment and mount policy before real directory traversal or file opening.

## Ownership and dependency direction

Svelte renders backend results and captures user intent.
Tauri handlers validate requests and invoke Rust services.
Rust domain services own decisions and filesystem authority.
Storage, filesystem, platform, extraction, and inference adapters
provide replaceable implementation details.

Keep command handlers thin and domain logic independently testable.
Start with modules; separate crates only when justified.

## Rust responsibilities

Root policy and containment.
Scanning and metadata observations.
Hashing and exact duplicate detection.
Index persistence and migrations.
Taxonomy, entities, deterministic rules, and classification.
Proposal construction and validation.
Transaction planning, execution, verification, recovery, and rollback.
Content extraction and local-AI orchestration.

## IPC

Use explicit request/result types and structured errors.
Rust validates roots, identifiers, destinations, and operation scope.
Frontend validation improves usability but is not a security boundary.

Long-running jobs need identifiers, progress, cancellation, bounded
resource use, and partial-result semantics.

Execution references a backend-validated, reviewed plan.
Changes to files, destinations, rules, or taxonomy can invalidate it.
Do not expose generic unrestricted move/delete commands.

## Domain distinctions

A file observation records evidence at a point in time.
A classification records evidence, provenance, and uncertainty.
A proposal records intended changes and their preconditions.
Approval identifies the reviewed plan revision.
An execution records actual operation outcomes.
A journal records durable intent and subsequent lifecycle events.

Do not collapse these into one frontend status flag.

## Persistence

SQLite will store indexed observations and application configuration,
with explicit schema versions and migrations.
The index is derived from filesystem observations.
Recovery history must not be discarded when rebuilding the index.

Application databases, journals, caches, and models belong in explicit
application-data locations, separate from the organizational taxonomy.
Tests inject fixture-local storage locations.

## Filesystem mutation boundary

All changes to user files and directories pass through the transaction
engine, including rename, move, directory creation, Trash, and restore.
Taxonomy lookup and proposal generation have no user-file side effects.

SQLite and filesystem changes are not one atomic transaction.
Use durable intent before mutation, explicit operation states,
verification, and restart reconciliation. See SAFETY.md.

## Phase and execution gates

Phases 1–6 are read-only with respect to user files and directories.
Explicit application-state writes, such as indexing and configuration,
are permitted within their authorized phases and storage scope.
Phase 7A implements and validates transactions and recovery using
synthetic temporary fixtures; it does not enable live user-file execution.
Phase 7B enables controlled execution only after the relevant safety gates.

Initial execution requires human approval of a specific plan.
Permanent deletion and unattended execution are outside the initial
implementation scope. Deletion uses native OS Trash/Recycle Bin.
AI has no filesystem mutation authority.
Automated filesystem tests must use isolated synthetic temporary fixtures
and fixture-local storage, as required by SAFETY.md.

## Frontend and reference boundary

Production source is under src/ and src-tauri/.
reference/ is not production source or an authoritative specification.

Review CSP, permissions, content rendering, and external-opening
behavior before adding file previews or new IPC capabilities.

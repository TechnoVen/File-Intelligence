# Architecture

## Baseline

Production uses Rust, Tauri 2, Svelte/SvelteKit, and TypeScript.
SQLite is planned. Local inference is planned behind a replaceable
abstraction.

The current implementation is the starter UI and greet command.
The boundaries below describe the intended architecture.

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

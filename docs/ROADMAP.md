# Roadmap

## Status

Phase 0 — Foundation.
The production application exposes foundation status only. Phase 0B root/path
primitives and lifecycle vocabulary do not enable scanning or file mutation.
Reference screenshots, mock records, and historical milestones are not
evidence of completed production phases.

## Phases

### 0A — Repository constitution

Approve product, ownership, safety, taxonomy, AI, and roadmap documents.

### 0B — Engineering and safety foundations

Establish fixture isolation, explicit root policy, IPC/error conventions,
reference-source separation, and initial automated checks.
Define proposal, journal, and recovery lifecycle contracts.

Implemented scope: ordinary Rust modules, structured errors, internal analysis
grants, conservative existing-path observations, synthetic fixtures, progress and
cancellation primitives, provisional lifecycle enums, and typed foundation IPC.
No transition engine, persistence abstraction, worker, or mutation API is included.

Validation commands: cargo fmt --check, cargo check, cargo clippy --all-targets,
cargo test, pnpm check, node tests/contracts.typecheck.ts, and pnpm build.
The conventional CI workflow runs checks on macOS, Linux, and Windows. Adding the
workflow is not evidence that those remote platform runs passed. Platform-specific
safety behavior and desktop CSP/IPC require validation on each claimed platform.

Local macOS validation: formatting, cargo check, Clippy with warnings denied,
20 Rust tests (none ignored), frontend type checking, executable IPC contract
checks, and the frontend production build passed. Linux/Windows CI has not run
in this implementation session. Non-Unicode disk-name preservation is a Linux
test; macOS validates lexical preservation only because its filesystem rejected
the synthetic invalid UTF-8 name.

### 1 — Read-only scanner

Implement explicit-root inventory, link policy, metadata observations,
progress, cancellation, and partial-error reporting.
Gate: no user-file mutations; synthetic-fixture validation passes.
Before real traversal, resolve operation-time containment and TOCTOU/link races,
root identity and mount-crossing policy, explicit root confirmation, and runtime
job/root identifier allocation. Phase 0B canonicalization is not sufficient
authorization for opening or enumerating a directory.

### 2 — SQLite index

Add migrations, scan identity, observation freshness, stale/missing-file
handling, and isolated application storage.
Keep rebuildable index data distinct from durable recovery history.

### 3 — Hashing and exact duplicates

Add cryptographic hashing, changed-during-read handling, exact groups,
and retained-copy selection.
Gate: findings only; no duplicate removal.

### 4 — Editable taxonomy and entity configuration

Add stable identities, validated mappings, editable entities and aliases.
Editing configuration does not create or reorganize filesystem folders.

### 5 — Deterministic rule engine

Evaluate available evidence with explicit precedence, explanations,
conflict handling, and versioned configuration.
Content-dependent conditions remain unavailable until extraction exists.

### 6 — Proposal and review engine

Add plans, dry-run previews, human review, stale-plan detection, and
explicit collision reporting.
Gate: proposal/review only; execution remains unavailable.

### 7A — Transaction engine and recovery

Implement durable intent before mutation, operation lifecycle, restart
reconciliation, verification, and compensating rollback using synthetic
temporary fixtures. Do not enable live user-file execution in this phase.
Gate: failure-injection and recovery validation before live execution.

### 7B — Controlled execution

Enable reviewed mutation types incrementally.
Validate move/rename and directory creation before expanding operations.
Gate native OS Trash/Recycle Bin and restore separately; refuse unsupported
platform behavior.
Keep permanent deletion and unattended execution outside initial scope.

### 8 — Content extraction

Add bounded extraction, provenance, parser isolation, and content-based
deterministic classification. Extend existing proposals and review.

### 9 — Local AI

Add a replaceable local inference adapter and evaluate usefulness against
deterministic baselines. AI remains advisory and optional, with no
filesystem mutation authority.

### 10 — Cross-platform hardening

Complete the support matrix, performance work, and platform edge cases.
Cross-platform safety starts in Phase 0 and is tested throughout.

### 11 — Packaging and release

Validate installation, upgrades, migrations, recovery documentation,
privacy defaults, and declared platform support.

## Shared safety gates

Phases 1–6 are read-only with respect to user files and directories.
Explicit application-state writes, such as indexing and configuration,
are permitted within their authorized phases and storage scope.
Every user-file mutation requires durable journal intent before action.
Initial execution requires human approval of a specific plan; permanent
deletion and unattended execution must not be introduced as bypasses.
Automated filesystem tests must use isolated synthetic temporary fixtures
and fixture-local storage, as required by SAFETY.md.

## Completion rule

A phase is complete only when its behavior and safety gate are validated.
A UI control, mock success message, or design document is not a completed
backend capability.

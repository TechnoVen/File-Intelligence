# Safety Contract

## Non-negotiable rules

Dry-run first.
No permanent deletion by default.
AI cannot move, rename, overwrite, or delete files.
Every user-file mutation goes through the transaction engine.
Every mutation has durable journal intent before action.
Execution requires verification and architecturally supported rollback.
Exact duplicates require cryptographic content hashes.
Duplicate removal requires fresh verification immediately before action.
Deletion uses native OS Trash/Recycle Bin.
Symlinks are not recursively followed by default.
Filesystem roots are explicit.
Automated filesystem tests use synthetic temporary fixtures only.

These must be enforced in Rust when the corresponding capabilities are
implemented; they are not optional UI preferences. The current starter
application does not implement these capabilities.

## Phase gates

Phases 1–6 are read-only with respect to user files and directories.
Explicit application-state writes, such as indexing and configuration,
are permitted within their authorized phases and storage scope.
Phase 7A implements and validates transactions and recovery using
synthetic temporary fixtures; it does not enable live user-file execution.
Phase 7B enables controlled execution only after the relevant safety gates.
Permanent deletion and unattended execution are outside the initial
implementation scope and must not be implemented as settings or bypasses.

## Scope and containment

Authorize scan roots and mutation destinations separately.
Validate containment in Rust, accounting for links, path aliases,
platform path semantics, and files replaced during operations.
Do not traverse junctions or equivalent links implicitly.
Unsupported or ambiguous cases fail closed.

Dry-run does not mutate source files, destination files, or taxonomy
directories. Any application-state writes are explicit and must not
appear as completed filesystem operations.

## Reviewed execution

Initial execution requires human approval of a specific plan.
High confidence and deterministic rule matches do not bypass review.
Revalidate preconditions at execution; stale plans require fresh review.
Never silently overwrite a destination.

## Journal and recovery

Persist operation identity, reviewed plan identity, source/destination,
preconditions, available integrity evidence, and recovery information
before mutation.

Record execution, verification, failure, and recovery outcomes.
Incomplete records must remain representable.
On restart, reconcile unfinished operations before resuming mutations.
Rollback is a verified compensating operation with its own journal
records; it does not erase history.

A batch can partially complete. Do not claim cross-file atomicity.
Journal hashes detect differences; they do not reconstruct lost bytes.
Do not promise unconditional rollback or zero data loss.

## Duplicate removal

Only exact hash-verified matches qualify for duplicate removal.
Recheck both retained and removed files immediately before action.
Protect at least one verified retained copy across the entire batch.
Detect changes or identity mismatches and abort affected operations.
Similarity, matching names, and file size alone are insufficient.

## Trash and platform support

Use native Trash/Recycle Bin adapters, not a hard-coded Trash path.
If safe Trash behavior is unavailable, refuse deletion.
Record available restore identifiers and limitations.
If an item was removed from Trash or changed externally, report that
recovery is unavailable; never fabricate success.

Enable each mutation type only after its platform behavior, collision
handling, failure handling, and recovery have been validated.
Cross-volume operations need a separate verified protocol.

## Test isolation

Automated tests must never operate on:
~/Documents, ~/Desktop, ~/Downloads, iCloud Drive, OneDrive,
Google Drive, Dropbox, pCloud, or external user drives.

Create fresh synthetic temporary roots and inject all storage paths.
All test application-state writes must use fixture-local storage.
Validate fixture ownership and containment before operations or cleanup.
Never follow a fixture link into a real user location.
Use fake platform adapters for ordinary Trash tests; platform integration
tests must also use isolated synthetic storage.

Safety validation includes stale files, link escapes, collisions,
permissions, interrupted execution, journal failures, partial batches,
and failed rollback.

## Untrusted content

Treat filenames, extracted content, and model output as untrusted data.
Do not execute embedded instructions or render active document content
with application privileges.

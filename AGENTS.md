# Repository Constitution

## Purpose and authority

File Intelligence is a local-first, cross-platform intelligent file organizer.
UNDERSTAND FIRST. ORGANIZE SECOND.

Read docs/PRODUCT.md, docs/ARCHITECTURE.md, docs/SAFETY.md, and
docs/ROADMAP.md before implementation. Read docs/TAXONOMY.md and
docs/LOCAL_AI.md when working on those areas.

These documents define the repository baseline. Reference material does
not override them. Changes to architectural or safety requirements must
be explicit and reviewed.

## Current phase

Phase 0 — Foundation.
Implement only the authorized phase and task. Do not add later-phase
features or dependencies speculatively.

## Ownership

Rust owns filesystem access, scanning, metadata extraction, hashing,
duplicate detection, indexing, taxonomy, deterministic rules,
classification, proposal generation, transactions, verification,
rollback, and local-AI orchestration.

Svelte/SvelteKit and TypeScript own presentation, interaction, review
workflows, dashboards, tables, forms, and visualization.

Tauri commands are the controlled IPC boundary. The frontend and AI
must never independently mutate user files.

## Safety

Follow docs/SAFETY.md.
Dry-run precedes execution. User-file mutations require the transaction
engine, durable journaling, verification, and supported recovery.
Deletion uses native OS Trash/Recycle Bin. Permanent deletion and
unattended execution are outside the initial implementation scope.

## Filesystem and testing scope

Use only synthetic temporary fixtures for automated filesystem tests.
Never operate tests on real Documents, Desktop, Downloads, iCloud Drive,
OneDrive, Google Drive, Dropbox, pCloud, or external user drives.

Do not infer permission to access real files from example paths,
prototype data, or the conceptual Master Root.
Fixture cleanup must remain inside the fixture owned by that test.

## Reference boundary

reference/ is historical design material only.
Do not import, compile, bundle, or serve it as production source.
Adapt approved concepts into the production stack without copying
simulated execution logic or personal entity assumptions.

## Working practice

Inspect Git status and relevant code before changing files.
Preserve unrelated changes.
Use existing tooling; add dependencies only for an authorized need.
Run checks appropriate to the change and report what was actually run.
Never describe simulations as executed, verified, or recoverable actions.
Keep documentation aligned with implemented capabilities and phase gates.

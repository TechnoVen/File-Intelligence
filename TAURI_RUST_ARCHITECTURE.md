# File Intelligence: Rust/Tauri Technical Architecture & Project Specification

**Version:** 1.0.0-draft  
**Target Platform:** macOS (APFS), Linux (ext4/btrfs), Windows (NTFS) via Tauri v2  
**Core Directive:** Local-First, Zero Cloud Dependency, Cryptographic Safety Guarantee  

---

## 1. Executive Summary & Design Principles

File Intelligence is an offline-first desktop filesystem utility designed to bring deterministic structure, deduplication, and intelligent taxonomy to personal and professional local files. 

### Core Architectural Principles
1. **Safety from Our Own Transaction Journal:** We do NOT rely on external APFS snapshots or filesystem-specific features for safety. All operations are governed by an append-only, ACID-compliant SQLite transaction journal with pre- and post-operation SHA-256 hash checks.
2. **Decoupled Taxonomy:** AI and deterministic rules never bind to literal filesystem paths. They bind to **Stable Taxonomy Identifiers** (e.g., `professional.employment.cosfair`), which are mapped to physical paths via a local database. Reorganizing folder trees never breaks rule definitions.
3. **No Autonomous AI Moves:** Machine learning is restricted to *proposal generation*. Execution requires explicit user approval or verified deterministic rule matching, and is always dry-run verifiable.
4. **Zero Cloud Telemetry:** All document classification, hashing, and metadata extraction execute strictly on the local machine.

---

## 2. System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TAURI FRONTEND (WEBVIEW)                        │
│   React 19 + TypeScript + Tailwind CSS (Native Desktop UI Archetype)   │
│   - Review Queue & Dashboard         - Rules Hierarchy Builder         │
│   - Duplicate Resolution (5-Check)   - Folder Intelligence & Taxonomy │
│   - 8-Field Transaction Journal Log  - Dry-Run Execution Simulator     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Tauri IPC (Commands & Event Streams)
┌───────────────────────────────────▼────────────────────────────────────┐
│                      RUST CORE ENGINE (BACKEND)                        │
├────────────────────────────────────────────────────────────────────────┤
│  1. Tauri Command Handlers (`src-tauri/src/commands/`)                 │
│     - scan_directory(), preview_moves(), execute_batch(), rollback()   │
│                                                                        │
│  2. Atomic Transaction Journal (`file_intel_journal`)                  │
│     - SQLite WAL mode journal storing 8-field mutation records         │
│     - Pre-image and post-image SHA-256 validation                      │
│                                                                        │
│  3. Taxonomy Engine (`file_intel_taxonomy`)                            │
│     - Stable ID tree (<domain>.<category>.<node>)                      │
│     - Physical path resolver with directory sync & conflict prevention │
│                                                                        │
│  4. Safety & Pre-flight Verifier (`file_intel_preflight`)              │
│     - 5-step atomic check state machine before any mutation or trash   │
│                                                                        │
│  5. Tiered Rules Engine (`file_intel_rules`)                           │
│     - Tier 1: BUILT-IN DEFAULT | Tier 2: YOUR RULE | Tier 3: TEMPORARY │
│     - Boolean AST evaluation: filename, mime, text, metadata           │
│                                                                        │
│  6. Local Intelligence Runner (`file_intel_ai`)                        │
│     - Candle / ONNX local runtime (small embedding + zero network)     │
│     - Purely advisory classification provider                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Atomic Transaction Journal Specification

The safety guarantee is powered by an embedded SQLite database running with `PRAGMA journal_mode = WAL;` and `PRAGMA synchronous = EXTRA;`.

### 3.1 SQLite Journal Schema

```sql
CREATE TABLE IF NOT EXISTS journal_transactions (
    id TEXT PRIMARY KEY,                       -- e.g. "tx-20260910-001"
    batch_id TEXT NOT NULL,                    -- grouping for batch rollback
    timestamp INTEGER NOT NULL,                -- Unix epoch milliseconds
    operation TEXT NOT NULL,                   -- 'MOVE', 'RENAME', 'MOVE_TO_TRASH', 'RESTORE'
    original_path TEXT NOT NULL,               -- absolute original filesystem path
    destination_path TEXT NOT NULL,            -- absolute resulting filesystem path
    original_hash TEXT NOT NULL,               -- pre-operation SHA-256 checksum
    resulting_hash TEXT NOT NULL,              -- post-operation SHA-256 checksum
    file_size_bytes INTEGER NOT NULL,          -- file size in bytes
    stable_taxonomy_id TEXT,                   -- associated taxonomy binding
    rule_id TEXT,                              -- rule that triggered the mutation
    classification_source TEXT NOT NULL,       -- 'Rule #101', 'Local AI', 'Manual'
    verification_result TEXT NOT NULL,         -- 'PASS', 'SKIPPED_CONFLICT', 'FAILED'
    rolled_back_at INTEGER,                    -- Unix epoch milliseconds if reversed
    rollback_tx_id TEXT                        -- forward reference to reversal tx
);

CREATE TABLE IF NOT EXISTS taxonomy_mappings (
    stable_id TEXT PRIMARY KEY,                -- e.g. "professional.employment.cosfair"
    parent_id TEXT,                            -- e.g. "professional.employment"
    display_name TEXT NOT NULL,                -- e.g. "CosFair GmbH"
    physical_path TEXT NOT NULL,               -- e.g. "/Users/alex/Documents/02_Areas/..."
    category_type TEXT NOT NULL,               -- 'project', 'area', 'resource', 'archive'
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS rules_definition (
    id TEXT PRIMARY KEY,                       -- e.g. "rule-101"
    tier TEXT NOT NULL,                        -- 'BUILT-IN DEFAULT', 'YOUR RULE', 'TEMPORARY RULE'
    name TEXT NOT NULL,
    priority INTEGER NOT NULL,                 -- 1 (lowest) to 100 (highest)
    logic TEXT NOT NULL,                       -- 'AND' | 'OR'
    conditions_json TEXT NOT NULL,             -- serialized AST conditions
    actions_json TEXT NOT NULL,                -- serialized actions
    stable_taxonomy_id TEXT NOT NULL,          -- bound taxonomy target
    safety_mode TEXT NOT NULL,                 -- 'suggest only', 'require approval', 'trusted'
    enabled BOOLEAN NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

### 3.2 Journal Invariant Checks
Before an operation is committed:
1. `original_hash` is computed on the file at `original_path`.
2. The mutation occurs atomically (e.g. `fs::rename` or trash dispatch).
3. If the mutation is a move/rename, `resulting_hash` is computed on the file at `destination_path`.
4. If `original_hash != resulting_hash`, a **FATAL INTEGRITY ALERT** is logged, the operation is immediately rolled back, and the transaction is flagged `FAILED`.

---

## 4. Stable Taxonomy ID Mapping System

Filesystem paths are fluid; users frequently rename, nest, or relocate folders. If rules or AI classifiers depend on literal path strings, those bindings break whenever paths change.

### 4.1 Taxonomy Identifier Format
- **Root Domains:**
  - `projects.*`: Finite active work with delivery outcomes (e.g. `projects.business.the_den`)
  - `areas.*`: Ongoing responsibilities without fixed end-dates (e.g. `areas.personal.housing`)
  - `resources.*`: Reference materials, specs, books (e.g. `resources.tech.rust`)
  - `archive.*`: Inactive, completed, or historic documents (e.g. `archive.financial_2024`)

### 4.2 Resolution Algorithm
When a rule triggers destination `projects.business.the_den`:
1. The Rust Taxonomy Resolver looks up `projects.business.the_den` in `taxonomy_mappings`.
2. Returns current path: `~/Documents/01_Projects/Business_Projects/THE_DEN`.
3. If the directory does not exist, the engine creates it safely with standard user permissions (`0755`).
4. If the user moves `THE_DEN` to `~/Documents/01_Projects/Archived_Ven/THE_DEN`, the user updates the path mapping once in the UI. **All 47 rules referencing `projects.business.the_den` automatically resolve to the new location with zero rule edits.**

---

## 5. Duplicate Safeguard: 5-Step Pre-Flight Pipeline

When duplicates are queued for relocation to the OS Trash:

```text
[ Trigger: Move Duplicate Replica to OS Trash ]
                      │
                      ▼
 ┌──────────────────────────────────────────────┐
 │ Check 1: Canonical file exists at dest?      │ ──► [FAIL: Skip & Flag Conflict]
 └──────────────────────┬───────────────────────┘
                        ▼ (PASS)
 ┌──────────────────────────────────────────────┐
 │ Check 2: Canonical SHA-256 hash verified?    │ ──► [FAIL: Skip & Flag Hash Mismatch]
 └──────────────────────┬───────────────────────┘
                        ▼ (PASS)
 ┌──────────────────────────────────────────────┐
 │ Check 3: Duplicate replica still exists?     │ ──► [FAIL: Skip & Flag Stale Replica]
 └──────────────────────┬───────────────────────┘
                        ▼ (PASS)
 ┌──────────────────────────────────────────────┐
 │ Check 4: Duplicate hash == Canonical hash?   │ ──► [FAIL: Skip & Flag Not A Clone]
 └──────────────────────┬───────────────────────┘
                        ▼ (PASS)
 ┌──────────────────────────────────────────────┐
 │ Check 5: Canonical NOT in trash set?         │ ──► [FAIL: Fatal Safety Block]
 └──────────────────────┬───────────────────────┘
                        ▼ (PASS)
 [ Execute: Dispatch Replica to OS Trash via trash crate ]
                        │
                        ▼
 [ Append Transaction to Atomic SQLite Journal with Full Hashes ]
```

---

## 6. Tauri IPC Command Interface

```rust
// Proposed Rust Command Signatures

#[tauri::command]
pub async fn scan_inbox(
    paths: Vec<String>,
    app_handle: tauri::AppHandle
) -> Result<ScanTelemetry, String>;

#[tauri::command]
pub async fn evaluate_proposed_moves(
    file_ids: Vec<String>
) -> Result<Vec<ProposedMoveResult>, String>;

#[tauri::command]
pub async fn preflight_duplicate_verification(
    canonical_path: String,
    duplicate_paths: Vec<String>
) -> Result<DuplicatePreflightReport, String>;

#[tauri::command]
pub async fn execute_journaled_batch(
    operations: Vec<PendingOperation>,
    dry_run: bool
) -> Result<BatchExecutionResult, String>;

#[tauri::command]
pub async fn rollback_batch(
    batch_id: String
) -> Result<RollbackReport, String>;

#[tauri::command]
pub async fn update_taxonomy_mapping(
    stable_id: String,
    new_physical_path: String
) -> Result<(), String>;
```

---

## 7. Next Steps & Implementation Milestones
- **Phase 1 (Complete):** Finalized desktop UX archetype, 3-level rule hierarchy, 8-field journal UI, editable taxonomy trees, and 5-check pre-flight modal.
- **Phase 2 (Current):** Freeze UI direction; review Rust/Tauri architecture specification.
- **Phase 3 (Next):** Implement Tauri v2 scaffolding with SQLite journal core and pre-flight state machine prior to wiring real filesystem mutations.

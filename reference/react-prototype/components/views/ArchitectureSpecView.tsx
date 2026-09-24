import React, { useState } from 'react';
import {
  Code,
  ShieldCheck,
  HardDrive,
  Database,
  Hash,
  Terminal,
  FileCheck,
  CheckCircle2,
  Cpu,
  Layers,
  FileText,
  Copy,
  Check,
  ArrowRight,
  GitBranch,
  Lock
} from 'lucide-react';

export const ArchitectureSpecView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'journal' | 'taxonomy' | 'preflight' | 'ipc'>('overview');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div id="architecture-spec-view" className="p-6 space-y-5 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#232530]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Rust / Tauri Technical Architecture
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-[#1e212b] border border-[#2d3140] text-[#909bb0] font-mono">
              Engine Specification v1.0
            </span>
          </div>
          <p className="text-xs text-[#7f889d] mt-0.5">
            Technical blueprint defining the atomic transaction journal, stable taxonomy resolver, and 5-check safety pipeline before filesystem mutation code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-md bg-[#13151c] border border-[#242735] text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Filesystem Safety Guard Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222430] pb-1 overflow-x-auto">
        {[
          { id: 'overview' as const, label: 'System Overview & Crates', icon: Layers },
          { id: 'journal' as const, label: '8-Field Transaction Journal', icon: Database },
          { id: 'taxonomy' as const, label: 'Stable Taxonomy ID Engine', icon: Hash },
          { id: 'preflight' as const, label: '5-Step Pre-Flight Safeguard', icon: ShieldCheck },
          { id: 'ipc' as const, label: 'Tauri IPC Signatures', icon: Terminal },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#222533] text-white border border-[#2f3346]'
                  : 'text-[#7d869b] hover:text-[#c4cbd9] hover:bg-[#181a24]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-[#646d80]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SYSTEM OVERVIEW & CRATES */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#14161d] border border-[#232635] space-y-3 text-xs leading-relaxed text-[#abb5c7]">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Local-First, Zero-Snapshot Dependency Architecture</span>
            </div>
            <p>
              Unlike legacy tools that rely on fragile APFS or ZFS volume snapshots (which fail on FAT32, exFAT, external USBs, or cross-platform Linux/Windows targets), File Intelligence provides an <strong>autonomous cryptographic safety guarantee</strong> through its own embedded ACID-compliant transaction journal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-[#15161c] border border-[#242633] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold block">
                Crate 1: file_intel_journal
              </span>
              <h3 className="text-xs font-bold text-white">Atomic Transaction Journal</h3>
              <p className="text-[11px] text-[#788295] leading-normal">
                SQLite WAL-mode engine logging pre-image and post-image SHA-256 hashes for every file mutation. Supports instant zero-loss rollback.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#15161c] border border-[#242633] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
                Crate 2: file_intel_taxonomy
              </span>
              <h3 className="text-xs font-bold text-white">Stable Taxonomy Resolver</h3>
              <p className="text-[11px] text-[#788295] leading-normal">
                Decouples rules and AI models from literal paths. Maps stable dot-separated identifiers (e.g. <code className="text-blue-300">professional.employment.cosfair</code>) to dynamic paths.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#15161c] border border-[#242633] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                Crate 3: file_intel_preflight
              </span>
              <h3 className="text-xs font-bold text-white">5-Step Mutation Verifier</h3>
              <p className="text-[11px] text-[#788295] leading-normal">
                Strict state machine ensuring canonical files exist, checksums re-verify, duplicate replicas match byte-for-byte, and canonicals are never in the trash set.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 8-FIELD TRANSACTION JOURNAL */}
      {activeTab === 'journal' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#14161d] border border-[#232635] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  SQLite Schema: Exact 8 Journal Fields
                </h3>
              </div>
              <button
                onClick={() => copyCode('schema', `CREATE TABLE journal_transactions (
    id TEXT PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    operation TEXT NOT NULL,
    original_path TEXT NOT NULL,
    destination_path TEXT NOT NULL,
    original_hash TEXT NOT NULL,
    resulting_hash TEXT NOT NULL,
    verification_result TEXT NOT NULL
);`)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
              >
                {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'schema' ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-3 rounded bg-[#0c0d11] border border-[#1e202a] font-mono text-xs text-[#a9b3c5] overflow-x-auto leading-relaxed">
{`CREATE TABLE journal_transactions (
    id TEXT PRIMARY KEY,                -- 1. Unique transaction ID (e.g. tx-20260910-001)
    timestamp INTEGER NOT NULL,         -- 2. Epoch timestamp
    operation TEXT NOT NULL,            -- 3. MOVE | RENAME | MOVE_TO_TRASH | RESTORE
    original_path TEXT NOT NULL,        -- 4. Exact original filesystem path
    destination_path TEXT NOT NULL,     -- 5. Exact destination filesystem path
    original_hash TEXT NOT NULL,        -- 6. SHA-256 hash prior to mutation
    resulting_hash TEXT NOT NULL,       -- 7. SHA-256 hash post-mutation (verified identical)
    verification_result TEXT NOT NULL   -- 8. PASS | SKIPPED_CONFLICT | FAILED
);`}
            </pre>
          </div>

          <div className="rounded-lg bg-[#15161c] border border-[#242633] p-4 space-y-2 text-xs text-[#8d97ac]">
            <span className="font-semibold text-white block">Rollback Verification Protocol</span>
            <p>
              When a rollback is requested for a file, the engine computes the SHA-256 checksum of the current file at <code className="text-white">destination_path</code>, verifies it matches <code className="text-white">resulting_hash</code>, atomic-moves it back to <code className="text-white">original_path</code>, and writes a reverse transaction entry into the journal.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: STABLE TAXONOMY ID ENGINE */}
      {activeTab === 'taxonomy' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#14161d] border border-[#232635] space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-400" />
              <span>Decoupling Rules & AI from Physical Path Strings</span>
            </h3>
            <p className="text-xs text-[#959faa] leading-relaxed">
              If an AI model or rule outputs <code className="text-amber-300">~/Documents/02_Areas/02_Professional/Employment/CosFair_GmbH</code>, moving that folder breaks all downstream operations. In File Intelligence, rules and classifiers bind exclusively to <strong>Stable Taxonomy IDs</strong>.
            </p>

            <div className="p-3 rounded bg-[#0d0e12] border border-[#1e212c] font-mono text-xs space-y-2">
              <div className="text-[#6c7587]">
                // Rule output binds to Stable ID:
              </div>
              <div className="text-blue-300">
                target_taxonomy_id: <span className="text-emerald-300">"professional.employment.cosfair"</span>
              </div>
              <div className="text-[#6c7587] pt-1">
                // Taxonomy resolver translates to physical path in O(1):
              </div>
              <div className="text-[#abb5c7]">
                resolver.get_path("professional.employment.cosfair") → <span className="text-white">"/Users/alex/Documents/02_Areas/02_Professional/Employment/CosFair_GmbH"</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 5-STEP PRE-FLIGHT SAFEGUARD */}
      {activeTab === 'preflight' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#14161d] border border-[#232635] space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>The 5-Step Pre-Flight Verification State Machine</span>
            </h3>
            <p className="text-xs text-[#959faa]">
              Every single duplicate removal or batch relocation executes through this non-negotiable verification sequence before touching the filesystem.
            </p>

            <div className="space-y-2">
              {[
                { step: 1, name: 'Canonical Exists', test: 'fs::metadata(canonical_path).is_ok()', outcome: 'PASS or ABORT' },
                { step: 2, name: 'Canonical Hash Integrity', test: 'sha256(canonical_path) == stored_canonical_hash', outcome: 'PASS or ABORT' },
                { step: 3, name: 'Duplicate Exists', test: 'fs::metadata(duplicate_path).is_ok()', outcome: 'PASS or SKIP' },
                { step: 4, name: 'Duplicate Hash Match', test: 'sha256(duplicate_path) == canonical_hash', outcome: 'PASS or ABORT' },
                { step: 5, name: 'Canonical Protection', test: '!deletion_set.contains(canonical_path)', outcome: 'PASS or FATAL' },
              ].map(chk => (
                <div key={chk.step} className="p-2.5 rounded bg-[#0d0e12] border border-[#1e202b] flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">Step {chk.step}:</span>
                    <span className="text-white font-semibold">{chk.name}</span>
                    <span className="text-[#646d80] text-[11px]">({chk.test})</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">{chk.outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TAURI IPC SIGNATURES */}
      {activeTab === 'ipc' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#14161d] border border-[#232635] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>Rust Command Signatures (`src-tauri/src/commands.rs`)</span>
              </h3>
              <button
                onClick={() => copyCode('rust', `#[tauri::command]
pub async fn execute_journaled_batch(
    operations: Vec<PendingOperation>,
    dry_run: bool
) -> Result<BatchExecutionResult, String>;`)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
              >
                {copiedSection === 'rust' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'rust' ? 'Copied' : 'Copy Rust'}</span>
              </button>
            </div>

            <pre className="p-3 rounded bg-[#0c0d11] border border-[#1e202a] font-mono text-xs text-[#abb5c8] overflow-x-auto leading-relaxed">
{`#[tauri::command]
pub async fn execute_journaled_batch(
    operations: Vec<PendingOperation>,
    dry_run: bool
) -> Result<BatchExecutionResult, String> {
    if dry_run {
        return file_intel_preflight::simulate_batch(&operations).await;
    }
    file_intel_journal::execute_and_verify(&operations).await
}

#[tauri::command]
pub async fn rollback_transaction(
    tx_id: String
) -> Result<RollbackReport, String> {
    file_intel_journal::revert_transaction(&tx_id).await
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

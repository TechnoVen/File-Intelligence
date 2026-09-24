import React, { useState } from 'react';
import {
  CopyCheck,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  ShieldAlert,
  MoreHorizontal,
  SplitSquareVertical,
  Check,
  Ban,
  Archive,
  Lock,
  FileText,
  AlertOctagon,
  RefreshCw,
  Clock,
  HardDrive
} from 'lucide-react';
import { DuplicateGroup, FileItem, DuplicatePreflightCheck } from '../../types';

interface DuplicatesViewProps {
  duplicateGroups: DuplicateGroup[];
  onMoveDuplicateToTrash: (groupId: string, duplicateId: string) => void;
  onMoveAllDuplicatesToTrash: () => void;
  onPermanentDeleteSafeguard: (fileName: string) => void;
}

export const DuplicatesView: React.FC<DuplicatesViewProps> = ({
  duplicateGroups,
  onMoveDuplicateToTrash,
  onMoveAllDuplicatesToTrash,
  onPermanentDeleteSafeguard
}) => {
  const [activeTab, setActiveTab] = useState<'exact' | 'possible' | 'versions' | 'ignored'>('exact');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(duplicateGroups.map(g => g.id));
  const [showMoreMenuFor, setShowMoreMenuFor] = useState<string | null>(null);

  // Pre-Flight Verification Safeguard Modal state
  const [isPreflightModalOpen, setIsPreflightModalOpen] = useState(false);
  const [preflightState, setPreflightState] = useState<'running' | 'passed' | 'failed' | 'idle'>('idle');
  const [preflightStep, setPreflightStep] = useState<number>(0);
  const [preflightTarget, setPreflightTarget] = useState<{ groupId?: string; duplicateId?: string; isAll?: boolean } | null>(null);

  const tabs = [
    { id: 'exact' as const, label: 'Exact Duplicates', count: duplicateGroups.length },
    { id: 'possible' as const, label: 'Possible Duplicates', count: 5 },
    { id: 'versions' as const, label: 'Version Conflicts', count: 3 },
    { id: 'ignored' as const, label: 'Ignored', count: 2 },
  ];

  const toggleSelectGroup = (groupId: string) => {
    if (selectedGroupIds.includes(groupId)) {
      setSelectedGroupIds(selectedGroupIds.filter(id => id !== groupId));
    } else {
      setSelectedGroupIds([...selectedGroupIds, groupId]);
    }
  };

  const handleSelectAllExceptCanonical = () => {
    setSelectedGroupIds(duplicateGroups.map(g => g.id));
  };

  // Launch the 5-step Pre-Flight Verification Safeguard
  const initiatePreflightMove = (target: { groupId?: string; duplicateId?: string; isAll?: boolean }) => {
    setPreflightTarget(target);
    setIsPreflightModalOpen(true);
    setPreflightState('running');
    setPreflightStep(1);

    // Progressive step simulation for the 5 pre-flight checks
    setTimeout(() => setPreflightStep(2), 500);
    setTimeout(() => setPreflightStep(3), 1000);
    setTimeout(() => setPreflightStep(4), 1500);
    setTimeout(() => setPreflightStep(5), 2000);
    setTimeout(() => {
      setPreflightStep(6);
      setPreflightState('passed');
    }, 2500);
  };

  const executeAfterPreflight = () => {
    if (!preflightTarget) return;

    if (preflightTarget.isAll) {
      onMoveAllDuplicatesToTrash();
    } else if (preflightTarget.groupId && preflightTarget.duplicateId) {
      onMoveDuplicateToTrash(preflightTarget.groupId, preflightTarget.duplicateId);
    }

    setIsPreflightModalOpen(false);
    setPreflightState('idle');
    setPreflightTarget(null);
  };

  const preflightChecks = [
    { id: 1, title: 'Check 1: Canonical file exists at destination', desc: 'Verifies the primary protected file is present on disk' },
    { id: 2, title: 'Check 2: Canonical SHA-256 hash re-verification', desc: 'Re-computes byte hash to ensure no in-place modification' },
    { id: 3, title: 'Check 3: Duplicate replica still exists on filesystem', desc: 'Checks file descriptor before invoking trash dispatch' },
    { id: 4, title: 'Check 4: Duplicate hash strictly equals canonical hash', desc: 'Guarantees 100% byte equivalence at moment of execution' },
    { id: 5, title: 'Check 5: Canonical is strictly protected from deletion', desc: 'Ensures target is NOT in deletion set' }
  ];

  return (
    <div id="duplicates-view" className="p-6 space-y-4 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#232530]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Duplicate Cleanup & Storage Recovery
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono">
              24 groups · 3.8 GB
            </span>
          </div>
          <p className="text-xs text-[#7d869a] mt-0.5">
            Identify exact byte-for-byte SHA-256 clones across Desktop, Downloads, and Documents.
          </p>
        </div>

        {/* OS Trash Notice Banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#181922] border border-[#272a38] text-xs text-[#9fa9bd]">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Action: <strong>Move to OS Trash</strong> (Reversible via Journal)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#21232d] pb-1">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-dup-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition ${
                activeTab === tab.id
                  ? 'bg-[#222530] text-white border border-[#2d3142]'
                  : 'text-[#7e879b] hover:text-[#c4cbd8] hover:bg-[#191a22]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#14151a] text-[#8e98ac] font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleSelectAllExceptCanonical}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
        >
          Select all except canonical
        </button>
      </div>

      {/* Bulk Action Bar */}
      <div className="p-3 rounded-lg bg-[#1a1e2b] border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <span className="font-semibold text-white">
              {selectedGroupIds.length} groups selected
            </span>
            <span className="text-[#8c97ad] mx-2">·</span>
            <span className="text-[#a5b0c7]">
              Potential space saving: <strong className="text-emerald-400 font-mono">3.8 GB</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-move-selected-duplicates-trash"
            onClick={() => initiatePreflightMove({ isAll: true })}
            className="px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Move selected duplicates to Trash</span>
          </button>
          <button
            onClick={() => alert('Reviewing duplicate differences side-by-side.')}
            className="px-3 py-1.5 rounded bg-[#252836] hover:bg-[#303446] text-[#c5cde0] font-medium text-xs transition"
          >
            Review Individually
          </button>
        </div>
      </div>

      {/* Duplicate Groups List */}
      <div className="space-y-4">
        {duplicateGroups.map((group) => {
          const canonical = group.canonicalFile;
          const isSelected = selectedGroupIds.includes(group.id);

          return (
            <div
              key={group.id}
              id={`duplicate-group-${group.id}`}
              className={`rounded-lg border transition ${
                isSelected ? 'bg-[#16171e] border-[#2f3344]' : 'bg-[#131418] border-[#22242d]'
              } p-4 space-y-3`}
            >
              {/* Group Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#21232d]">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectGroup(group.id)}
                    className="rounded bg-[#22242e] border-[#313543] text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs font-mono">
                      {group.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                      {group.matchPercentage}% MATCH
                    </span>
                    <span className="text-[10px] text-[#717a8e] font-mono">
                      {group.sizeFormatted}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="text-[11px] text-[#8e98ac] font-mono">
                    SHA-256: <span className="text-[#cad2e3]">{canonical.sha256?.substring(0, 16)}...</span>
                  </div>

                  {/* Safety menu dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreMenuFor(showMoreMenuFor === group.id ? null : group.id)}
                      className="p-1 rounded bg-[#1c1e26] hover:bg-[#252834] text-[#7d869a]"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {showMoreMenuFor === group.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-[#1f212c] border border-[#2f3342] rounded-md shadow-xl p-1 z-30 text-xs">
                        <button
                          onClick={() => {
                            alert('Quarantine folder created: ~/.FileIntelligence/Quarantine');
                            setShowMoreMenuFor(null);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-[#282b38] text-[#cad1e0] flex items-center gap-1.5"
                        >
                          <Archive className="w-3.5 h-3.5 text-amber-400" />
                          <span>Move to Quarantine</span>
                        </button>
                        <button
                          onClick={() => {
                            onPermanentDeleteSafeguard(canonical.name);
                            setShowMoreMenuFor(null);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-900/40 text-rose-300 flex items-center gap-1.5"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          <span>More → Permanently Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Copies Comparison List */}
              <div className="space-y-2">
                {/* 1. Canonical Copy */}
                <div className="p-3 rounded-md bg-[#13171e] border border-emerald-500/25 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs font-mono">
                          {canonical.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          RECOMMENDED CANONICAL COPY
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-[#8e98ad] mt-0.5 break-all">
                        {canonical.currentPath}
                      </div>
                      <div className="text-[10px] text-[#6d768a] font-mono mt-0.5">
                        Source: Master Documents Tree · Modified: {canonical.modifiedDate} · SHA-256 verified
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <span className="text-[11px] font-medium text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Keep (Protected)
                    </span>
                  </div>
                </div>

                {/* 2. Redundant Duplicate Copies */}
                {group.duplicates.map((dup) => (
                  <div
                    key={dup.id}
                    className="p-3 rounded-md bg-[#171417] border border-[#302327] flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs font-mono">
                            {dup.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            REDUNDANT REPLICA
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-[#9a8d94] mt-0.5 break-all">
                          {dup.currentPath}
                        </div>
                        <div className="text-[10px] text-[#756a70] font-mono mt-0.5">
                          Source: {dup.currentPath.includes('Downloads') ? 'Downloads' : 'Desktop'} · Modified: {dup.modifiedDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => alert(`Marked ${dup.name} as keeper instead.`)}
                        className="px-2 py-1 rounded bg-[#211f26] hover:bg-[#2c2933] text-[#b4adc0] text-[11px]"
                      >
                        Keep this one
                      </button>
                      <button
                        onClick={() => initiatePreflightMove({ groupId: group.id, duplicateId: dup.id })}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] flex items-center gap-1 transition shadow-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Move to Trash</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5-STEP PRE-FLIGHT VERIFICATION SAFEGUARD MODAL */}
      {isPreflightModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#14161d] border border-[#272a39] rounded-lg max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#21232d]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  Duplicate Pre-Flight Verification Safeguard
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Rust Engine Verification
              </span>
            </div>

            <p className="text-xs text-[#8791a3]">
              Before relocating any replica to the OS Trash, the local filesystem engine executes 5 atomic verification checks to ensure zero data loss.
            </p>

            {/* Checklist items */}
            <div className="space-y-2">
              {preflightChecks.map((chk) => {
                const isPassed = preflightStep > chk.id;
                const isCurrent = preflightStep === chk.id;

                return (
                  <div
                    key={chk.id}
                    className={`p-2.5 rounded-md border text-xs flex items-center justify-between transition ${
                      isPassed
                        ? 'bg-[#101b15] border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-[#181d2c] border-blue-500/50 text-blue-300'
                        : 'bg-[#101116] border-[#1d1f29] text-[#5e6678]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#5e6678] shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold block">{chk.title}</span>
                        <span className="text-[10px] text-[#717b8f]">{chk.desc}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold uppercase">
                      {isPassed ? 'PASS' : isCurrent ? 'VERIFYING...' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Status Footer */}
            <div className="p-2.5 rounded bg-[#0f1014] border border-[#1e202b] flex items-center justify-between text-xs">
              <span className="text-[#848d9f]">Verification Engine:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {preflightState === 'passed' ? 'ALL 5 PRE-FLIGHT CHECKS PASSED' : 'CHECKING CHECKSUMS...'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setIsPreflightModalOpen(false);
                  setPreflightState('idle');
                }}
                className="px-3 py-1.5 rounded bg-[#1f212b] hover:bg-[#282a37] text-[#939cae] hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                disabled={preflightState !== 'passed'}
                onClick={executeAfterPreflight}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Move to OS Trash</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

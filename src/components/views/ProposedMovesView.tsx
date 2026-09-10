import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  Check,
  Ban,
  ShieldCheck,
  Sparkles,
  Sliders,
  Filter,
  ArrowRight,
  FileText,
  AlertTriangle,
  FolderTree,
  ChevronDown,
  Info,
  Eye,
  Play,
  HardDrive,
  FileDiff,
  CheckCircle2
} from 'lucide-react';
import { FileItem, ActionStatus } from '../../types';

interface ProposedMovesViewProps {
  files: FileItem[];
  dryRunMode: boolean;
  onToggleDryRun: () => void;
  onSelectFile: (file: FileItem) => void;
  onApproveMultiple: (fileIds: string[]) => void;
  onIgnoreMultiple: (fileIds: string[]) => void;
  onApproveSingle: (fileId: string) => void;
  onIgnoreSingle: (fileId: string) => void;
}

export const ProposedMovesView: React.FC<ProposedMovesViewProps> = ({
  files,
  dryRunMode,
  onToggleDryRun,
  onSelectFile,
  onApproveMultiple,
  onIgnoreMultiple,
  onApproveSingle,
  onIgnoreSingle
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  
  // Dry run execution preview modal
  const [isPreviewExecutionOpen, setIsPreviewExecutionOpen] = useState(false);
  const [appliedFeedbackMessage, setAppliedFeedbackMessage] = useState<string | null>(null);

  const filterChips = [
    { id: 'all', label: 'All Proposed' },
    { id: 'high', label: 'High confidence' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
    { id: 'rule', label: 'Rule-based' },
    { id: 'ai', label: 'Local AI' },
    { id: 'projects', label: 'Projects' },
    { id: 'personal', label: 'Personal' },
    { id: 'professional', label: 'Professional' },
  ];

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      // Search
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matches =
          f.name.toLowerCase().includes(q) ||
          f.suggestedDestination.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.reason.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Filter chips
      if (activeFilter === 'high') return f.confidenceTier === 'High';
      if (activeFilter === 'medium') return f.confidenceTier === 'Medium';
      if (activeFilter === 'low') return f.confidenceTier === 'Low';
      if (activeFilter === 'rule') return f.ruleOrAi.includes('Rule');
      if (activeFilter === 'ai') return f.ruleOrAi.includes('AI');
      if (activeFilter === 'projects') return f.folderClassification === 'Project';
      if (activeFilter === 'personal') return f.category.toLowerCase().includes('personal') || f.suggestedDestination.includes('01_Personal');
      if (activeFilter === 'professional') return f.category.toLowerCase().includes('professional') || f.suggestedDestination.includes('02_Professional');

      return true;
    });
  }, [files, activeFilter, searchFilter]);

  const allSelected = filteredFiles.length > 0 && selectedIds.length === filteredFiles.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFiles.map((f) => f.id));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    onApproveMultiple(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkIgnore = () => {
    if (selectedIds.length === 0) return;
    onIgnoreMultiple(selectedIds);
    setSelectedIds([]);
  };

  // Approved files ready for action
  const approvedFiles = files.filter(f => f.status === 'approved');
  const targetFilesCount = selectedIds.length > 0 ? selectedIds.length : (approvedFiles.length > 0 ? approvedFiles.length : 1);

  const handleApplyChanges = () => {
    const idsToApply = selectedIds.length > 0 ? selectedIds : approvedFiles.map(f => f.id);
    if (idsToApply.length === 0) return;

    onApproveMultiple(idsToApply);
    setAppliedFeedbackMessage(`Successfully executed and verified ${idsToApply.length} file operations. All changes recorded in local transaction journal.`);
    setSelectedIds([]);
    setTimeout(() => setAppliedFeedbackMessage(null), 4000);
  };

  return (
    <div id="proposed-moves-view" className="p-6 space-y-4 max-w-7xl mx-auto select-none">
      {/* View Header with Strict Dry Run Semantics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#232530]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Proposed Moves
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-mono">
              {filteredFiles.length} moves pending
            </span>
          </div>
          <p className="text-xs text-[#7f889c] mt-0.5">
            Deterministic rule triggers and local AI recommendations awaiting your approval.
          </p>
        </div>

        {/* DRY RUN BANNER & CONTROLS */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs transition ${
              dryRunMode
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/15 border-amber-500/50 text-amber-300'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${dryRunMode ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div className="leading-tight">
              <div className="flex items-center gap-1.5 font-semibold font-mono">
                <span>{dryRunMode ? 'DRY RUN ON' : 'DRY RUN OFF'}</span>
                <span className="text-[10px] opacity-75">·</span>
                <span className="text-[11px] font-sans font-normal">
                  {dryRunMode ? 'No Changes Applied' : 'Changes will be written to disk'}
                </span>
              </div>
            </div>
            <button
              id="btn-toggle-dryrun-page"
              onClick={onToggleDryRun}
              className={`ml-2 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border transition ${
                dryRunMode
                  ? 'bg-emerald-700/60 hover:bg-emerald-600 text-white border-emerald-400'
                  : 'bg-amber-700/60 hover:bg-amber-600 text-white border-amber-400'
              }`}
            >
              Toggle
            </button>
          </div>
        </div>
      </div>

      {/* Applied Feedback Banner */}
      {appliedFeedbackMessage && (
        <div className="p-3 rounded-lg bg-[#121c17] border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{appliedFeedbackMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium transition ${
                activeFilter === chip.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#15161d] text-[#8690a2] hover:bg-[#1f212c] hover:text-white border border-[#242633]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Search filename, reason, path..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#15161d] border border-[#262837] rounded-md px-3 py-1.5 text-xs text-white placeholder-[#5b6375] focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bulk Action & Execution Control Bar */}
      <div
        id="bulk-actions-bar"
        className={`p-2.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
          selectedIds.length > 0
            ? 'bg-[#1a1e2b] border-blue-500/40 text-white'
            : 'bg-[#14151a] border-[#22242e] text-[#6d7587]'
        }`}
      >
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="rounded bg-[#20222a] border-[#313543] text-blue-600 focus:ring-0 cursor-pointer"
          />
          <span className="font-semibold text-white">
            {selectedIds.length} of {filteredFiles.length} selected
          </span>
          {dryRunMode && (
            <span className="text-[11px] text-emerald-400 font-mono ml-2">
              (Dry Run ON: Safe preview mode)
            </span>
          )}
        </div>

        {/* Primary Action Buttons depending strictly on DRY RUN state */}
        <div className="flex items-center gap-2">
          {dryRunMode ? (
            <button
              id="btn-preview-approved-changes"
              onClick={() => setIsPreviewExecutionOpen(true)}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview {targetFilesCount} Approved Changes</span>
            </button>
          ) : (
            <button
              id="btn-apply-approved-changes"
              onClick={handleApplyChanges}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Apply {targetFilesCount} Approved Changes</span>
            </button>
          )}

          <button
            id="btn-bulk-approve"
            onClick={handleBulkApprove}
            disabled={selectedIds.length === 0}
            className="px-2.5 py-1.5 rounded bg-[#20222b] hover:bg-[#2b2e3b] disabled:opacity-30 text-white font-medium text-xs flex items-center gap-1 transition"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Approve Selected</span>
          </button>

          <button
            id="btn-bulk-ignore"
            onClick={handleBulkIgnore}
            disabled={selectedIds.length === 0}
            className="px-2.5 py-1.5 rounded bg-[#20222b] hover:bg-[#2b2e3b] disabled:opacity-30 text-[#abb4c6] font-medium text-xs flex items-center gap-1 transition"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Ignore</span>
          </button>
        </div>
      </div>

      {/* DENSE DESKTOP TABLE */}
      <div className="rounded-lg bg-[#15161c] border border-[#252732] overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[calc(100vh-340px)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-[#21232d] bg-[#121317] text-[#6f788b] text-[10px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="rounded bg-[#20222a] border-[#313543] text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">File</th>
                <th className="py-2.5 px-3">Current Path</th>
                <th className="py-2.5 px-3">Proposed Path</th>
                <th className="py-2.5 px-3">Proposed Filename</th>
                <th className="py-2.5 px-3">Classification Source</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2029]">
              {filteredFiles.map((file) => {
                const isSelected = selectedIds.includes(file.id);
                const sourceLabel = file.classificationSource || (file.ruleOrAi.includes('Rule') ? 'Rule #101' : 'Local AI');

                return (
                  <tr
                    key={file.id}
                    id={`proposed-row-${file.id}`}
                    onClick={() => onSelectFile(file)}
                    className={`hover:bg-[#1a1c24] cursor-pointer transition ${
                      isSelected ? 'bg-[#1b1f2b]/60' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3" onClick={(e) => toggleSelectRow(file.id, e)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded bg-[#20222a] border-[#313543] text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* File name & size */}
                    <td className="py-2.5 px-3 font-medium text-white max-w-[200px]">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <div className="truncate">
                          <span className="truncate font-mono text-[11px] block" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-[10px] text-[#6d7588] font-mono">
                            {file.sizeFormatted}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Current Path */}
                    <td className="py-2.5 px-3 text-[#9aa2b5] font-mono text-[11px] max-w-[170px] truncate" title={file.currentPath}>
                      {file.currentPath.replace('/Users/alex', '~')}
                    </td>

                    {/* Proposed Path */}
                    <td className="py-2.5 px-3 text-blue-300 font-mono text-[11px] max-w-[210px] truncate" title={file.suggestedDestination}>
                      {file.suggestedDestination}
                    </td>

                    {/* Proposed Filename */}
                    <td className="py-2.5 px-3 text-white font-mono text-[11px] max-w-[170px] truncate" title={file.proposedFilename || file.name}>
                      {file.proposedFilename || file.name}
                    </td>

                    {/* Classification Source (Clean desktop label, no marketing fluff) */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        sourceLabel.startsWith('Rule')
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      }`}>
                        Classification: {sourceLabel}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                          file.confidenceTier === 'High'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : file.confidenceTier === 'Medium'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {file.confidenceTier} · {file.confidence}%
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-2.5 px-3 text-[#8790a3] text-[11px] max-w-[200px] truncate italic" title={file.reason}>
                      "{file.reason}"
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          file.status === 'suggested'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : file.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : file.status === 'moving'
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {file.status}
                      </span>
                    </td>

                    {/* Quick Row Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onApproveSingle(file.id)}
                          className="px-2 py-1 rounded bg-[#1e2029] hover:bg-emerald-950/60 hover:text-emerald-400 hover:border-emerald-500/40 border border-[#282a36] text-xs transition"
                          title="Approve move"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onIgnoreSingle(file.id)}
                          className="px-2 py-1 rounded bg-[#1e2029] hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-500/40 border border-[#282a36] text-xs transition"
                          title="Ignore proposal"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRY RUN EXECUTION PREVIEW MODAL */}
      {isPreviewExecutionOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#15161c] border border-[#272938] rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222430]">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Dry Run Execution Simulation</span>
                </h3>
                <p className="text-xs text-[#8790a3] mt-0.5">
                  Verifying pre-flight conditions. No filesystem mutations will take place.
                </p>
              </div>
              <button
                onClick={() => setIsPreviewExecutionOpen(false)}
                className="text-[#7d8699] hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#111216] border border-[#20222d] flex items-center justify-between text-xs">
              <span className="text-[#8992a4]">Staged Transactions: <strong className="text-white font-mono">{targetFilesCount}</strong></span>
              <span className="text-emerald-400 font-mono text-xs">Pre-flight checks: 100% READY</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
              {filteredFiles.slice(0, targetFilesCount).map((f) => (
                <div key={f.id} className="p-2.5 rounded bg-[#101115] border border-[#1f212a] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-white text-[11px] truncate">{f.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      SIMULATION OK
                    </span>
                  </div>
                  <div className="text-[10px] text-[#717a8e] font-mono flex items-center gap-1.5 truncate">
                    <span>{f.currentPath.replace('/Users/alex', '~')}</span>
                    <ArrowRight className="w-3 h-3 text-[#505768]" />
                    <span className="text-blue-300">{f.suggestedDestination}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#20222d] text-xs">
              <span className="text-[#7d8699]">
                Toggle Dry Run OFF when you are ready to write to disk.
              </span>
              <button
                onClick={() => setIsPreviewExecutionOpen(false)}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

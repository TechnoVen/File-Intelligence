import React from 'react';
import {
  Folder,
  RefreshCw,
  ListFilter,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  AlertCircle,
  FileCheck2,
  ChevronRight,
  Sliders,
  Check,
  Ban,
  Trash2,
  FileText,
  Lock,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { FileItem, DuplicateGroup, RuleItem, ScanReport, SafetySettings } from '../../types';
import { ACTIVITY_7_DAYS, LATEST_SCAN_REPORT, INITIAL_SAFETY_SETTINGS } from '../../data/mockData';
import { NavView } from '../Sidebar';

interface DashboardViewProps {
  files: FileItem[];
  duplicates?: DuplicateGroup[];
  duplicateGroups?: DuplicateGroup[];
  rules?: RuleItem[];
  safetySettings?: SafetySettings;
  dryRunMode?: boolean;
  latestScan?: ScanReport;
  onSelectFile: (file: FileItem) => void;
  onNavigate: (view: NavView) => void;
  onScanTrigger?: () => void;
  onTriggerScan?: () => void;
  onApproveFile?: (fileId: string) => void;
  onApproveMove?: (fileId: string) => void;
  onIgnoreFile?: (fileId: string) => void;
  onMoveDuplicateToTrash?: (groupId: string, dupId: string) => void;
  onOpenScanReport?: () => void;
  isScanning?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  files = [],
  duplicates,
  duplicateGroups,
  rules = [],
  safetySettings,
  dryRunMode,
  latestScan = LATEST_SCAN_REPORT,
  onSelectFile,
  onNavigate,
  onScanTrigger,
  onTriggerScan,
  onApproveFile,
  onApproveMove,
  onIgnoreFile = (_fileId: string) => {},
  onMoveDuplicateToTrash = (_groupId: string, _dupId: string) => {},
  onOpenScanReport = () => {},
  isScanning = false
}) => {
  const effectiveDuplicates = duplicates || duplicateGroups || [];
  const effectiveSafetySettings: SafetySettings = safetySettings || {
    ...INITIAL_SAFETY_SETTINGS,
    dryRunMode: dryRunMode !== undefined ? dryRunMode : INITIAL_SAFETY_SETTINGS.dryRunMode
  };

  const handleScan = () => {
    if (onScanTrigger) onScanTrigger();
    else if (onTriggerScan) onTriggerScan();
  };

  const handleApprove = (fileId: string) => {
    if (onApproveFile) onApproveFile(fileId);
    else if (onApproveMove) onApproveMove(fileId);
  };
  // 6 summary metric items
  const summaryCards = [
    {
      id: 'indexed',
      label: 'Indexed Files',
      value: '12,482',
      detail: 'Local SQLite index',
      view: 'search' as NavView,
      color: 'text-white'
    },
    {
      id: 'inbox',
      label: 'Inbox items',
      value: '147',
      detail: 'Awaiting triage',
      view: 'inbox' as NavView,
      color: 'text-blue-400'
    },
    {
      id: 'proposed',
      label: 'Proposed Moves',
      value: `${files.filter(f => f.status === 'suggested').length}`,
      detail: 'Ready for batch review',
      view: 'proposed-moves' as NavView,
      color: 'text-cyan-400'
    },
    {
      id: 'duplicates',
      label: 'Exact Duplicates',
      value: `${effectiveDuplicates.length * 8}`,
      detail: 'Hash-verified identical',
      view: 'duplicates' as NavView,
      color: 'text-amber-400'
    },
    {
      id: 'review',
      label: 'Needs Review',
      value: '11',
      detail: 'Low/ambiguous score',
      view: 'review-queue' as NavView,
      color: 'text-orange-400'
    },
    {
      id: 'space',
      label: 'Recoverable Space',
      value: '3.8 GB',
      detail: 'Without data loss',
      view: 'duplicates' as NavView,
      color: 'text-emerald-400'
    },
  ];

  // Active top rules
  const topRules = rules.slice(0, 3);

  return (
    <div id="dashboard-view" className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Top Area: Title, Master Root & Primary Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#232530]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              File Intelligence
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e212b] border border-[#2d3140] text-[#939cb2] font-mono">
              v1.4.0 (macOS Desktop)
            </span>
          </div>
          <p className="text-xs text-[#8c95a8] mt-0.5">
            Understand first. Organize second.
          </p>

          {/* Master Root Source of Truth Indicator */}
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-[#6d7587]">Master Root:</span>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#17181e] border border-[#272935] text-[#d4d9e5]">
              <Folder className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-white">Documents</span>
              <span className="text-[#646c7e] font-mono text-[11px]">/Users/alex/Documents</span>
            </div>
            <span className="text-[10px] text-emerald-400/90 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Source of Truth</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-scan-files-main"
            onClick={handleScan}
            disabled={isScanning}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Files'}</span>
          </button>
          <button
            id="btn-review-changes-main"
            onClick={() => onNavigate('proposed-moves')}
            className="px-4 py-2 bg-[#1d1f27] hover:bg-[#252834] text-white border border-[#2c2f3c] rounded-md text-xs font-semibold transition flex items-center gap-2"
          >
            <ListFilter className="w-3.5 h-3.5 text-blue-400" />
            <span>Review Changes</span>
          </button>
        </div>
      </div>

      {/* STATUS SUMMARY ROW (Clickable) */}
      <div>
        <div className="text-[11px] font-semibold text-[#6e7688] uppercase tracking-wider mb-2">
          Status Summary
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {summaryCards.map((card) => (
            <button
              key={card.id}
              id={`card-summary-${card.id}`}
              onClick={() => onNavigate(card.view)}
              className="p-3 rounded-lg bg-[#16171d] border border-[#242630] hover:border-blue-500/40 hover:bg-[#1a1c24] text-left transition group"
            >
              <div className="text-[11px] text-[#7d8699] font-medium group-hover:text-white transition">
                {card.label}
              </div>
              <div className={`text-lg font-bold mt-1 font-mono tracking-tight ${card.color}`}>
                {card.value}
              </div>
              <div className="text-[10px] text-[#5e6677] mt-0.5 truncate">
                {card.detail}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column: SAFETY STATUS CARD & RECENT SCAN / ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Safety Status Card (lg:col-span-5) */}
        <div
          id="card-safety-status"
          className="lg:col-span-5 rounded-lg bg-[#15161c] border border-[#252732] p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#21232c]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-xs text-white">Safety Status</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                PROTECTED
              </span>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#848d9f]">Dry-run mode:</span>
                <span className="font-mono text-emerald-400 font-medium">
                  {effectiveSafetySettings.dryRunMode ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#848d9f]">Automatic file moves:</span>
                <span className="font-mono text-[#abb5c7]">
                  {effectiveSafetySettings.autoFileMoves ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#848d9f]">Permanent deletion:</span>
                <span className="font-mono text-[#abb5c7]">
                  {effectiveSafetySettings.permanentDeletion ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#848d9f]">Rollback protection:</span>
                <span className="font-mono text-emerald-400 font-medium">
                  {effectiveSafetySettings.rollbackProtection ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#848d9f]">Local AI (Ollama):</span>
                <span className="font-mono text-emerald-400 font-medium">
                  {effectiveSafetySettings.localAiEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#20222a] flex items-center gap-2 bg-[#121317] p-2.5 rounded text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">
              Your files will not be moved without approval.
            </span>
          </div>
        </div>

        {/* Latest Scan & 7-Day Activity Section (lg:col-span-7) */}
        <div
          id="card-latest-scan"
          className="lg:col-span-7 rounded-lg bg-[#15161c] border border-[#252732] p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#21232c]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-xs text-white">Latest Scan</h3>
                <span className="text-[11px] text-[#717a8e] font-mono">
                  {latestScan.timestamp}
                </span>
              </div>
              <button
                id="btn-view-scan-report"
                onClick={onOpenScanReport}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <span>View scan report</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Scan Metrics Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 py-3 border-b border-[#20222a] text-center">
              <div>
                <span className="text-[10px] text-[#6d7588] block">Duration</span>
                <span className="font-mono text-xs text-white font-semibold">
                  {latestScan.durationSeconds}s
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#6d7588] block">Scanned</span>
                <span className="font-mono text-xs text-white font-semibold">
                  {latestScan.filesScanned.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#6d7588] block">New files</span>
                <span className="font-mono text-xs text-blue-400 font-semibold">
                  +{latestScan.newFiles}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#6d7588] block">Duplicates</span>
                <span className="font-mono text-xs text-amber-400 font-semibold">
                  {latestScan.duplicatesDetected}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#6d7588] block">Classified</span>
                <span className="font-mono text-xs text-emerald-400 font-semibold">
                  {latestScan.aiClassifications}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#6d7588] block">Errors</span>
                <span className="font-mono text-xs text-emerald-400 font-semibold">
                  {latestScan.errors}
                </span>
              </div>
            </div>
          </div>

          {/* Simple 7-Day Activity Chart: Files processed by day */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-[#717a8c] mb-1.5">
              <span>Files Processed by Day (Last 7 Days)</span>
              <span className="font-mono text-[10px] text-white">208 files · 881 MB total</span>
            </div>
            <div className="flex items-end gap-1.5 h-14 bg-[#111216] p-2 rounded border border-[#20222b]">
              {ACTIVITY_7_DAYS.map((d) => {
                const max = 60;
                const pct = Math.round((d.count / max) * 100);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <div
                      style={{ height: `${Math.max(12, pct)}%` }}
                      className="w-full bg-blue-600/70 hover:bg-blue-500 rounded-xs transition"
                    />
                    <span className="text-[9px] text-[#606778] mt-1 font-mono group-hover:text-white">
                      {d.day.split(' ')[0]}
                    </span>
                    {/* Tooltip */}
                    <div className="absolute -top-7 hidden group-hover:flex px-1.5 py-0.5 rounded bg-[#252834] text-[9px] text-white font-mono whitespace-nowrap shadow-md z-30">
                      {d.count} files ({d.bytesFormatted})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* REVIEW QUEUE (Desktop Table) */}
      <div id="section-review-queue" className="rounded-lg bg-[#15161c] border border-[#252732] overflow-hidden">
        <div className="p-3.5 border-b border-[#232530] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-orange-400" />
            <h2 className="font-semibold text-xs text-white">
              Review Queue
            </h2>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500/15 text-orange-400 font-mono">
              3 files pending approval
            </span>
          </div>
          <button
            id="btn-see-all-proposed"
            onClick={() => onNavigate('proposed-moves')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
          >
            <span>Open Proposed Moves page</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Desktop Review Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#21232d] bg-[#121317] text-[#6f788b] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">File</th>
                <th className="py-2.5 px-3">Current Location</th>
                <th className="py-2.5 px-3">Suggested Destination</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2029]">
              {files.slice(0, 3).map((f) => (
                <tr
                  key={f.id}
                  id={`review-row-${f.id}`}
                  onClick={() => onSelectFile(f)}
                  className="hover:bg-[#1a1c24] cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-medium text-white max-w-[220px]">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate font-mono text-[11px]" title={f.name}>
                        {f.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#9aa2b5] font-mono text-[11px] max-w-[120px] truncate">
                    {f.currentPath.split('/')[3] || 'Downloads'}
                  </td>
                  <td className="py-2.5 px-3 text-blue-300 font-mono text-[11px] max-w-[260px] truncate">
                    {f.suggestedDestination}
                  </td>
                  <td className="py-2.5 px-3 text-[#c2cad8] whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded bg-[#1e2029] border border-[#2b2e3c] text-[10px]">
                      {f.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        f.confidenceTier === 'High'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : f.confidenceTier === 'Medium'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {f.confidenceTier} · {f.confidence}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#8790a3] text-[11px] max-w-[240px] truncate italic" title={f.reason}>
                    "{f.reason}"
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        id={`btn-approve-${f.id}`}
                        onClick={() => handleApprove(f.id)}
                        className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition"
                      >
                        Approve
                      </button>
                      <button
                        id={`btn-edit-${f.id}`}
                        onClick={() => onSelectFile(f)}
                        className="px-2 py-1 rounded bg-[#1f212a] hover:bg-[#282a36] text-[#9fa8bd] text-[11px] transition"
                      >
                        Edit
                      </button>
                      <button
                        id={`btn-ignore-${f.id}`}
                        onClick={() => onIgnoreFile(f.id)}
                        className="px-2 py-1 rounded hover:bg-[#252834] text-[#788092] hover:text-white text-[11px] transition"
                      >
                        Ignore
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column: DUPLICATES PREVIEW & ACTIVE RULES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Duplicates Preview (lg:col-span-7) */}
        <div id="section-duplicates-preview" className="lg:col-span-7 rounded-lg bg-[#15161c] border border-[#252732] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#21232c]">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-xs text-white">Duplicate Cleanup</h3>
                <span className="text-[10px] text-[#717a8e]">
                  (3 duplicate groups detected)
                </span>
              </div>
              <button
                id="btn-view-all-duplicates"
                onClick={() => onNavigate('duplicates')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <span>View all duplicates</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="py-3 space-y-3">
              {effectiveDuplicates.slice(0, 3).map((group) => {
                const canonical = group.canonicalFile;
                const dup = group.duplicates[0];
                return (
                  <div
                    key={group.id}
                    className="p-2.5 rounded bg-[#111216] border border-[#22242e] text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                          {group.matchType}
                        </span>
                        <span className="text-[#8e97aa] text-[11px]">
                          2 copies · Potential saving: <strong className="text-white font-mono">{group.potentialSavings}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onNavigate('duplicates')}
                          className="px-2 py-0.5 rounded bg-[#1e2028] hover:bg-[#282a35] text-[#a4adbf] text-[10px]"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => onMoveDuplicateToTrash(group.id, dup.id)}
                          className="px-2 py-0.5 rounded bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/20 text-rose-300 text-[10px] flex items-center gap-1"
                          title="Moves duplicate safely to OS Trash"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Move duplicate to Trash</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                      {/* Canonical */}
                      <div className="p-1.5 rounded bg-[#161820] border border-[#262834]">
                        <div className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Canonical File</span>
                        </div>
                        <div className="text-white truncate mt-0.5" title={canonical.name}>
                          {canonical.name}
                        </div>
                        <div className="text-[#6d7588] text-[9px] truncate" title={canonical.currentPath}>
                          {canonical.currentPath}
                        </div>
                      </div>

                      {/* Duplicate */}
                      <div className="p-1.5 rounded bg-[#1a1417] border border-[#332228]">
                        <div className="text-[10px] text-amber-400 uppercase font-semibold flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Redundant Duplicate</span>
                        </div>
                        <div className="text-white truncate mt-0.5" title={dup.name}>
                          {dup.name}
                        </div>
                        <div className="text-[#857077] text-[9px] truncate" title={dup.currentPath}>
                          {dup.currentPath}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#20222a] text-[10px] text-[#6e778b] flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Deletion goes to OS Trash by default. Permanent deletion is disabled in safety settings.</span>
          </div>
        </div>

        {/* Active Rules Summary (lg:col-span-5) */}
        <div id="section-rules-summary" className="lg:col-span-5 rounded-lg bg-[#15161c] border border-[#252732] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#21232c]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-xs text-white">Active Rules</h3>
              </div>
              <button
                id="btn-manage-rules"
                onClick={() => onNavigate('rules')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <span>Manage Rules</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="py-3 space-y-2.5">
              {topRules.map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 rounded bg-[#111216] border border-[#232530] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate max-w-[180px]">
                      {r.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1 rounded bg-[#1f212a] text-[#8e97ab]">
                        Priority {r.priority}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-medium">
                        Enabled
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-blue-300 font-mono flex items-center gap-1.5 truncate">
                    <ArrowRight className="w-3 h-3 text-[#646c7f] shrink-0" />
                    <span className="truncate">{r.targetDisplayPath}</span>
                  </div>

                  <div className="text-[10px] text-[#6b7385] flex items-center justify-between pt-0.5">
                    <span>Matched {r.matchCount} files</span>
                    <span>{r.isDefault ? 'System Rule' : 'Custom'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#20222a]">
            <button
              onClick={() => onNavigate('rules')}
              className="w-full py-1.5 rounded bg-[#1b1d24] hover:bg-[#232630] border border-[#292c38] text-xs text-[#cad1e0] font-medium transition"
            >
              + Create Custom Rule in Rule Builder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  SlidersHorizontal,
  Bell,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  Zap,
  BookOpen,
  Info
} from 'lucide-react';
import { NavView } from './Sidebar';

interface TopBarProps {
  currentView?: NavView;
  activeView?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenScanModal?: () => void;
  onTriggerScan?: () => void;
  isScanning?: boolean;
  dryRunMode?: boolean;
  onToggleDryRun?: () => void;
  onOpenSettings?: () => void;
  onOpenDesignSpec?: () => void;
  onGlobalSearchClick?: () => void;
  pendingReviewsCount?: number;
  statusMessage?: string;
}

const VIEW_TITLES: Record<NavView, { title: string; category: string; subtitle?: string }> = {
  dashboard: { title: 'Dashboard', category: 'Overview', subtitle: 'Understand first. Organize second.' },
  inbox: { title: 'Inbox', category: 'Overview', subtitle: 'Incoming files awaiting triage' },
  'review-queue': { title: 'Review Queue', category: 'Overview', subtitle: 'Files requiring your approval before relocation' },
  'proposed-moves': { title: 'Proposed Moves', category: 'Organize', subtitle: 'Pending rule & AI classification plans' },
  rules: { title: 'Rules Manager', category: 'Organize', subtitle: 'Deterministic triggers & target destination mapping' },
  'folder-intelligence': { title: 'Folder Intelligence & Taxonomy', category: 'Organize', subtitle: 'Physical folder tree & stable taxonomy ID bindings' },
  projects: { title: 'Projects View', category: 'Organize', subtitle: 'Active outcome-driven deliverables' },
  organizations: { title: 'Organizations & Entities', category: 'Organize', subtitle: 'Known businesses, employers, and government institutions' },
  duplicates: { title: 'Duplicates & Cleanup', category: 'Cleanup', subtitle: 'Exact SHA-256 hash replicas & safe OS Trash routing' },
  versions: { title: 'Version Conflicts', category: 'Cleanup', subtitle: 'Multiple drafts & versioned document streams' },
  conflicts: { title: 'Path Conflicts', category: 'Cleanup', subtitle: 'Destination collision resolution' },
  search: { title: 'Intelligent File Search', category: 'Search', subtitle: 'Semantic and metadata indexing across local drives' },
  'smart-collections': { title: 'Smart Collections', category: 'Search', subtitle: 'Dynamic views based on saved queries' },
  activity: { title: 'Activity Stream', category: 'System', subtitle: 'Telemetry and event logs for local file operations' },
  history: { title: 'Transaction Journal', category: 'System', subtitle: '8-field atomic transaction audit log' },
  rollback: { title: 'Rollback Protection', category: 'System', subtitle: 'Safe transaction checkpoint restoration' },
  'architecture-spec': { title: 'Rust / Tauri Architecture Specification', category: 'System', subtitle: 'SQLite journal schema, taxonomy resolution & IPC signatures' },
  settings: { title: 'Settings', category: 'System', subtitle: 'Local AI, scanning scopes, and safety boundaries' },
  'design-system': { title: 'Design System & Architecture', category: 'Docs', subtitle: 'Design tokens, desktop patterns, and Tauri/Svelte technical spec' }
};

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  activeView,
  searchQuery = '',
  onSearchChange = (_q: string) => {},
  onOpenScanModal,
  onTriggerScan,
  isScanning = false,
  dryRunMode = true,
  onToggleDryRun = () => {},
  onOpenSettings = () => {},
  onOpenDesignSpec = () => {},
  onGlobalSearchClick,
  statusMessage = 'Idle · Last scan today at 06:45 AM'
}) => {
  const selectedView = (currentView || activeView || 'dashboard') as NavView;
  const currentInfo = VIEW_TITLES[selectedView] || { title: 'File Intelligence', category: 'Overview', subtitle: 'Understand first. Organize second.' };
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const handleScanAction = () => {
    if (onOpenScanModal) {
      onOpenScanModal();
    } else if (onTriggerScan) {
      onTriggerScan();
    }
  };

  return (
    <header
      id="desktop-topbar"
      className="h-13 min-h-13 bg-[#17181d] border-b border-[#24262e] px-4 flex items-center justify-between z-10 select-none text-[#d6dae5]"
    >
      {/* Current page title & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-[#788194]">
          <span>{currentInfo.category}</span>
          <span>/</span>
          <span className="font-semibold text-white text-sm tracking-tight truncate">
            {currentInfo.title}
          </span>
        </div>

        {/* Master root reminder chip */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-[#1f2129] border border-[#2d303b] text-[11px] text-[#939cae]">
          <HardDrive className="w-3 h-3 text-blue-400" />
          <span className="font-mono text-[10px] text-[#c2c8d7]">~/Documents</span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-[#6f7789]" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onGlobalSearchClick) {
                onGlobalSearchClick();
              }
            }}
            placeholder="Search files, rules, entities, or paths (⌘K)..."
            className="w-full bg-[#121316] border border-[#2b2e38] rounded-md pl-8 pr-12 py-1.5 text-xs text-white placeholder-[#5d6475] focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition"
          />
          <kbd className="absolute right-2.5 text-[10px] bg-[#1d1f27] border border-[#2c303c] text-[#7d869a] px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions & Status Area */}
      <div className="flex items-center gap-2.5">
        {/* Scan Status Text */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-[#7a8396]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="truncate max-w-[200px]">{statusMessage}</span>
        </div>

        {/* Dry-run Toggle Button */}
        <button
          id="btn-toggle-dryrun"
          onClick={onToggleDryRun}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border transition ${
            dryRunMode
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/25 hover:bg-amber-500/20'
          }`}
          title="Safety lock: Prevents immediate disk writes until explicitly approved"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">
            Dry-Run: {dryRunMode ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Primary Action: Scan Files */}
        <button
          id="btn-scan-files-topbar"
          onClick={handleScanAction}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Scan Files'}</span>
        </button>

        {/* Notifications & System Audit Popover Trigger */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotificationPopup(!showNotificationPopup)}
            className="p-1.5 rounded-md hover:bg-[#232630] text-[#8c94a7] hover:text-white transition relative"
            title="System alerts & notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1 right-1"></span>
          </button>

          {showNotificationPopup && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-72 bg-[#1b1c23] border border-[#2b2e3a] rounded-lg shadow-xl p-3 z-50 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#282b36] mb-2">
                <span className="font-semibold text-white">System Notifications</span>
                <span className="text-[10px] text-emerald-400">All Safe</span>
              </div>
              <div className="space-y-2 text-[#9da6b8]">
                <div className="p-2 rounded bg-[#131418] border border-[#242630] text-[11px]">
                  <div className="flex items-center gap-1.5 text-blue-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Database Index Synced</span>
                  </div>
                  <p className="text-[#7b8394] mt-0.5">SQLite local index verified (12,482 files, 0 corruption).</p>
                </div>
                <div className="p-2 rounded bg-[#131418] border border-[#242630] text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <Zap className="w-3 h-3" />
                    <span>Ollama Qwen3 1.7B Ready</span>
                  </div>
                  <p className="text-[#7b8394] mt-0.5">Average inference speed 48 tokens/sec on local Metal.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings button */}
        <button
          id="btn-settings-topbar"
          onClick={onOpenSettings}
          className="p-1.5 rounded-md hover:bg-[#232630] text-[#8c94a7] hover:text-white transition"
          title="Application Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

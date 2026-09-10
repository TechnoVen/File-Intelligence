import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  ListTodo,
  FileCheck2,
  Sliders,
  FolderKanban,
  Building2,
  CopyCheck,
  GitFork,
  AlertTriangle,
  Search,
  Sparkles,
  Activity,
  History,
  RotateCcw,
  Settings,
  Cpu,
  Lock,
  Database,
  Layers,
  BookOpen,
  FolderTree
} from 'lucide-react';

export type NavView =
  | 'dashboard'
  | 'inbox'
  | 'review-queue'
  | 'proposed-moves'
  | 'rules'
  | 'folder-intelligence'
  | 'projects'
  | 'organizations'
  | 'duplicates'
  | 'versions'
  | 'conflicts'
  | 'search'
  | 'smart-collections'
  | 'activity'
  | 'history'
  | 'rollback'
  | 'architecture-spec'
  | 'settings'
  | 'design-system';

interface SidebarProps {
  currentView?: NavView;
  activeView?: string;
  onSelectView: (view: NavView) => void;
  counts?: {
    inbox?: number;
    reviewQueue?: number;
    proposedMoves?: number;
    duplicates?: number;
  };
  pendingMovesCount?: number;
  duplicatesCount?: number;
  rulesCount?: number;
  dryRunMode: boolean;
  onToggleDryRun: () => void;
  onOpenDesignSpec?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activeView,
  onSelectView,
  counts,
  pendingMovesCount,
  duplicatesCount,
  dryRunMode,
  onToggleDryRun,
  onOpenDesignSpec
}) => {
  const selectedView = (currentView || activeView || 'dashboard') as NavView;
  const safeCounts = {
    inbox: counts?.inbox ?? 147,
    reviewQueue: counts?.reviewQueue ?? 11,
    proposedMoves: counts?.proposedMoves ?? pendingMovesCount ?? 18,
    duplicates: counts?.duplicates ?? duplicatesCount ?? 24
  };

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard' as NavView, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inbox' as NavView, label: 'Inbox', icon: Inbox, badge: safeCounts.inbox },
        { id: 'review-queue' as NavView, label: 'Review Queue', icon: ListTodo, badge: safeCounts.reviewQueue, badgeAlert: true },
      ],
    },
    {
      title: 'ORGANIZE',
      items: [
        { id: 'proposed-moves' as NavView, label: 'Proposed Moves', icon: FileCheck2, badge: safeCounts.proposedMoves },
        { id: 'rules' as NavView, label: 'Rules', icon: Sliders },
        { id: 'folder-intelligence' as NavView, label: 'Library & Taxonomy', icon: FolderTree },
        { id: 'projects' as NavView, label: 'Projects', icon: FolderKanban },
        { id: 'organizations' as NavView, label: 'Organizations', icon: Building2 },
      ],
    },
    {
      title: 'CLEANUP',
      items: [
        { id: 'duplicates' as NavView, label: 'Duplicates', icon: CopyCheck, badge: safeCounts.duplicates },
        { id: 'versions' as NavView, label: 'Versions', icon: GitFork },
        { id: 'conflicts' as NavView, label: 'Conflicts', icon: AlertTriangle },
      ],
    },
    {
      title: 'SEARCH',
      items: [
        { id: 'search' as NavView, label: 'Search', icon: Search },
        { id: 'smart-collections' as NavView, label: 'Smart Collections', icon: Sparkles },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'activity' as NavView, label: 'Activity', icon: Activity },
        { id: 'history' as NavView, label: 'Transaction Journal', icon: History },
        { id: 'rollback' as NavView, label: 'Rollback', icon: RotateCcw },
        { id: 'architecture-spec' as NavView, label: 'Rust/Tauri Spec', icon: Cpu },
        { id: 'settings' as NavView, label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="w-64 min-w-64 h-screen bg-[#15161a] border-r border-[#24262d] flex flex-col justify-between select-none z-20 text-[#c8ccd6]"
    >
      {/* macOS Window Bar + App Brand */}
      <div>
        <div className="pt-3.5 pb-2 px-4 flex items-center gap-2 border-b border-[#21232a]/60">
          {/* macOS traffic light window controls */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 hover:brightness-110 transition cursor-pointer" title="Close window" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 hover:brightness-110 transition cursor-pointer" title="Minimize" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 hover:brightness-110 transition cursor-pointer" title="Zoom" />
          </div>

          <div className="flex items-center gap-1.5 ml-1">
            <div className="w-5 h-5 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-3 h-3" />
            </div>
            <div className="leading-tight">
              <span className="font-semibold text-xs tracking-tight text-white block">
                File Intelligence
              </span>
              <span className="text-[10px] text-[#7d8495] block font-mono">
                Local AI Organizer
              </span>
            </div>
          </div>
        </div>

        {/* Master Root Quick Tag */}
        <div className="px-3 pt-2 pb-1">
          <div className="px-2 py-1.5 rounded-md bg-[#1c1e24] border border-[#292b33] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[#8e96a8]">Root:</span>
              <span className="font-mono text-white text-[10px] truncate">~/Documents</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              MASTER
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="px-2 py-1 space-y-3 overflow-y-auto max-h-[calc(100vh-270px)]">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-0.5">
              <div className="px-2 py-1 text-[10px] font-semibold text-[#62697b] tracking-wider">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = selectedView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                        : 'text-[#9ea6b8] hover:text-white hover:bg-[#1f2128]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7d8495]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeAlert
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-[#262831] text-[#9ea6b8]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Design System Spec Button */}
          <div className="pt-1">
            <button
              id="btn-design-system"
              onClick={onOpenDesignSpec}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-[#7e879b] hover:text-[#c4cad7] hover:bg-[#1a1c22] border border-dashed border-[#2b2e38] transition"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Design System & Tauri Spec</span>
              </div>
              <span className="text-[9px] px-1 bg-[#242731] rounded text-[#8e96a8]">Docs</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Local AI & System Status Box at bottom */}
      <div className="p-3 border-t border-[#22242c] bg-[#121316]/80 space-y-2">
        {/* Safety Mode Indicator */}
        <div className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded bg-[#1b1d23] border border-[#262832]">
          <span className="text-[#8a92a3]">Dry Run Mode</span>
          <button
            id="toggle-dry-run-sidebar"
            onClick={onToggleDryRun}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition ${
              dryRunMode
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            }`}
            title="When ON, no filesystem changes occur"
          >
            {dryRunMode ? 'ACTIVE (SAFE)' : 'ARMED'}
          </button>
        </div>

        {/* Local AI Card */}
        <div className="p-2.5 rounded-md bg-[#191b22] border border-[#262933] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-white text-[11px]">Local AI (Ollama)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Connected</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#858d9e]">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#626a7c]" />
              <span className="font-mono text-[10px]">Qwen3 1.7B</span>
            </div>
            <span className="text-[10px] text-[#626a7c]">Metal 4-bit</span>
          </div>

          <div className="pt-1 border-t border-[#232630] flex items-center justify-between text-[10px] text-[#737c8e]">
            <div className="flex items-center gap-1 text-emerald-400/90 font-medium">
              <Lock className="w-2.5 h-2.5" />
              <span>Private · Local only</span>
            </div>
            <div className="flex items-center gap-1 text-[#62697a]">
              <Database className="w-2.5 h-2.5" />
              <span>SQLite 3.45</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

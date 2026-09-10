import React, { useState } from 'react';
import { Sidebar, NavView } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { FileDetailsDrawer } from './components/FileDetailsDrawer';
import { ScanReportModal } from './components/ScanReportModal';
import { DashboardView } from './components/views/DashboardView';
import { ProposedMovesView } from './components/views/ProposedMovesView';
import { DuplicatesView } from './components/views/DuplicatesView';
import { RulesView } from './components/views/RulesView';
import { OrganizationsView } from './components/views/OrganizationsView';
import { SearchView } from './components/views/SearchView';
import { HistoryRollbackView } from './components/views/HistoryRollbackView';
import { SettingsView } from './components/views/SettingsView';
import { DesignSystemView } from './components/views/DesignSystemView';
import { FolderIntelligenceView } from './components/views/FolderIntelligenceView';
import { ArchitectureSpecView } from './components/views/ArchitectureSpecView';

import {
  INITIAL_FILES,
  DUPLICATE_GROUPS,
  INITIAL_RULES,
  ORGANIZATIONS_DATA,
  HISTORY_TRANSACTIONS,
  ROLLBACK_BATCHES,
  INITIAL_SAFETY_SETTINGS,
  LATEST_SCAN_REPORT
} from './data/mockData';

import {
  FileItem,
  DuplicateGroup,
  RuleItem,
  OrganizationEntity,
  HistoryTransaction,
  RollbackBatch,
  SafetySettings
} from './types';

import {
  ShieldAlert,
  X,
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeView, setActiveView] = useState<NavView>('dashboard');

  // Application Data State
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>(DUPLICATE_GROUPS);
  const [rules, setRules] = useState<RuleItem[]>(INITIAL_RULES);
  const [organizations, setOrganizations] = useState<OrganizationEntity[]>(ORGANIZATIONS_DATA);
  const [history, setHistory] = useState<HistoryTransaction[]>(HISTORY_TRANSACTIONS);
  const [batches, setBatches] = useState<RollbackBatch[]>(ROLLBACK_BATCHES);
  const [safetySettings, setSafetySettings] = useState<SafetySettings>(INITIAL_SAFETY_SETTINGS);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Drawer & Modals
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showScanReportModal, setShowScanReportModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Permanent Delete Safeguard Modal State (Strict 2-step verification)
  const [deleteSafeguardModal, setDeleteSafeguardModal] = useState<{
    isOpen: boolean;
    fileName: string;
    confirmationText: string;
  }>({
    isOpen: false,
    fileName: '',
    confirmationText: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Toggle Dry Run
  const handleToggleDryRun = () => {
    const next = !safetySettings.dryRunMode;
    setSafetySettings({ ...safetySettings, dryRunMode: next });
    showToast(
      next
        ? 'Dry Run enabled: All filesystem changes are now simulated safely.'
        : 'Dry Run disabled: Approvals will now move real files on disk.'
    );
  };

  // Scan simulation
  const handleTriggerScan = () => {
    setIsScanning(true);
    showToast('Scanning Desktop, Downloads, and Documents scopes...');
    setTimeout(() => {
      setIsScanning(false);
      showToast('Scan complete: 12,482 files indexed. 18 new recommendations found.');
    }, 2200);
  };

  // Approve single file move
  const handleApproveMove = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    setFiles(
      files.map((f) =>
        f.id === fileId
          ? { ...f, status: 'approved' }
          : f
      )
    );

    // Record in history journal
    const newTx: HistoryTransaction = {
      id: `tx-${Date.now()}`,
      timestamp: 'Just now',
      action: 'Moved',
      file: file.name,
      originalPath: file.currentPath,
      newPath: file.suggestedDestination,
      rule: file.ruleOrAi,
      status: 'Completed',
      rollbackAvailable: true,
      batchId: `batch-${Date.now()}`,
      sha256Verified: true
    };
    setHistory([newTx, ...history]);

    showToast(
      safetySettings.dryRunMode
        ? `[Dry Run] Simulated move: "${file.name}" → ${file.suggestedDestination}`
        : `Moved & Verified: "${file.name}" relocated safely.`
    );
    setSelectedFile(null);
  };

  // Bulk approve
  const handleApproveMultiple = (fileIds: string[]) => {
    setFiles(
      files.map((f) =>
        fileIds.includes(f.id) ? { ...f, status: 'approved' } : f
      )
    );
    showToast(
      safetySettings.dryRunMode
        ? `[Dry Run] Approved ${fileIds.length} moves in simulation.`
        : `Approved & queued ${fileIds.length} files for verified transfer.`
    );
  };

  // Ignore single file
  const handleIgnoreFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    setFiles(files.filter((f) => f.id !== fileId));
    showToast(`Ignored "${file.name}". Added to skip list.`);
    setSelectedFile(null);
  };

  // Bulk ignore
  const handleIgnoreMultiple = (fileIds: string[]) => {
    setFiles(files.filter((f) => !fileIds.includes(f.id)));
    showToast(`Ignored ${fileIds.length} files.`);
  };

  // Move duplicate replica to OS Trash
  const handleMoveDuplicateToTrash = (groupId: string, dupId: string) => {
    setDuplicateGroups((prev) =>
      prev
        .map((g) => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            duplicates: g.duplicates.filter((d) => d.id !== dupId),
            totalCopies: g.totalCopies - 1
          };
        })
        .filter((g) => g.duplicates.length > 0)
    );
    showToast('Duplicate replica moved to macOS ~/.Trash (Reversible).');
  };

  // Move all duplicates to Trash
  const handleMoveAllDuplicatesToTrash = () => {
    setDuplicateGroups([]);
    showToast('Moved all redundant duplicates to OS Trash. 3.8 GB reclaimed!');
  };

  // Toggle rule
  const handleToggleRule = (ruleId: string) => {
    setRules(
      rules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Save rule
  const handleSaveRule = (updatedRule: RuleItem) => {
    const exists = rules.some((r) => r.id === updatedRule.id);
    if (exists) {
      setRules(rules.map((r) => (r.id === updatedRule.id ? updatedRule : r)));
      showToast(`Rule "${updatedRule.name}" updated.`);
    } else {
      setRules([updatedRule, ...rules]);
      showToast(`Created new rule "${updatedRule.name}".`);
    }
  };

  // Reset rules to default
  const handleResetDefaults = () => {
    setRules(INITIAL_RULES);
    showToast('Rules stack restored to default system configuration.');
  };

  // Add alias to organization
  const handleAddAlias = (orgId: string, newAlias: string) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id !== orgId) return org;
        if (org.aliases.includes(newAlias)) return org;
        return {
          ...org,
          aliases: [...org.aliases, newAlias]
        };
      })
    );
    showToast(`Added alias "${newAlias}" to entity.`);
  };

  // Rollback batch
  const handleRollbackBatch = (batchId: string) => {
    setBatches(batches.filter((b) => b.id !== batchId));
    showToast('Batch restored! File locations reverted back to origin.');
  };

  // Edit destination path for file
  const handleEditDestination = (fileId: string, newPath: string) => {
    setFiles(
      files.map((f) =>
        f.id === fileId ? { ...f, suggestedDestination: newPath } : f
      )
    );
    showToast('Destination path updated.');
  };

  // Rename file
  const handleRenameFile = (fileId: string, newName: string) => {
    setFiles(
      files.map((f) =>
        f.id === fileId ? { ...f, proposedFilename: newName } : f
      )
    );
    showToast('Proposed filename updated.');
  };

  // Move single file to OS Trash
  const handleMoveFileToTrash = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    setFiles(files.filter((f) => f.id !== fileId));
    showToast(`Moved "${file ? file.name : 'file'}" to macOS ~/.Trash.`);
    setSelectedFile(null);
  };

  // Trigger permanent delete safeguard modal
  const handlePermanentDeleteSafeguard = (fileName: string) => {
    setDeleteSafeguardModal({
      isOpen: true,
      fileName,
      confirmationText: ''
    });
  };

  const handleConfirmPermanentDelete = () => {
    if (deleteSafeguardModal.confirmationText.trim() !== 'DELETE') {
      alert('You must type DELETE in all uppercase to confirm.');
      return;
    }
    showToast(`Permanently deleted "${deleteSafeguardModal.fileName}".`);
    setDeleteSafeguardModal({ isOpen: false, fileName: '', confirmationText: '' });
  };

  // Computed counts for badges
  const pendingMovesCount = files.filter((f) => f.status === 'suggested').length;
  const reviewQueueCount = files.filter((f) => f.confidence < 90 && f.status === 'suggested').length;
  const duplicatesCount = duplicateGroups.length;
  const inboxCount = pendingMovesCount + 129;

  return (
    <div id="app-container" className="flex h-screen w-screen overflow-hidden bg-[#0d0e12] text-[#c7cbd6] font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentView={activeView}
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        counts={{
          inbox: inboxCount,
          reviewQueue: reviewQueueCount > 0 ? reviewQueueCount : 11,
          proposedMoves: pendingMovesCount,
          duplicates: duplicatesCount
        }}
        pendingMovesCount={pendingMovesCount}
        duplicatesCount={duplicatesCount}
        rulesCount={rules.length}
        dryRunMode={safetySettings.dryRunMode}
        onToggleDryRun={handleToggleDryRun}
        onOpenDesignSpec={() => setActiveView('design-system')}
      />

      {/* Main App Stage */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0f1015]">
        {/* Top Desktop Bar */}
        <TopBar
          currentView={activeView}
          activeView={activeView}
          searchQuery={globalSearchQuery}
          onSearchChange={(q) => {
            setGlobalSearchQuery(q);
            if (activeView !== 'search' && q.trim()) {
              setActiveView('search');
            }
          }}
          dryRunMode={safetySettings.dryRunMode}
          onToggleDryRun={handleToggleDryRun}
          isScanning={isScanning}
          onOpenScanModal={() => setShowScanReportModal(true)}
          onTriggerScan={handleTriggerScan}
          onOpenSettings={() => setActiveView('settings')}
          onOpenDesignSpec={() => setActiveView('design-system')}
          onGlobalSearchClick={() => setActiveView('search')}
          pendingReviewsCount={pendingMovesCount}
        />

        {/* Global Floating Toast */}
        {toastMessage && (
          <div className="fixed top-14 right-6 z-50 p-3 rounded-lg bg-[#181d28] border border-blue-500/40 shadow-xl text-xs text-white flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-[11px]">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-[#7e879c] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto relative">
          {activeView === 'dashboard' && (
            <DashboardView
              files={files}
              duplicates={duplicateGroups}
              duplicateGroups={duplicateGroups}
              rules={rules}
              dryRunMode={safetySettings.dryRunMode}
              safetySettings={safetySettings}
              onNavigate={(v) => setActiveView(v)}
              onSelectFile={setSelectedFile}
              onApproveFile={handleApproveMove}
              onApproveMove={handleApproveMove}
              onIgnoreFile={handleIgnoreFile}
              onMoveDuplicateToTrash={handleMoveDuplicateToTrash}
              onOpenScanReport={() => setShowScanReportModal(true)}
              onTriggerScan={handleTriggerScan}
              onScanTrigger={handleTriggerScan}
              isScanning={isScanning}
            />
          )}

          {(activeView === 'proposed-moves' || activeView === 'proposed' || activeView === 'inbox' || activeView === 'review-queue') && (
            <ProposedMovesView
              files={
                activeView === 'review-queue'
                  ? files.filter((f) => f.confidence < 90 && f.status === 'suggested')
                  : activeView === 'inbox'
                  ? files.filter((f) => f.status === 'suggested')
                  : files
              }
              dryRunMode={safetySettings.dryRunMode}
              onToggleDryRun={handleToggleDryRun}
              onSelectFile={setSelectedFile}
              onApproveMultiple={handleApproveMultiple}
              onIgnoreMultiple={handleIgnoreMultiple}
              onApproveSingle={handleApproveMove}
              onIgnoreSingle={handleIgnoreFile}
            />
          )}

          {(activeView === 'duplicates' || activeView === 'versions' || activeView === 'conflicts') && (
            <DuplicatesView
              duplicateGroups={duplicateGroups}
              onMoveDuplicateToTrash={handleMoveDuplicateToTrash}
              onMoveAllDuplicatesToTrash={handleMoveAllDuplicatesToTrash}
              onPermanentDeleteSafeguard={handlePermanentDeleteSafeguard}
            />
          )}

          {activeView === 'rules' && (
            <RulesView
              rules={rules}
              onToggleRule={handleToggleRule}
              onSaveRule={handleSaveRule}
              onResetDefaults={handleResetDefaults}
            />
          )}

          {(activeView === 'folder-intelligence' || activeView === 'projects') && (
            <FolderIntelligenceView
              rules={rules}
              onNavigateToRule={(ruleId) => {
                setActiveView('rules');
              }}
              onNavigateToInbox={() => setActiveView('inbox')}
              onNavigateToDuplicates={() => setActiveView('duplicates')}
            />
          )}

          {activeView === 'architecture-spec' && (
            <ArchitectureSpecView />
          )}

          {activeView === 'organizations' && (
            <OrganizationsView
              organizations={organizations}
              onAddAlias={handleAddAlias}
            />
          )}

          {(activeView === 'search' || activeView === 'smart-collections') && (
            <SearchView
              files={files}
              onSelectFile={setSelectedFile}
              initialQuery={globalSearchQuery}
            />
          )}

          {(activeView === 'history' || activeView === 'rollback' || activeView === 'activity') && (
            <HistoryRollbackView
              history={history}
              batches={batches}
              onRollbackBatch={handleRollbackBatch}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              safetySettings={safetySettings}
              onUpdateSafetySettings={setSafetySettings}
            />
          )}

          {activeView === 'design-system' && (
            <DesignSystemView />
          )}
        </main>
      </div>

      {/* Right-Side File Details & AI Inspector Drawer */}
      <FileDetailsDrawer
        file={selectedFile}
        isOpen={Boolean(selectedFile)}
        onClose={() => setSelectedFile(null)}
        onApprove={handleApproveMove}
        onApproveMove={handleApproveMove}
        onIgnore={handleIgnoreFile}
        onIgnoreFile={handleIgnoreFile}
        onMoveToTrash={handleMoveFileToTrash}
        onEditDestination={handleEditDestination}
        onRename={handleRenameFile}
        dryRunMode={safetySettings.dryRunMode}
      />

      {/* Full Filesystem Scan Report Modal */}
      <ScanReportModal
        isOpen={showScanReportModal}
        onClose={() => setShowScanReportModal(false)}
        report={LATEST_SCAN_REPORT}
        onRescan={handleTriggerScan}
      />

      {/* STRICT PERMANENT DELETE SAFEGUARD MODAL */}
      {deleteSafeguardModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#181922] border border-rose-500/40 rounded-xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>Permanent Deletion Safeguard</span>
            </div>

            <p className="text-[#a4adbf] leading-relaxed">
              You are requesting to permanently delete <strong className="text-white font-mono">{deleteSafeguardModal.fileName}</strong>. This bypasses the OS Trash and cannot be undone or rolled back.
            </p>

            <div className="p-2.5 rounded bg-rose-950/30 border border-rose-500/30 text-rose-300 font-mono text-[11px]">
              Recommendation: Use "Move to OS Trash" instead so recovery remains possible.
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[#7b8599] block font-medium">
                Type <span className="font-mono text-white font-bold">DELETE</span> to proceed:
              </label>
              <input
                type="text"
                value={deleteSafeguardModal.confirmationText}
                onChange={(e) =>
                  setDeleteSafeguardModal({
                    ...deleteSafeguardModal,
                    confirmationText: e.target.value
                  })
                }
                placeholder="Type DELETE"
                className="w-full bg-[#111218] border border-[#2b2f3d] rounded px-3 py-1.5 text-white font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#252836]">
              <button
                onClick={() =>
                  setDeleteSafeguardModal({
                    isOpen: false,
                    fileName: '',
                    confirmationText: ''
                  })
                }
                className="px-3 py-1.5 rounded bg-[#222430] hover:bg-[#2d3040] text-white font-medium transition"
              >
                Cancel (Keep File)
              </button>
              <button
                onClick={handleConfirmPermanentDelete}
                disabled={deleteSafeguardModal.confirmationText.trim() !== 'DELETE'}
                className="px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white font-bold transition shadow-sm"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

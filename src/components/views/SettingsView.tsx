import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Cpu,
  Database,
  FolderOpen,
  HardDrive,
  CheckCircle2,
  Lock,
  Save,
  AlertTriangle,
  RotateCcw,
  Bell,
  Sliders,
  Terminal
} from 'lucide-react';
import { SafetySettings } from '../../types';

interface SettingsViewProps {
  safetySettings: SafetySettings;
  onUpdateSafetySettings: (settings: SafetySettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  safetySettings,
  onUpdateSafetySettings
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'scanning' | 'ai' | 'automation' | 'safety' | 'database' | 'advanced'>('safety');
  const [settings, setSettings] = useState<SafetySettings>(safetySettings);
  const [saveToast, setSaveToast] = useState(false);

  const tabs = [
    { id: 'safety' as const, label: 'Safety & Safeguards', icon: ShieldCheck },
    { id: 'ai' as const, label: 'Local AI (Ollama)', icon: Cpu },
    { id: 'scanning' as const, label: 'Scanning Scopes', icon: HardDrive },
    { id: 'automation' as const, label: 'Automation', icon: Sliders },
    { id: 'general' as const, label: 'General', icon: Settings },
    { id: 'database' as const, label: 'SQLite Database', icon: Database },
    { id: 'advanced' as const, label: 'Advanced & Logs', icon: Terminal },
  ];

  const handleSave = () => {
    onUpdateSafetySettings(settings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div id="settings-view" className="p-6 space-y-4 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#232530]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Application Settings & Engine Configuration
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-mono">
              Desktop Native Prefs
            </span>
          </div>
          <p className="text-xs text-[#7d869a] mt-0.5">
            Configure local AI backend, scanning scopes, filesystem safeguards, and SQLite journal storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}
          <button
            id="btn-save-settings"
            onClick={handleSave}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Settings Layout: Left Tabs, Right Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Settings Navigation */}
        <div className="md:col-span-3 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                id={`tab-settings-${t.id}`}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition text-left ${
                  isActive
                    ? 'bg-[#222530] text-white border border-[#2d3142]'
                    : 'text-[#848d9f] hover:text-white hover:bg-[#181920]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-[#646c7e]'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-9 rounded-lg bg-[#15161c] border border-[#252732] p-5 space-y-5">
          {/* SAFETY TAB */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#21232d]">
                <h3 className="font-semibold text-xs text-white">Filesystem Safety & Safeguards</h3>
                <p className="text-[11px] text-[#788194]">
                  Guarantees that no file can be lost, corrupted, or deleted without explicit interactive approval.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* Dry Run */}
                <label className="p-3 rounded bg-[#111216] border border-[#20222a] flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">Dry Run Mode by Default</span>
                    <span className="text-[11px] text-[#7a8397] block">
                      When enabled, the organizer simulates actions and logs changes without writing to disk.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dryRunMode}
                    onChange={(e) => setSettings({ ...settings, dryRunMode: e.target.checked })}
                    className="rounded bg-[#20222a] border-[#333745] text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                  />
                </label>

                {/* Require Approval */}
                <label className="p-3 rounded bg-[#111216] border border-[#20222a] flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">Require Approval Before File Relocation</span>
                    <span className="text-[11px] text-[#7a8397] block">
                      Enforces review in Proposed Moves. Autonomous background moving is disabled.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requireApprovalBeforeMoves}
                    onChange={(e) => setSettings({ ...settings, requireApprovalBeforeMoves: e.target.checked })}
                    className="rounded bg-[#20222a] border-[#333745] text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                  />
                </label>

                {/* Send duplicates to Trash */}
                <label className="p-3 rounded bg-[#111216] border border-[#20222a] flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">Send Duplicate Deletions to OS Trash</span>
                    <span className="text-[11px] text-[#7a8397] block">
                      Files are moved to macOS ~/.Trash or platform equivalent. No raw unlink() calls.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sendDuplicatesToTrash}
                    onChange={(e) => setSettings({ ...settings, sendDuplicatesToTrash: e.target.checked })}
                    className="rounded bg-[#20222a] border-[#333745] text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                  />
                </label>

                {/* Never permanently delete */}
                <label className="p-3 rounded bg-[#111216] border border-[#20222a] flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">Never Permanently Delete Files</span>
                    <span className="text-[11px] text-[#7a8397] block">
                      Hides all direct removal options. Permanent deletion is locked behind double verification.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!settings.permanentDeletion}
                    onChange={(e) => setSettings({ ...settings, permanentDeletion: !e.target.checked })}
                    className="rounded bg-[#20222a] border-[#333745] text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                  />
                </label>

                {/* Create Rollback Journal */}
                <label className="p-3 rounded bg-[#111216] border border-[#20222a] flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">Create Rollback Journal</span>
                    <span className="text-[11px] text-[#7a8397] block">
                      Maintains an immutable SQLite write-ahead log of previous locations, timestamps, and hashes.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.rollbackProtection}
                    onChange={(e) => setSettings({ ...settings, rollbackProtection: e.target.checked })}
                    className="rounded bg-[#20222a] border-[#333745] text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                  />
                </label>

                {/* Verify Hash After File Move */}
                <label className="p-3 rounded bg-[#111216] border border-[#20222a] flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">Verify SHA-256 Hash After Every Move</span>
                    <span className="text-[11px] text-[#7a8397] block">
                      Recalculates file hash on the target destination before confirming relocation success.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.verifyHashAfterMove}
                    onChange={(e) => setSettings({ ...settings, verifyHashAfterMove: e.target.checked })}
                    className="rounded bg-[#20222a] border-[#333745] text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

          {/* AI TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#21232d]">
                <h3 className="font-semibold text-xs text-white">Local AI Engine (Ollama & Qwen3)</h3>
                <p className="text-[11px] text-[#788194]">
                  Zero telemetry. All document text and categorization embeddings remain on this device.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8690a3] font-medium">Ollama Server Endpoint</label>
                  <input
                    type="text"
                    defaultValue="http://127.0.0.1:11434"
                    className="w-full bg-[#111216] border border-[#272a38] rounded px-3 py-1.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#8690a3] font-medium">Active Local Model</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue="qwen3:1.7b-instruct-q4_K_M"
                      className="flex-1 bg-[#111216] border border-[#272a38] rounded px-3 py-1.5 text-xs text-white font-mono"
                    />
                    <button
                      onClick={() => alert('Model benchmark: 48 tokens/sec on Apple Silicon Metal.')}
                      className="px-3 py-1.5 rounded bg-[#1f222d] text-white text-xs font-medium"
                    >
                      Benchmark
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#8690a3] font-medium">
                    Confidence Threshold for Auto-Suggestion ({'>'} 75%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    defaultValue="75"
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-[#6d7588] font-mono">
                    <span>50% (Permissive)</span>
                    <span>75% (Balanced)</span>
                    <span>95% (Strict only)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#8690a3] font-medium">
                    Maximum Text Sent to Model (Context Window Cap)
                  </label>
                  <select className="w-full bg-[#111216] border border-[#272a38] rounded px-3 py-1.5 text-xs text-white font-mono">
                    <option value="2048">First 2,048 tokens (Fastest, headers & summary)</option>
                    <option value="4096">First 4,096 tokens (Recommended)</option>
                    <option value="8192">First 8,192 tokens (Full document scan)</option>
                  </select>
                </div>

                {/* Privacy Badge Card */}
                <div className="p-3 rounded bg-[#121a16] border border-emerald-500/25 space-y-1 text-emerald-300">
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Air-Gapped Local Privacy Guarantee</span>
                  </div>
                  <p className="text-[11px] text-emerald-400/80 leading-snug">
                    File Intelligence uses Rust IPC to communicate exclusively with local localhost Ollama sockets. No network socket opens to external clouds.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCANNING TAB */}
          {activeTab === 'scanning' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#21232d]">
                <h3 className="font-semibold text-xs text-white">Scanning Directories & Scopes</h3>
                <p className="text-[11px] text-[#788194]">
                  Folders monitored for new inbound files and candidate relocation.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {['~/Desktop', '~/Downloads', '~/Documents (Master Root)', '/Volumes/SanDisk_Backup'].map((p) => (
                  <div key={p} className="p-2.5 rounded bg-[#111216] border border-[#22242e] flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-white">{p}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10">
                      Included
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DATABASE TAB */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#21232d]">
                <h3 className="font-semibold text-xs text-white">SQLite Index & Storage</h3>
                <p className="text-[11px] text-[#788194]">
                  Local relational database storing document metadata, full-text FTS5 index, and audit logs.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded bg-[#111216] border border-[#20222a] space-y-1">
                  <span className="text-[11px] text-[#737c8e] block">Database File Location:</span>
                  <span className="font-mono text-white text-xs block">
                    /Users/alex/Library/Application Support/FileIntelligence/index.db
                  </span>
                  <span className="text-[10px] text-[#5e6677] font-mono block">
                    Size: 18.4 MB · 12,482 file rows · Schema v4
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => alert('Rebuilding SQLite FTS5 index...')}
                    className="px-3 py-1.5 rounded bg-[#1e212b] hover:bg-[#282c38] text-white text-xs font-medium"
                  >
                    Rebuild Index
                  </button>
                  <button
                    onClick={() => alert('Exporting metadata to JSON...')}
                    className="px-3 py-1.5 rounded bg-[#1e212b] hover:bg-[#282c38] text-white text-xs font-medium"
                  >
                    Export Metadata (JSON)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GENERAL & AUTOMATION FALLBACKS */}
          {(activeTab === 'general' || activeTab === 'automation' || activeTab === 'advanced') && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#21232d]">
                <h3 className="font-semibold text-xs text-white capitalize">{activeTab} Preferences</h3>
                <p className="text-[11px] text-[#788194]">
                  Native macOS application defaults and logging levels.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded bg-[#111216] border border-[#20222a]">
                  <div>
                    <span className="font-semibold text-white block">Startup Behavior</span>
                    <span className="text-[11px] text-[#717a8e] block">Launch silently into macOS menu bar on login.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded bg-[#20222a] border-[#313543] text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-[#111216] border border-[#20222a]">
                  <div>
                    <span className="font-semibold text-white block">Telemetry & Crash Reporting</span>
                    <span className="text-[11px] text-[#717a8e] block">Strictly disabled. No outbound network requests.</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">DISABLED</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

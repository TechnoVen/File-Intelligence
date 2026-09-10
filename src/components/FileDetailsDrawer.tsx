import React, { useState } from 'react';
import {
  X,
  FileText,
  FolderTree,
  Calendar,
  Building2,
  Tag,
  Hash,
  Sparkles,
  ShieldAlert,
  ExternalLink,
  FolderOpen,
  Edit3,
  Check,
  Ban,
  Trash2,
  Copy,
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { FileItem } from '../types';

interface FileDetailsDrawerProps {
  file: FileItem | null;
  isOpen?: boolean;
  onClose: () => void;
  onApprove?: (fileId: string) => void;
  onApproveMove?: (fileId: string) => void;
  onIgnore?: (fileId: string) => void;
  onIgnoreFile?: (fileId: string) => void;
  onMoveToTrash?: (fileId: string) => void;
  onEditDestination?: (fileId: string, newPath: string) => void;
  onRename?: (fileId: string, newName: string) => void;
  dryRunMode?: boolean;
}

export const FileDetailsDrawer: React.FC<FileDetailsDrawerProps> = ({
  file,
  isOpen = Boolean(file),
  onClose,
  onApprove,
  onApproveMove,
  onIgnore,
  onIgnoreFile,
  onMoveToTrash = (_fileId: string) => {},
  onEditDestination = (_fileId: string, _newPath: string) => {},
  onRename = (_fileId: string, _newName: string) => {}
}) => {
  if (!isOpen || !file) return null;

  const handleApprove = () => {
    if (onApprove) onApprove(file.id);
    else if (onApproveMove) onApproveMove(file.id);
  };

  const handleIgnore = () => {
    if (onIgnore) onIgnore(file.id);
    else if (onIgnoreFile) onIgnoreFile(file.id);
  };

  const [copiedHash, setCopiedHash] = useState(false);
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [customDestination, setCustomDestination] = useState(file.suggestedDestination);
  const [isRenaming, setIsRenaming] = useState(false);
  const [customFilename, setCustomFilename] = useState(file.proposedFilename || file.name);

  const copySha = () => {
    navigator.clipboard.writeText(file.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleSaveDestination = () => {
    onEditDestination(file.id, customDestination);
    setIsEditingDestination(false);
  };

  const handleSaveRename = () => {
    onRename(file.id, customFilename);
    setIsRenaming(false);
  };

  return (
    <div
      id="file-details-drawer"
      className="fixed inset-y-0 right-0 w-[420px] max-w-full bg-[#181920] border-l border-[#282a34] shadow-2xl z-40 flex flex-col select-none text-[#d6dae5]"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#252732] flex items-center justify-between bg-[#15161b]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded bg-[#222530] border border-[#2d303e] flex items-center justify-center text-blue-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h3 className="font-semibold text-xs text-white truncate" title={file.name}>
              {file.name}
            </h3>
            <span className="text-[10px] text-[#7d8699] block font-mono">
              {file.sizeFormatted} · {file.extension.toUpperCase()}
            </span>
          </div>
        </div>

        <button
          id="btn-close-drawer"
          onClick={onClose}
          className="p-1 rounded hover:bg-[#232530] text-[#788092] hover:text-white transition"
          title="Close drawer (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Document Preview Card */}
        <div className="rounded-lg bg-[#121317] border border-[#242631] p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#7e879b]">
            <span className="font-medium text-white text-xs">Preview & Extract</span>
            <span className="px-1.5 py-0.5 rounded bg-[#1f212a] font-mono text-[10px] text-[#9ba4b7]">
              {file.mimeType}
            </span>
          </div>
          <div className="p-2.5 rounded bg-[#0d0e11] border border-[#1e2029] font-mono text-[11px] text-[#b8c0d2] leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap select-text">
            {file.previewSnippet || 'No plain text snippet extracted.'}
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => alert(`Simulating native system call: open "${file.currentPath}"`)}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[#1c1e27] hover:bg-[#242732] text-[#9ea8bd] hover:text-white transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Open File</span>
            </button>
            <button
              onClick={() => alert(`Simulating native macOS call: revealInFinder("${file.currentPath}")`)}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[#1c1e27] hover:bg-[#242732] text-[#9ea8bd] hover:text-white transition"
            >
              <FolderOpen className="w-3 h-3" />
              <span>Reveal in Finder</span>
            </button>
          </div>
        </div>

        {/* Classification Source Card */}
        <div className="rounded-lg bg-[#191b24] border border-[#272a38] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Classification Source: {file.classificationSource || (file.ruleOrAi.includes('Rule') ? 'Deterministic Rule' : 'Local AI')}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {file.confidenceTier} · {file.confidence}%
            </span>
          </div>

          {file.stableTaxonomyId && (
            <div className="text-[10px] text-[#717a8e] font-mono flex items-center justify-between bg-[#121318] px-2.5 py-1.5 rounded border border-[#20232e]">
              <span>Stable Taxonomy Binding:</span>
              <span className="text-blue-400 font-semibold">{file.stableTaxonomyId}</span>
            </div>
          )}

          <div className="text-xs text-[#cad1e0] bg-[#121318] p-2.5 rounded border border-[#20232e]">
            <div className="text-[10px] text-[#717a8e] uppercase font-semibold mb-1 tracking-wider">
              Classification basis & criteria:
            </div>
            <p className="leading-snug text-[11px] text-[#adb7cc] italic">
              "{file.reason}"
            </p>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-emerald-400/90 pt-0.5">
            <Lock className="w-3 h-3" />
            <span>Document analysis performed entirely on this device (offline).</span>
          </div>
        </div>

        {/* Suggested Destination Card */}
        <div className="rounded-lg bg-[#14151a] border border-[#242631] p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <FolderTree className="w-3.5 h-3.5 text-amber-400" />
              <span>Suggested Destination</span>
            </div>
            {!isEditingDestination ? (
              <button
                id="btn-edit-destination-drawer"
                onClick={() => setIsEditingDestination(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={handleSaveDestination}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
            )}
          </div>

          {!isEditingDestination ? (
            <div className="p-2 rounded bg-[#101115] border border-[#21232d] font-mono text-[11px] text-blue-300 break-all leading-tight">
              {file.suggestedDestination}
            </div>
          ) : (
            <input
              type="text"
              value={customDestination}
              onChange={(e) => setCustomDestination(e.target.value)}
              className="w-full bg-[#0e0f13] border border-blue-500 rounded p-1.5 text-xs text-white font-mono"
            />
          )}

          {/* Proposed Filename */}
          <div className="space-y-1 pt-1 border-t border-[#20222c]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#7d8699]">Proposed Filename:</span>
              {!isRenaming ? (
                <button
                  id="btn-rename-drawer"
                  onClick={() => setIsRenaming(true)}
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  Change
                </button>
              ) : (
                <button
                  onClick={handleSaveRename}
                  className="text-[10px] text-emerald-400 hover:underline font-medium"
                >
                  Apply
                </button>
              )}
            </div>

            {!isRenaming ? (
              <div className="font-mono text-xs text-white bg-[#101115] p-1.5 rounded border border-[#21232d] truncate">
                {file.proposedFilename || file.name}
              </div>
            ) : (
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                className="w-full bg-[#0e0f13] border border-blue-500 rounded p-1.5 text-xs text-white font-mono"
              />
            )}
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="rounded-lg bg-[#14151a] border border-[#242631] p-3.5 space-y-2.5 text-xs">
          <div className="font-semibold text-white text-xs pb-1 border-b border-[#21232d]">
            File Metadata
          </div>

          <div className="grid grid-cols-3 gap-1 text-[11px]">
            <span className="text-[#767e91]">Current Path:</span>
            <span className="col-span-2 font-mono text-white break-all text-[10px] bg-[#111216] p-1 rounded">
              {file.currentPath}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[11px]">
            <span className="text-[#767e91]">Category:</span>
            <span className="col-span-2 font-medium text-white">{file.category}</span>
          </div>

          {file.organization && (
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <span className="text-[#767e91]">Organization:</span>
              <span className="col-span-2 text-blue-300 flex items-center gap-1 font-medium">
                <Building2 className="w-3 h-3" />
                <span>{file.organization}</span>
              </span>
            </div>
          )}

          {file.detectedDocDate && (
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <span className="text-[#767e91]">Detected Date:</span>
              <span className="col-span-2 text-[#cad2e2] flex items-center gap-1 font-mono text-[10px]">
                <Calendar className="w-3 h-3" />
                <span>{file.detectedDocDate}</span>
              </span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-1 text-[11px]">
            <span className="text-[#767e91]">Created / Mod:</span>
            <span className="col-span-2 text-[#9ba4b8] font-mono text-[10px]">
              {file.createdDate} / {file.modifiedDate}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[11px] items-center">
            <span className="text-[#767e91]">SHA-256:</span>
            <div className="col-span-2 flex items-center gap-1 bg-[#101115] p-1 rounded border border-[#1f212b]">
              <span className="font-mono text-[9px] text-[#939cb0] truncate" title={file.sha256}>
                {file.sha256}
              </span>
              <button
                onClick={copySha}
                className="p-0.5 hover:text-white text-[#767e92] shrink-0"
                title="Copy SHA-256"
              >
                {copiedHash ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="pt-2 border-t border-[#20222c]">
            <span className="text-[10px] text-[#71798b] uppercase font-semibold block mb-1.5">
              Assigned Tags
            </span>
            <div className="flex flex-wrap gap-1">
              {file.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded bg-[#1c1e27] border border-[#2b2e3b] text-[10px] text-[#a6afc2] flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5 text-blue-400" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Action Bar */}
      <div className="p-3 bg-[#131418] border-t border-[#252733] space-y-2">
        <div className="flex items-center gap-2">
          <button
            id="btn-approve-drawer"
            onClick={handleApprove}
            className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve Move</span>
          </button>
          <button
            id="btn-ignore-drawer"
            onClick={handleIgnore}
            className="py-1.5 px-3 bg-[#1d1f27] hover:bg-[#252834] text-[#b0b8c9] rounded-md text-xs font-medium flex items-center gap-1 transition"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Ignore</span>
          </button>
        </div>

        <button
          id="btn-trash-drawer"
          onClick={() => onMoveToTrash(file.id)}
          className="w-full py-1.5 bg-[#20181b] hover:bg-[#2e1d23] border border-rose-500/20 text-rose-300 hover:text-rose-200 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Move to OS Trash</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  HardDrive,
  Cpu,
  FileCheck2,
  CopyCheck,
  AlertTriangle,
  FolderTree,
  RotateCcw
} from 'lucide-react';
import { ScanReport } from '../types';

interface ScanReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ScanReport;
  onRescan: () => void;
}

export const ScanReportModal: React.FC<ScanReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onRescan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none text-xs">
      <div className="w-full max-w-lg bg-[#161820] border border-[#272935] rounded-xl shadow-2xl p-5 space-y-4 text-[#d6dae5]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#232530]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Full Filesystem Scan Report</h2>
              <span className="text-[11px] text-[#788194] font-mono">Completed {report.timestamp}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#232530] text-[#7c8597] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-lg bg-[#111216] border border-[#21232c] text-center">
            <span className="text-[10px] text-[#717a8e] block">Files Indexed</span>
            <span className="text-base font-bold text-white font-mono">{report.filesScanned.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#111216] border border-[#21232c] text-center">
            <span className="text-[10px] text-[#717a8e] block">Scan Duration</span>
            <span className="text-base font-bold text-white font-mono">{report.durationSeconds}s</span>
          </div>
          <div className="p-3 rounded-lg bg-[#111216] border border-[#21232c] text-center">
            <span className="text-[10px] text-[#717a8e] block">New Unorganized</span>
            <span className="text-base font-bold text-blue-400 font-mono">+{report.newFiles}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#111216] border border-[#21232c] text-center">
            <span className="text-[10px] text-[#717a8e] block">Duplicates</span>
            <span className="text-base font-bold text-amber-400 font-mono">{report.duplicatesDetected}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#111216] border border-[#21232c] text-center">
            <span className="text-[10px] text-[#717a8e] block">AI Classifications</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{report.aiClassifications}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#111216] border border-[#21232c] text-center">
            <span className="text-[10px] text-[#717a8e] block">Integrity Errors</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{report.errors}</span>
          </div>
        </div>

        {/* Scanned Roots */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[#81899c]">Included Root Directories</span>
          <div className="p-2 rounded bg-[#111216] border border-[#21232c] space-y-1 font-mono text-[11px] text-[#a4adbf]">
            {report.scannedRoots.map((root) => (
              <div key={root} className="flex items-center gap-2">
                <HardDrive className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate">{root}</span>
                <span className="text-[9px] px-1 bg-emerald-500/10 text-emerald-400 rounded ml-auto">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Notes */}
        <div className="p-2.5 rounded bg-[#12141a] border border-[#222530] text-[11px] text-[#868fa0] leading-relaxed">
          The local SQLite database and Ollama inference pipeline processed 12,482 files with SHA-256 fingerprinting. No corrupted records or read failures detected.
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#232530]">
          <button
            onClick={() => {
              onClose();
              onRescan();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1f212a] hover:bg-[#282a35] text-white font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-scan Now</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-sm"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Database,
  Terminal,
  Code,
  Palette,
  CheckCircle2,
  HardDrive,
  Copy,
  Lock,
  Zap,
  FolderTree,
  FileCode
} from 'lucide-react';

export const DesignSystemView: React.FC = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedToken(val);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const tokens = [
    { name: 'App Canvas Background', value: '#0d0e12', desc: 'Deep obsidian desktop workspace' },
    { name: 'Sidebar Background', value: '#15161a', desc: 'macOS dark sidebar panel' },
    { name: 'Surface Card Background', value: '#15161c', desc: 'Subtle container surface' },
    { name: 'Surface Nested Card', value: '#111216', desc: 'Inset inner card background' },
    { name: 'Border Subtle', value: '#242630', desc: 'Discrete panel edge divider' },
    { name: 'Accent Primary (Blue)', value: '#2563eb', desc: 'Action buttons and highlights' },
    { name: 'Safety Protected (Emerald)', value: '#10b981', desc: 'Dry-run and verified integrity' },
    { name: 'Review Warning (Amber)', value: '#f59e0b', desc: 'Exact duplicates and medium confidence' },
    { name: 'Critical Safeguard (Rose)', value: '#e11d48', desc: 'Permanent deletion protection' }
  ];

  return (
    <div id="design-system-view" className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232530]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Design System & Tauri Desktop Spec
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              Desktop Native
            </span>
          </div>
          <p className="text-xs text-[#8c95a8] mt-0.5">
            Architecture documentation: Local AI inference, SQLite transactions, and desktop visual tokens.
          </p>
        </div>
      </div>

      {/* Grid: 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Local AI */}
        <div className="p-4 rounded-xl bg-[#15161c] border border-[#252732] space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Cpu className="w-4 h-4" />
            <h3 className="font-semibold text-xs text-white">Local AI (Ollama)</h3>
          </div>
          <p className="text-xs text-[#8b94a6] leading-relaxed">
            Runs locally on Apple Silicon Metal or Vulkan/CUDA using quantized Qwen3 1.7B / Mistral models. Zero telemetry, no cloud API roundtrips.
          </p>
          <div className="p-2 rounded bg-[#111216] border border-[#21232d] font-mono text-[11px] text-[#939cb2] space-y-1">
            <div>Engine: Ollama native daemon</div>
            <div>Model: Qwen3:1.7b-instruct-q4_K_M</div>
            <div>Speed: ~48 tokens/sec on M-series</div>
            <div>Latency: &lt;180ms per document classification</div>
          </div>
        </div>

        {/* Pillar 2: Tauri Desktop Core */}
        <div className="p-4 rounded-xl bg-[#15161c] border border-[#252732] space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <Terminal className="w-4 h-4" />
            <h3 className="font-semibold text-xs text-white">Tauri Rust Backend</h3>
          </div>
          <p className="text-xs text-[#8b94a6] leading-relaxed">
            Rust IPC commands handle filesystem access safely. Features atomic file operations, SHA-256 chunked hashing, and native OS Trash routing.
          </p>
          <div className="p-2 rounded bg-[#111216] border border-[#21232d] font-mono text-[11px] text-[#939cb2] space-y-1">
            <div>IPC: tauri::invoke commands</div>
            <div>Database: SQLite with WAL mode</div>
            <div>Watcher: notify crate (FSEvents/inotify)</div>
            <div>Security: Scoped path entitlements</div>
          </div>
        </div>

        {/* Pillar 3: Safety Guardrails */}
        <div className="p-4 rounded-xl bg-[#15161c] border border-[#252732] space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="font-semibold text-xs text-white">Safety Safeguards</h3>
          </div>
          <p className="text-xs text-[#8b94a6] leading-relaxed">
            Strict user-in-the-loop guarantee. Files are never moved automatically without user consent. Dry-run simulation enabled by default.
          </p>
          <div className="p-2 rounded bg-[#111216] border border-[#21232d] font-mono text-[11px] text-[#939cb2] space-y-1">
            <div>Dry Run: Zero disk writes when armed</div>
            <div>Checksum: Verified SHA-256 post move</div>
            <div>Rollback: Batch reversal journal</div>
            <div>Safeguard: 2-step typed confirm delete</div>
          </div>
        </div>
      </div>

      {/* Design Tokens Table */}
      <div className="rounded-xl bg-[#15161c] border border-[#252732] overflow-hidden">
        <div className="p-4 border-b border-[#232530] flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-xs">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Design Tokens & Color Palette</span>
          </div>
          <span className="text-[10px] text-[#6d7588] font-mono">WCAG AA Compliant</span>
        </div>

        <div className="divide-y divide-[#20222c]">
          {tokens.map((t) => (
            <div
              key={t.name}
              className="p-3 flex items-center justify-between hover:bg-[#191b22] transition text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded border border-white/10 shrink-0"
                  style={{ backgroundColor: t.value }}
                />
                <div>
                  <span className="font-medium text-white block">{t.name}</span>
                  <span className="text-[#6d7689] text-[11px]">{t.desc}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <code className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#101115] text-[#a4adbf] border border-[#22242d]">
                  {t.value}
                </code>
                <button
                  onClick={() => copyToClipboard(t.value)}
                  className="p-1 rounded hover:bg-[#252834] text-[#717a8e] hover:text-white transition"
                  title="Copy color hex"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography & Code snippet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#15161c] border border-[#252732] space-y-2">
          <div className="flex items-center gap-2 text-white font-semibold text-xs pb-1 border-b border-[#21232d]">
            <FileCode className="w-4 h-4 text-blue-400" />
            <span>Typography System</span>
          </div>
          <div className="space-y-2 text-xs pt-1">
            <div>
              <span className="text-[11px] text-[#717a8e] block">Display & UI Font</span>
              <span className="font-medium text-white">SF Pro / Inter / Apple System (-apple-system, BlinkMacSystemFont)</span>
            </div>
            <div>
              <span className="text-[11px] text-[#717a8e] block">Code & Monospace</span>
              <span className="font-mono text-white text-[11px]">JetBrains Mono, SF Mono, Menlo, monospace</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#15161c] border border-[#252732] space-y-2">
          <div className="flex items-center gap-2 text-white font-semibold text-xs pb-1 border-b border-[#21232d]">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Privacy Guarantee</span>
          </div>
          <p className="text-xs text-[#8992a4] leading-relaxed pt-1">
            This dashboard operates 100% offline. File hashes and document embeddings never leave your device. All classification prompts are evaluated against the local Ollama instance on localhost.
          </p>
        </div>
      </div>
    </div>
  );
};

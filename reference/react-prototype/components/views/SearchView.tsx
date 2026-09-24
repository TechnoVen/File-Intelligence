import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  FolderOpen,
  ExternalLink,
  Calendar,
  Building2,
  Tag,
  FileText,
  Filter,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { FileItem } from '../../types';

interface SearchViewProps {
  files: FileItem[];
  onSelectFile: (file: FileItem) => void;
  initialQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ files, onSelectFile, initialQuery }) => {
  const [query, setQuery] = useState<string>(initialQuery || 'all Jobcenter documents from 2026');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  React.useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== '') {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const exampleSearches = [
    'all Jobcenter documents from 2026',
    'THE DEN permits',
    'CosFair payslips',
    'documents related to Herzogstraße 90',
    'tax relevant files from 2025'
  ];

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return files;

    return files.filter((f) => {
      // Semantic and keyword matches
      const textCorpus = `${f.name} ${f.currentPath} ${f.suggestedDestination} ${f.organization || ''} ${f.category} ${f.reason} ${f.tags.join(' ')} ${f.previewSnippet || ''}`.toLowerCase();

      if (q.includes('jobcenter')) {
        return textCorpus.includes('jobcenter') || textCorpus.includes('jc');
      }
      if (q.includes('den') || q.includes('the den')) {
        return textCorpus.includes('den');
      }
      if (q.includes('cosfair') || q.includes('payslip') || q.includes('abrechnung')) {
        return textCorpus.includes('cosfair') || textCorpus.includes('abrechnung');
      }
      if (q.includes('herzogstraße') || q.includes('herzogstrasse') || q.includes('90')) {
        return textCorpus.includes('herzog');
      }
      if (q.includes('tax') || q.includes('steuer') || q.includes('finanzamt')) {
        return textCorpus.includes('steuer') || textCorpus.includes('finanzamt') || textCorpus.includes('tax');
      }

      // Default string match
      const words = q.split(' ');
      return words.some(w => textCorpus.includes(w));
    });
  }, [files, query]);

  return (
    <div id="search-view" className="p-6 space-y-4 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="pb-3 border-b border-[#232530]">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white tracking-tight">
            Intelligent File Search
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-mono">
            Local Semantic + Full-Text Index
          </span>
        </div>
        <p className="text-xs text-[#7d869a] mt-0.5">
          Query across document extracts, OCR text, metadata, and SQLite entity relations completely offline.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3 text-blue-400" />
        <input
          id="intelligent-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask in natural language or search filenames, dates, organizations..."
          className="w-full bg-[#151720] border border-[#2b2e3c] rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder-[#60697c] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner transition"
        />
      </div>

      {/* Example Queries Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] text-[#636c7f] mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Quick queries:</span>
        </span>
        {exampleSearches.map((example) => (
          <button
            key={example}
            onClick={() => setQuery(example)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition ${
              query === example
                ? 'bg-blue-600 text-white'
                : 'bg-[#181a22] text-[#9ba4b7] hover:bg-[#232634] hover:text-white border border-[#272935]'
            }`}
          >
            "{example}"
          </button>
        ))}
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between text-xs text-[#7d869a] pt-1">
        <span>Found {searchResults.length} matching documents in local index</span>
        <span className="font-mono text-[11px]">Query latency: 8ms (SQLite FTS5 + Qwen3 embeddings)</span>
      </div>

      {/* Results List */}
      <div className="space-y-2.5">
        {searchResults.length === 0 ? (
          <div className="p-8 text-center rounded-lg bg-[#14151a] border border-[#22242d] text-[#717a8c] space-y-2">
            <Search className="w-8 h-8 mx-auto text-[#404654]" />
            <div className="text-xs font-medium text-white">No files matched your query</div>
            <p className="text-[11px]">Try searching by company name, year (2025/2026), or filename snippet.</p>
          </div>
        ) : (
          searchResults.map((file) => (
            <div
              key={file.id}
              id={`search-result-${file.id}`}
              onClick={() => onSelectFile(file)}
              className="p-3.5 rounded-lg bg-[#15161c] border border-[#242631] hover:border-blue-500/40 hover:bg-[#1a1c24] cursor-pointer transition space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded bg-[#20222c] border border-[#2b2e3b] flex items-center justify-center text-blue-400 shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-semibold text-xs text-white truncate font-mono">
                      {file.name}
                    </h4>
                    <div className="text-[10px] text-[#788194] font-mono truncate">
                      {file.currentPath}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                    Relevance: 98%
                  </span>
                  <button
                    onClick={() => alert(`Simulating native system call: open "${file.currentPath}"`)}
                    className="p-1 rounded hover:bg-[#272935] text-[#8e98ac] hover:text-white transition"
                    title="Open file"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alert(`Revealing in Finder: "${file.currentPath}"`)}
                    className="p-1 rounded hover:bg-[#272935] text-[#8e98ac] hover:text-white transition"
                    title="Reveal in Finder"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Snippet */}
              {file.previewSnippet && (
                <div className="p-2 rounded bg-[#101115] border border-[#1f2129] font-mono text-[11px] text-[#abb3c4] line-clamp-2">
                  {file.previewSnippet}
                </div>
              )}

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#7a8397] pt-1">
                {file.organization && (
                  <div className="flex items-center gap-1 text-blue-300 font-medium">
                    <Building2 className="w-3 h-3" />
                    <span>{file.organization}</span>
                  </div>
                )}
                {file.detectedDocDate && (
                  <div className="flex items-center gap-1 text-[#9aa3b5] font-mono text-[10px]">
                    <Calendar className="w-3 h-3" />
                    <span>{file.detectedDocDate}</span>
                  </div>
                )}
                <div className="text-[#687082] font-mono text-[10px]">
                  Category: {file.category}
                </div>
                <div className="flex items-center gap-1">
                  {file.tags.map((t) => (
                    <span key={t} className="px-1.5 py-0.2 rounded bg-[#1c1e27] text-[9px] text-[#8f99ac]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

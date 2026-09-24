import React, { useState } from 'react';
import { 
  Folder, 
  FolderTree, 
  ChevronRight, 
  ChevronDown, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  Edit3, 
  Plus, 
  ShieldCheck, 
  Building2, 
  Hash, 
  ExternalLink,
  Search,
  HardDrive,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { TaxonomyNode, RuleItem } from '../../types';
import { INITIAL_TAXONOMY_TREE, STABLE_TAXONOMY_MAPPINGS } from '../../data/mockData';

interface FolderIntelligenceViewProps {
  rules: RuleItem[];
  onNavigateToRule?: (ruleId: string) => void;
  onNavigateToInbox?: () => void;
  onNavigateToDuplicates?: () => void;
}

export const FolderIntelligenceView: React.FC<FolderIntelligenceViewProps> = ({
  rules,
  onNavigateToRule,
  onNavigateToInbox,
  onNavigateToDuplicates
}) => {
  const [treeData, setTreeData] = useState<TaxonomyNode>(INITIAL_TAXONOMY_TREE);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('root.documents');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Record<string, boolean>>({
    'root.documents': true,
    'projects.root': true,
    'areas.root': true
  });
  const [taxonomyMappings, setTaxonomyMappings] = useState<Record<string, string>>(STABLE_TAXONOMY_MAPPINGS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mapping editor state
  const [isEditingMapping, setIsEditingMapping] = useState(false);
  const [editedPath, setEditedPath] = useState('');
  const [mappingSavedFeedback, setMappingSavedFeedback] = useState(false);
  
  // Add folder modal state
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderTaxonomyId, setNewFolderTaxonomyId] = useState('');

  // Recursive search for selected node
  const findNodeById = (node: TaxonomyNode, id: string): TaxonomyNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = findNodeById(treeData, selectedNodeId) || treeData;

  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleSelectNode = (node: TaxonomyNode) => {
    setSelectedNodeId(node.id);
    setIsEditingMapping(false);
    setMappingSavedFeedback(false);
    setEditedPath(taxonomyMappings[node.id] || node.path);
  };

  const handleSaveTaxonomyMapping = () => {
    if (!editedPath.trim()) return;
    setTaxonomyMappings(prev => ({
      ...prev,
      [selectedNode.id]: editedPath.trim()
    }));
    setIsEditingMapping(false);
    setMappingSavedFeedback(true);
    setTimeout(() => setMappingSavedFeedback(false), 2500);
  };

  const handleAddFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newId = newFolderTaxonomyId.trim() || `${selectedNode.id}.${newFolderName.toLowerCase().replace(/\s+/g, '_')}`;
    const newChildPath = `${taxonomyMappings[selectedNode.id] || selectedNode.path}/${newFolderName.trim()}`;

    const newNode: TaxonomyNode = {
      id: newId,
      name: newFolderName.trim(),
      path: newChildPath,
      type: 'area',
      filesCount: 0,
      sizeFormatted: '0 B',
      duplicatesCount: 0,
      unclassifiedCount: 0,
      recentChangesCount: 0,
      targetedByRuleIds: [],
      associatedOrgNames: []
    };

    // Deep add to children of selectedNode
    const addRecursively = (curr: TaxonomyNode): TaxonomyNode => {
      if (curr.id === selectedNode.id) {
        return {
          ...curr,
          children: [...(curr.children || []), newNode]
        };
      }
      if (curr.children) {
        return {
          ...curr,
          children: curr.children.map(addRecursively)
        };
      }
      return curr;
    };

    setTreeData(addRecursively(treeData));
    setTaxonomyMappings(prev => ({ ...prev, [newId]: newChildPath }));
    setExpandedNodeIds(prev => ({ ...prev, [selectedNode.id]: true }));
    setIsAddingFolder(false);
    setNewFolderName('');
    setNewFolderTaxonomyId('');
    setSelectedNodeId(newId);
  };

  // Render tree node recursively
  const renderTreeNode = (node: TaxonomyNode, depth = 0) => {
    const isExpanded = !!expandedNodeIds[node.id];
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const hasUnclassified = node.unclassifiedCount > 0;
    const hasDuplicates = node.duplicatesCount > 0;

    // Filter by search query if any
    const matchesQuery = !searchQuery || 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      node.id.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => handleSelectNode(node)}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`flex items-center justify-between py-1.5 pr-3 rounded-md cursor-pointer transition text-xs group ${
            isSelected 
              ? 'bg-blue-600/20 text-white border border-blue-500/30' 
              : 'hover:bg-[#1c1e27] text-[#bcc4d6]'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 text-[#6c7486] hover:text-white transition"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-4.5" />
            )}

            <Folder className={`w-3.5 h-3.5 shrink-0 ${
              node.type === 'root' ? 'text-blue-400' :
              node.type === 'inbox' ? 'text-amber-400' :
              node.type === 'project' ? 'text-emerald-400' :
              node.type === 'resource' ? 'text-purple-400' :
              'text-[#8892a7]'
            }`} />

            <span className={`font-mono text-xs truncate ${isSelected ? 'font-semibold text-white' : ''}`}>
              {node.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {hasUnclassified && (
              <span 
                className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-medium"
                title={`${node.unclassifiedCount} unclassified inbox items`}
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>{node.unclassifiedCount}</span>
              </span>
            )}

            {hasDuplicates && (
              <span 
                className="px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-300 font-mono text-[10px]"
                title={`${node.duplicatesCount} duplicate sets`}
              >
                {node.duplicatesCount} dup
              </span>
            )}

            <span className="text-[11px] font-mono text-[#6c7486] group-hover:text-[#9aa3b6]">
              {node.filesCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Associated rules for this folder
  const folderRules = rules.filter(r => 
    r.stableTaxonomyId === selectedNode.id || 
    selectedNode.targetedByRuleIds?.includes(r.id) ||
    r.actions.some(a => a.stableTaxonomyId === selectedNode.id)
  );

  return (
    <div id="folder-intelligence-view" className="p-6 space-y-5 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#232530]">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Folder Intelligence
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1c1f29] border border-[#2b2f3d] text-[#8e98ac] font-mono">
              Library View & Taxonomy
            </span>
          </div>
          <p className="text-xs text-[#8790a3] mt-0.5">
            Inspect library structure, verify health metrics, and map stable taxonomy IDs to physical filesystem locations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingFolder(true)}
            className="px-3 py-1.5 bg-[#1d1f27] hover:bg-[#252834] text-white border border-[#2d303f] rounded-md text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Add Folder</span>
          </button>
          <div className="px-3 py-1.5 bg-[#15161b] border border-[#22242f] rounded-md text-xs font-mono text-[#8a94a9] flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>~/Documents</span>
          </div>
        </div>
      </div>

      {/* 2-Pane Desktop Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Pane: Hierarchical Tree Navigation (lg:col-span-5) */}
        <div className="lg:col-span-5 rounded-lg bg-[#15161c] border border-[#242631] p-3.5 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#21232c]">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Filesystem Hierarchy
            </div>
            <span className="text-[10px] font-mono text-[#6c7486]">
              12,482 Total Files
            </span>
          </div>

          {/* Tree Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6c7486] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter library folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f1014] border border-[#222530] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#5d6475] focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Tree Render Container */}
          <div className="overflow-y-auto max-h-[580px] pr-1 space-y-0.5">
            {renderTreeNode(treeData)}
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-[#21232d] flex items-center justify-between text-[11px] text-[#6d7587]">
            <span>Click any node to inspect details</span>
            <span className="font-mono text-[10px]">100% Local Storage</span>
          </div>
        </div>

        {/* Right Pane: Detailed Folder & Taxonomy Inspector (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Inspector Card */}
          <div className="rounded-lg bg-[#15161c] border border-[#242631] p-4.5 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[#21232c]">
              <div>
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white font-mono">
                    {selectedNode.name}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1d202b] border border-[#2a2e3e] text-[#939db2] font-mono capitalize">
                    {selectedNode.type}
                  </span>
                </div>
                <div className="text-xs text-[#7e879b] font-mono mt-1">
                  Physical Path: <span className="text-white">{taxonomyMappings[selectedNode.id] || selectedNode.path}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Simulating native desktop reveal: revealInFinder("${taxonomyMappings[selectedNode.id] || selectedNode.path}")`)}
                  className="px-2.5 py-1.5 rounded bg-[#1c1e27] hover:bg-[#252834] text-[#9da6b9] hover:text-white text-xs transition flex items-center gap-1.5 font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Reveal</span>
                </button>
              </div>
            </div>

            {/* STABLE TAXONOMY ID MAPPING SECTION (Core architectural requirement) */}
            <div className="rounded-md bg-[#111216] border border-[#232531] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-semibold text-white">Stable Taxonomy ID</span>
                </div>
                <span className="text-[10px] text-emerald-400/90 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Decoupled from Literal Paths
                </span>
              </div>

              <p className="text-[11px] text-[#7d8699] leading-relaxed">
                Rules and AI classify files into stable taxonomy identifiers rather than literal paths. You can reorganize your physical filesystem without breaking rule bindings.
              </p>

              <div className="flex items-center gap-2 bg-[#0c0d10] p-2 rounded border border-[#1d1f28]">
                <span className="font-mono text-xs text-blue-300 font-semibold shrink-0">
                  {selectedNode.id}
                </span>
                <span className="text-[#565d6f] font-mono text-xs">→</span>
                {!isEditingMapping ? (
                  <span className="font-mono text-xs text-[#abb5c7] truncate flex-1">
                    {taxonomyMappings[selectedNode.id] || selectedNode.path}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={editedPath}
                    onChange={(e) => setEditedPath(e.target.value)}
                    className="flex-1 bg-[#171922] border border-blue-500 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                  />
                )}

                {!isEditingMapping ? (
                  <button
                    onClick={() => {
                      setEditedPath(taxonomyMappings[selectedNode.id] || selectedNode.path);
                      setIsEditingMapping(true);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#1a1c25]"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Mapping</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleSaveTaxonomyMapping}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditingMapping(false)}
                      className="text-xs text-[#7e879b] hover:text-white px-1.5 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {mappingSavedFeedback && (
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Taxonomy path mapping updated. All associated rules now point to the new destination.</span>
                </div>
              )}
            </div>

            {/* Folder Health & Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-[#111216] border border-[#20222d]">
                <span className="text-[10px] text-[#6d7587] font-medium block">Total Files</span>
                <span className="text-base font-bold font-mono text-white mt-1 block">
                  {selectedNode.filesCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#555d6e] font-mono mt-0.5 block">
                  {selectedNode.sizeFormatted}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#111216] border border-[#20222d]">
                <span className="text-[10px] text-[#6d7587] font-medium block">Unclassified</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-base font-bold font-mono ${selectedNode.unclassifiedCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedNode.unclassifiedCount}
                  </span>
                  {selectedNode.unclassifiedCount > 0 && onNavigateToInbox && (
                    <button
                      onClick={onNavigateToInbox}
                      className="text-[10px] text-blue-400 hover:underline"
                    >
                      Triage
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-[#555d6e] mt-0.5 block">
                  {selectedNode.unclassifiedCount > 0 ? 'Requires attention' : 'Organized'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#111216] border border-[#20222d]">
                <span className="text-[10px] text-[#6d7587] font-medium block">Exact Duplicates</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-base font-bold font-mono ${selectedNode.duplicatesCount > 0 ? 'text-rose-400' : 'text-white'}`}>
                    {selectedNode.duplicatesCount}
                  </span>
                  {selectedNode.duplicatesCount > 0 && onNavigateToDuplicates && (
                    <button
                      onClick={onNavigateToDuplicates}
                      className="text-[10px] text-blue-400 hover:underline"
                    >
                      Review
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-[#555d6e] mt-0.5 block">
                  {selectedNode.duplicatesCount > 0 ? 'Potential savings' : 'Clean'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#111216] border border-[#20222d]">
                <span className="text-[10px] text-[#6d7587] font-medium block">Recent Changes</span>
                <span className="text-base font-bold font-mono text-white mt-1 block">
                  {selectedNode.recentChangesCount}
                </span>
                <span className="text-[10px] text-[#555d6e] mt-0.5 block">
                  Past 30 days
                </span>
              </div>
            </div>

            {/* Targeted Rules for this Folder */}
            <div className="space-y-2 pt-2 border-t border-[#20222d]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-white">
                    Targeting Rules ({folderRules.length})
                  </span>
                </div>
                <span className="text-[10px] text-[#6d7587]">
                  Automatic & proposed routing
                </span>
              </div>

              {folderRules.length === 0 ? (
                <div className="p-3 rounded bg-[#101115] border border-[#1f212a] text-xs text-[#70798c] italic text-center">
                  No active rules currently route directly to this taxonomy node.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {folderRules.map(rule => (
                    <div 
                      key={rule.id}
                      className="p-2.5 rounded bg-[#111216] border border-[#21232d] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate">{rule.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1c1f29] text-[#939db1] font-mono">
                            Priority {rule.priority}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-mono">
                            {rule.tier}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#788195] truncate mt-0.5">
                          {rule.description || 'Applies conditional logic to route files.'}
                        </p>
                      </div>

                      {onNavigateToRule && (
                        <button
                          onClick={() => onNavigateToRule(rule.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 whitespace-nowrap shrink-0"
                        >
                          View Rule
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Associated Organizations */}
            {selectedNode.associatedOrgNames && selectedNode.associatedOrgNames.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#20222d]">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">
                    Associated Organizations & Entities
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.associatedOrgNames.map(org => (
                    <span 
                      key={org}
                      className="px-2 py-1 rounded bg-[#121318] border border-[#242735] text-xs font-mono text-[#abb5c8]"
                    >
                      {org}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Folder Modal */}
      {isAddingFolder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#16171d] border border-[#282a38] rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#232530]">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-400" />
                <span>Add Subfolder to {selectedNode.name}</span>
              </h3>
              <button 
                onClick={() => setIsAddingFolder(false)}
                className="text-[#7d8699] hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFolderSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8d97ac] mb-1 font-medium">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Invoices_2026 or Software_Apps"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-[#101115] border border-[#2a2d3b] rounded p-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8d97ac] mb-1 font-medium">
                  Stable Taxonomy Identifier (Optional)
                </label>
                <input
                  type="text"
                  placeholder={`e.g., ${selectedNode.id}.my_folder`}
                  value={newFolderTaxonomyId}
                  onChange={(e) => setNewFolderTaxonomyId(e.target.value)}
                  className="w-full bg-[#101115] border border-[#2a2d3b] rounded p-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-[#6d7587] mt-1 block">
                  Defaults to parent ID dot folder name.
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#101115] border border-[#1f212a] text-[11px] text-[#8690a2]">
                Will be physically created at: <br />
                <span className="font-mono text-white">{taxonomyMappings[selectedNode.id] || selectedNode.path}/{newFolderName || '[name]'}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingFolder(false)}
                  className="px-3 py-1.5 rounded bg-[#1f212a] hover:bg-[#272935] text-[#939cae] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

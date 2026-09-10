import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  ArrowRight,
  FolderTree,
  Tag,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
  X,
  Trash2,
  Folder,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Eye,
  FileText,
  Search,
  Hash
} from 'lucide-react';
import { RuleItem, RuleCondition, RuleAction, RuleTier, RuleSafety, FileItem } from '../../types';
import { STABLE_TAXONOMY_MAPPINGS } from '../../data/mockData';

interface RulesViewProps {
  rules: RuleItem[];
  allFiles?: FileItem[];
  onToggleRule: (id: string) => void;
  onSaveRule: (rule: RuleItem) => void;
  onResetDefaults: () => void;
}

export const RulesView: React.FC<RulesViewProps> = ({
  rules,
  allFiles = [],
  onToggleRule,
  onSaveRule,
  onResetDefaults
}) => {
  const [selectedRule, setSelectedRule] = useState<RuleItem>(rules[0]);
  const [tierFilter, setTierFilter] = useState<'ALL' | RuleTier>('ALL');
  const [ruleTestResult, setRuleTestResult] = useState<string | null>(null);
  
  // Preview Matches modal state
  const [isPreviewMatchesOpen, setIsPreviewMatchesOpen] = useState(false);

  // Form state for rule builder
  const [formRule, setFormRule] = useState<RuleItem>(rules[0]);

  const handleSelectRuleToEdit = (rule: RuleItem) => {
    setSelectedRule(rule);
    setFormRule({ ...rule });
    setRuleTestResult(null);
  };

  const handleCreateNewRule = () => {
    const newR: RuleItem = {
      id: `rule-custom-${Date.now()}`,
      name: 'Custom Document Filter',
      enabled: true,
      priority: 75,
      tier: 'YOUR RULE',
      safety: 'require approval',
      logic: 'AND',
      conditions: [{ id: `c-${Date.now()}`, field: 'filename', operator: 'contains', value: '' }],
      actions: [{ 
        actionType: 'propose_destination', 
        stableTaxonomyId: 'projects.business.the_den',
        targetPath: 'Documents / 01_Projects / Business_Projects / THE_DEN',
        renamePattern: '{date}_{type}_{name}.pdf'
      }],
      stableTaxonomyId: 'projects.business.the_den',
      targetDisplayPath: 'Projects / Business_Projects / THE_DEN',
      renamePattern: '{date}_{type}_{name}.pdf',
      tags: ['custom'],
      reviewBehavior: 'require approval',
      matchCount: 0,
      isDefault: false,
      description: 'Custom deterministic trigger configured by user.'
    };
    setSelectedRule(newR);
    setFormRule(newR);
    setRuleTestResult(null);
  };

  const handleAddCondition = () => {
    setFormRule({
      ...formRule,
      conditions: [
        ...formRule.conditions,
        { id: `c-${Date.now()}`, field: 'document_text', operator: 'contains', value: '' }
      ]
    });
  };

  const handleRemoveCondition = (id: string) => {
    if (formRule.conditions.length <= 1) return;
    setFormRule({
      ...formRule,
      conditions: formRule.conditions.filter((c) => c.id !== id)
    });
  };

  const handleTestRule = () => {
    setRuleTestResult(`Simulation evaluated across 12,482 indexed files: ${formRule.matchCount || 31} deterministic matches found. 0 conflicts detected.`);
  };

  const handleSaveCurrentRule = () => {
    onSaveRule(formRule);
    setSelectedRule(formRule);
    setRuleTestResult('Rule successfully saved and committed to local rules engine.');
    setTimeout(() => setRuleTestResult(null), 3000);
  };

  const filteredRules = rules.filter(r => tierFilter === 'ALL' || r.tier === tierFilter);

  // Simulated diff for "Preview Matches"
  const previewMatchedFiles = [
    {
      id: 'prev-1',
      name: 'JC_Widerspruch_11.06.2026.pdf',
      currentLocation: '~/Downloads',
      previousDestination: 'Documents / 00_Inbox',
      newDestination: formRule.targetDisplayPath,
      willChangeDestination: true
    },
    {
      id: 'prev-2',
      name: 'JC_Antrag_Weiterbewilligung_2026.pdf',
      currentLocation: '~/Desktop',
      previousDestination: 'Documents / 02_Areas / 01_Personal / Housing_Herzogstrasse',
      newDestination: formRule.targetDisplayPath,
      willChangeDestination: true
    },
    {
      id: 'prev-3',
      name: 'JC_Bescheid_Mietkosten_Addendum.pdf',
      currentLocation: '~/Downloads',
      previousDestination: formRule.targetDisplayPath,
      newDestination: formRule.targetDisplayPath,
      willChangeDestination: false
    },
    {
      id: 'prev-4',
      name: 'Widerspruch_Kosten_Unterkunft_v2.pdf',
      currentLocation: '~/Documents/00_Inbox',
      previousDestination: 'Documents / 00_Inbox',
      newDestination: formRule.targetDisplayPath,
      willChangeDestination: true
    },
    {
      id: 'prev-5',
      name: 'JC_Schreiben_Aufforderung_Mitwirkung.pdf',
      currentLocation: '~/Downloads',
      previousDestination: formRule.targetDisplayPath,
      newDestination: formRule.targetDisplayPath,
      willChangeDestination: false
    }
  ];

  return (
    <div id="rules-view" className="p-6 space-y-4 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#232530]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Rules System
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-mono">
              3-Level Hierarchy
            </span>
          </div>
          <p className="text-xs text-[#7d869a] mt-0.5">
            Configure deterministic WHEN → THEN rules, preview match diffs, and map actions to stable taxonomy identifiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDefaults}
            className="px-3 py-1.5 rounded bg-[#1b1c24] hover:bg-[#252834] border border-[#2b2e3c] text-[#a4adbf] hover:text-white text-xs font-medium flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
          <button
            id="btn-new-rule"
            onClick={handleCreateNewRule}
            className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Rule</span>
          </button>
        </div>
      </div>

      {/* 3-Level Operating Hierarchy Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setTierFilter(tierFilter === 'BUILT-IN DEFAULT' ? 'ALL' : 'BUILT-IN DEFAULT')}
          className={`p-3 rounded-lg border text-left transition ${
            tierFilter === 'BUILT-IN DEFAULT'
              ? 'bg-blue-900/20 border-blue-500/60'
              : 'bg-[#15161c] border-[#242632] hover:border-[#2e3140]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
              1. BUILT-IN DEFAULT
            </span>
            <span className="text-[10px] font-mono text-[#788195]">System Base</span>
          </div>
          <p className="text-xs text-[#cad1e0] font-medium mt-1.5">
            Pre-bundled system rules
          </p>
          <p className="text-[11px] text-[#717a8e] mt-0.5">
            Default sorting logic provided by File Intelligence for common patterns.
          </p>
        </button>

        <button
          onClick={() => setTierFilter(tierFilter === 'YOUR RULE' ? 'ALL' : 'YOUR RULE')}
          className={`p-3 rounded-lg border text-left transition ${
            tierFilter === 'YOUR RULE'
              ? 'bg-emerald-900/20 border-emerald-500/60'
              : 'bg-[#15161c] border-[#242632] hover:border-[#2e3140]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              2. YOUR RULE
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Overrides Default</span>
          </div>
          <p className="text-xs text-[#cad1e0] font-medium mt-1.5">
            User persistent customizations
          </p>
          <p className="text-[11px] text-[#717a8e] mt-0.5">
            Custom rules saved by you. Takes precedence over built-in defaults.
          </p>
        </button>

        <button
          onClick={() => setTierFilter(tierFilter === 'TEMPORARY RULE' ? 'ALL' : 'TEMPORARY RULE')}
          className={`p-3 rounded-lg border text-left transition ${
            tierFilter === 'TEMPORARY RULE'
              ? 'bg-amber-900/20 border-amber-500/60'
              : 'bg-[#15161c] border-[#242632] hover:border-[#2e3140]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
              3. TEMPORARY RULE
            </span>
            <span className="text-[10px] font-mono text-[#788195]">Scan-Scoped</span>
          </div>
          <p className="text-xs text-[#cad1e0] font-medium mt-1.5">
            Single-session triage filters
          </p>
          <p className="text-[11px] text-[#717a8e] mt-0.5">
            Ad-hoc sorting rules that only apply to the current active scan.
          </p>
        </button>
      </div>

      {/* 2-Column Desktop Grid: Left Priority Stack, Right Rule Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Rules Table / List (lg:col-span-5) */}
        <div className="lg:col-span-5 rounded-lg bg-[#15161c] border border-[#252732] p-3 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#21232d] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white">Rule Priority Stack</span>
              <span className="text-[10px] font-mono text-[#6d7589]">
                ({filteredRules.length} showing)
              </span>
            </div>
            <span className="text-[10px] text-[#71798b]">Evaluated top to bottom</span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-0.5">
            {filteredRules.map((r) => {
              const isSelected = selectedRule?.id === r.id;
              return (
                <div
                  key={r.id}
                  id={`rule-item-${r.id}`}
                  onClick={() => handleSelectRuleToEdit(r)}
                  className={`p-3 rounded-md border cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#1b1e28] border-blue-500/50'
                      : 'bg-[#121317] border-[#22242e] hover:border-[#2f3342]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-semibold text-white truncate">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] font-mono text-[#8b94a7] bg-[#1a1c24] px-1.5 py-0.5 rounded">
                        P{r.priority}
                      </span>
                      <button
                        onClick={() => onToggleRule(r.id)}
                        className={`text-[10px] px-2 py-0.5 rounded font-medium transition ${
                          r.enabled
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#21232b] text-[#737c8e]'
                        }`}
                      >
                        {r.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>

                  {/* Badges for Tier and Safety */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      r.tier === 'BUILT-IN DEFAULT' ? 'bg-blue-500/15 text-blue-300' :
                      r.tier === 'YOUR RULE' ? 'bg-emerald-500/15 text-emerald-300' :
                      'bg-amber-500/15 text-amber-300'
                    }`}>
                      {r.tier}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1c1e27] text-[#8e98ac]">
                      {r.safety}
                    </span>
                  </div>

                  <div className="text-[11px] text-blue-300 font-mono mt-1 flex items-center gap-1 truncate">
                    <ArrowRight className="w-3 h-3 text-[#646c7f] shrink-0" />
                    <span className="truncate">{r.targetDisplayPath}</span>
                  </div>

                  <div className="text-[10px] text-[#6d7588] mt-1 flex items-center justify-between">
                    <span>{r.conditions.length} condition{r.conditions.length > 1 ? 's' : ''} ({r.logic})</span>
                    <span className="font-mono text-white/80">{r.matchCount} matched</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: RULE BUILDER INTERFACE (lg:col-span-7) */}
        <div id="rule-builder-panel" className="lg:col-span-7 rounded-lg bg-[#15161c] border border-[#252732] p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#21232d] gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-xs text-white">
                Rule Builder & Editor
              </h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e202b] text-[#8e98ab] font-mono">
                {formRule.tier}
              </span>
            </div>

            {/* Top Editor Action Buttons: Test Rule, Preview Matches, Save Rule */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestRule}
                className="px-2.5 py-1 rounded bg-[#1e2029] hover:bg-[#272a38] text-white text-xs font-medium flex items-center gap-1 transition"
                title="Run immediate deterministic simulation"
              >
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Test Rule</span>
              </button>

              <button
                onClick={() => setIsPreviewMatchesOpen(true)}
                className="px-2.5 py-1 rounded bg-[#1c2230] hover:bg-[#222b3d] text-blue-300 border border-blue-500/30 text-xs font-medium flex items-center gap-1 transition"
                title="Preview which files match and diff destinations"
              >
                <Eye className="w-3 h-3 text-blue-400" />
                <span>Preview Matches</span>
              </button>

              <button
                id="btn-save-rule-builder"
                onClick={handleSaveCurrentRule}
                className="px-3.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Test results alert */}
          {ruleTestResult && (
            <div className="p-2.5 rounded bg-[#121c17] border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <span>{ruleTestResult}</span>
              <button onClick={() => setRuleTestResult(null)} className="p-1 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Configuration Row: Name, Priority, Tier, Safety Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] text-[#7a8397] font-medium">Rule Name</label>
              <input
                type="text"
                value={formRule.name}
                onChange={(e) => setFormRule({ ...formRule, name: e.target.value })}
                className="w-full bg-[#111216] border border-[#252732] rounded px-2.5 py-1.5 text-xs text-white font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[#7a8397] font-medium">Priority (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formRule.priority}
                onChange={(e) => setFormRule({ ...formRule, priority: parseInt(e.target.value) || 50 })}
                className="w-full bg-[#111216] border border-[#252732] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[#7a8397] font-medium">Rule Level (Tier)</label>
              <select
                value={formRule.tier}
                onChange={(e) => setFormRule({ ...formRule, tier: e.target.value as RuleTier })}
                className="w-full bg-[#111216] border border-[#252732] rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="BUILT-IN DEFAULT">BUILT-IN DEFAULT</option>
                <option value="YOUR RULE">YOUR RULE</option>
                <option value="TEMPORARY RULE">TEMPORARY RULE</option>
              </select>
            </div>
          </div>

          {/* WHEN Conditions Group */}
          <div className="space-y-2 p-3 rounded-lg bg-[#111216] border border-[#22242e]">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-[#1e2028]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-400 text-[11px] uppercase tracking-wider">
                  WHEN (Conditions)
                </span>
                <select
                  value={formRule.logic}
                  onChange={(e) => setFormRule({ ...formRule, logic: e.target.value as 'AND' | 'OR' })}
                  className="bg-[#181a22] border border-[#282a36] rounded px-2 py-0.5 text-white text-[10px] font-mono"
                >
                  <option value="OR">ANY condition (OR)</option>
                  <option value="AND">ALL conditions (AND)</option>
                </select>
              </div>
              <button
                onClick={handleAddCondition}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Condition</span>
              </button>
            </div>

            <div className="space-y-2">
              {formRule.conditions.map((cond, idx) => (
                <div key={cond.id} className="flex items-center gap-2 text-xs">
                  <select
                    value={cond.field}
                    onChange={(e) => {
                      const newConds = [...formRule.conditions];
                      newConds[idx].field = e.target.value as any;
                      setFormRule({ ...formRule, conditions: newConds });
                    }}
                    className="bg-[#181a22] border border-[#282a36] rounded px-2 py-1 text-white text-[11px] w-36"
                  >
                    <option value="filename">filename</option>
                    <option value="current_path">current path</option>
                    <option value="extension">extension</option>
                    <option value="document_text">document text</option>
                    <option value="organization">organization</option>
                    <option value="metadata">metadata</option>
                    <option value="file_size">file size</option>
                    <option value="date">date</option>
                  </select>

                  <select
                    value={cond.operator}
                    onChange={(e) => {
                      const newConds = [...formRule.conditions];
                      newConds[idx].operator = e.target.value as any;
                      setFormRule({ ...formRule, conditions: newConds });
                    }}
                    className="bg-[#181a22] border border-[#282a36] rounded px-2 py-1 text-white text-[11px] w-32"
                  >
                    <option value="contains">contains</option>
                    <option value="equals">equals</option>
                    <option value="starts_with">starts with</option>
                    <option value="ends_with">ends with</option>
                    <option value="regex">regex</option>
                    <option value="matches_any">matches any</option>
                    <option value="matches_all">matches all</option>
                  </select>

                  <input
                    type="text"
                    value={cond.value}
                    onChange={(e) => {
                      const newConds = [...formRule.conditions];
                      newConds[idx].value = e.target.value;
                      setFormRule({ ...formRule, conditions: newConds });
                    }}
                    placeholder="Search term or expression..."
                    className="flex-1 bg-[#181a22] border border-[#282a36] rounded px-2 py-1 text-white text-[11px] font-mono focus:border-blue-500 focus:outline-none"
                  />

                  {formRule.conditions.length > 1 && (
                    <button
                      onClick={() => handleRemoveCondition(cond.id)}
                      className="p-1 text-[#6d7588] hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* THEN Actions Group */}
          <div className="space-y-2.5 p-3 rounded-lg bg-[#111216] border border-[#22242e]">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-[#1e2028]">
              <span className="font-semibold text-emerald-400 text-[11px] uppercase tracking-wider">
                THEN (Actions & Taxonomy Destination)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Destination Taxonomy Mapping */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#8690a3] flex items-center justify-between">
                  <span>Destination (Taxonomy ID):</span>
                  <span className="font-mono text-[10px] text-blue-400">Stable ID</span>
                </label>
                <select
                  value={formRule.stableTaxonomyId || 'personal.government.jobcenter'}
                  onChange={(e) => {
                    const newTaxId = e.target.value;
                    const mappedPath = STABLE_TAXONOMY_MAPPINGS[newTaxId] || newTaxId;
                    setFormRule({
                      ...formRule,
                      stableTaxonomyId: newTaxId,
                      targetDisplayPath: mappedPath.replace('~/Documents/', '').replace(/\//g, ' / ')
                    });
                  }}
                  className="w-full bg-[#181a22] border border-[#282a36] rounded px-2.5 py-1.5 text-white font-mono text-xs"
                >
                  <option value="personal.government.jobcenter">personal.government.jobcenter (Jobcenter)</option>
                  <option value="personal.finance.tax">personal.finance.tax (Finance & Tax)</option>
                  <option value="personal.housing.herzogstrasse">personal.housing.herzogstrasse (Herzogstraße 90)</option>
                  <option value="projects.business.the_den">projects.business.the_den (THE DEN)</option>
                  <option value="projects.software.technoven">projects.software.technoven (TechnoVen)</option>
                  <option value="professional.employment.cosfair">professional.employment.cosfair (CosFair GmbH)</option>
                  <option value="professional.employment.amazon">professional.employment.amazon (Amazon)</option>
                  <option value="resource.books">resource.books (Books Library)</option>
                  <option value="archive.general">archive.general (04_Archive)</option>
                </select>
                <span className="text-[10px] text-[#6d7587] font-mono block">
                  Mapped to: {formRule.targetDisplayPath}
                </span>
              </div>

              {/* Rename Pattern */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#8690a3] flex items-center justify-between">
                  <span>Rename Pattern:</span>
                  <span className="font-mono text-[10px] text-emerald-400">Tokens Allowed</span>
                </label>
                <input
                  type="text"
                  value={formRule.renamePattern || '{date}_{type}_{name}.pdf'}
                  onChange={(e) => setFormRule({ ...formRule, renamePattern: e.target.value })}
                  placeholder="{date}_{org}_{type}_{desc}.pdf"
                  className="w-full bg-[#181a22] border border-[#282a36] rounded px-2.5 py-1.5 text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-[#6d7587] font-mono block">
                  Variables: {'{date}'}, {'{org}'}, {'{type}'}, {'{desc}'}
                </span>
              </div>
            </div>

            {/* SAFETY & REVIEW BEHAVIOR (Mandated 3 modes) */}
            <div className="pt-2 border-t border-[#1e2028] space-y-1.5">
              <label className="text-[11px] text-[#8690a3] font-medium block">
                Safety & Review Behavior
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormRule({ ...formRule, safety: 'suggest only', reviewBehavior: 'suggest only' })}
                  className={`p-2 rounded border text-left transition ${
                    formRule.safety === 'suggest only'
                      ? 'bg-blue-900/20 border-blue-500 text-white'
                      : 'bg-[#151720] border-[#252838] text-[#8892a7]'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">suggest only</div>
                  <div className="text-[10px] text-[#717a8e] mt-0.5">
                    Surfaces proposal without pre-checking approval boxes.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormRule({ ...formRule, safety: 'require approval', reviewBehavior: 'require approval' })}
                  className={`p-2 rounded border text-left transition ${
                    formRule.safety === 'require approval'
                      ? 'bg-blue-900/20 border-blue-500 text-white'
                      : 'bg-[#151720] border-[#252838] text-[#8892a7]'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">require approval</div>
                  <div className="text-[10px] text-[#717a8e] mt-0.5">
                    Pre-stages move; strictly holds execution until user approves.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormRule({ ...formRule, safety: 'trusted automatic rule', reviewBehavior: 'trusted automatic rule' })}
                  className={`p-2 rounded border text-left transition ${
                    formRule.safety === 'trusted automatic rule'
                      ? 'bg-emerald-900/20 border-emerald-500 text-white'
                      : 'bg-[#151720] border-[#252838] text-[#8892a7]'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">trusted automatic rule</div>
                  <div className="text-[10px] text-[#717a8e] mt-0.5">
                    Auto-approves during batch runs (still subject to Dry Run).
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW MATCHES MODAL (The critical user-requested feature) */}
      {isPreviewMatchesOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#15161c] border border-[#272938] rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222430]">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>Rule Match Preview: {formRule.name}</span>
                </h3>
                <p className="text-xs text-[#8790a3] mt-0.5">
                  Simulated impact across all currently indexed files.
                </p>
              </div>
              <button
                onClick={() => setIsPreviewMatchesOpen(false)}
                className="text-[#7d8699] hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* Summary Stat Banner */}
            <div className="p-3 rounded-lg bg-[#111216] border border-[#20222d] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#848d9f]">Current Matches:</span>{' '}
                <strong className="text-white font-mono">{formRule.matchCount || 137} files</strong>
              </div>
              <div>
                <span className="text-amber-400 font-semibold font-mono">8 files</span>{' '}
                <span className="text-[#848d9f]">would change destination under this rule</span>
              </div>
            </div>

            {/* Matched Files Diff List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {previewMatchedFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="p-2.5 rounded bg-[#101115] border border-[#1f212a] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-white text-xs truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    {file.willChangeDestination ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-mono">
                        Destination Differs
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1c1e27] text-[#8690a2] font-mono">
                        Unchanged
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-[#1c1e26]">
                    <div>
                      <span className="text-[#646c7f] block text-[10px]">Previous:</span>
                      <span className="text-[#8f98ab] truncate block">{file.previousDestination}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400/90 block text-[10px]">New:</span>
                      <span className="text-emerald-300 truncate block">{file.newDestination}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#20222d]">
              <button
                onClick={() => setIsPreviewMatchesOpen(false)}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

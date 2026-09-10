import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Landmark,
  Users,
  User,
  Plus,
  ArrowRight,
  Edit2,
  Tag,
  Check,
  FolderTree,
  Search
} from 'lucide-react';
import { OrganizationEntity, EntityCategory } from '../../types';

interface OrganizationsViewProps {
  organizations: OrganizationEntity[];
  onAddAlias: (orgId: string, newAlias: string) => void;
}

export const OrganizationsView: React.FC<OrganizationsViewProps> = ({
  organizations,
  onAddAlias
}) => {
  const [activeCategory, setActiveCategory] = useState<EntityCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newAliasInputs, setNewAliasInputs] = useState<Record<string, string>>({});

  const categories = [
    { id: 'all' as const, label: 'All Entities', icon: Building2, count: organizations.length },
    { id: 'businesses' as const, label: 'Businesses', icon: Building2, count: organizations.filter(o => o.category === 'businesses').length },
    { id: 'employment' as const, label: 'Employment', icon: Briefcase, count: organizations.filter(o => o.category === 'employment').length },
    { id: 'government' as const, label: 'Government', icon: Landmark, count: organizations.filter(o => o.category === 'government').length },
    { id: 'social' as const, label: 'Social / Community', icon: Users, count: organizations.filter(o => o.category === 'social').length },
    { id: 'people' as const, label: 'People', icon: User, count: 0 },
  ];

  const filteredOrgs = organizations.filter((org) => {
    if (activeCategory !== 'all' && org.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = org.name.toLowerCase().includes(q);
      const matchAlias = org.aliases.some(a => a.toLowerCase().includes(q));
      const matchFolder = org.targetFolder.toLowerCase().includes(q);
      return matchName || matchAlias || matchFolder;
    }
    return true;
  });

  const handleSaveAlias = (orgId: string) => {
    const alias = newAliasInputs[orgId]?.trim();
    if (!alias) return;
    onAddAlias(orgId, alias);
    setNewAliasInputs({ ...newAliasInputs, [orgId]: '' });
  };

  return (
    <div id="organizations-view" className="p-6 space-y-4 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#232530]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Known Organizations & Entities
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-mono">
              {organizations.length} verified entities
            </span>
          </div>
          <p className="text-xs text-[#7d869a] mt-0.5">
            Manage entity aliases, legal names, and their designated master folder targets in Documents.
          </p>
        </div>

        <button
          onClick={() => alert('New Entity modal: Enter company name, aliases and target directory.')}
          className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Entity</span>
        </button>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-[#222530] text-white border border-[#2d3142]'
                    : 'text-[#7e879b] hover:text-[#c4cbd8] hover:bg-[#191a22]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#131419] font-mono text-[#8c96ab]">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#646c7f]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter entities or aliases..."
            className="bg-[#14151a] border border-[#282a36] rounded-md pl-8 pr-3 py-1 text-xs text-white placeholder-[#5d6577] focus:outline-none focus:border-blue-500 w-60"
          />
        </div>
      </div>

      {/* Grid of Entity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredOrgs.map((org) => (
          <div
            key={org.id}
            id={`org-card-${org.id}`}
            className="p-4 rounded-lg bg-[#15161c] border border-[#252732] hover:border-blue-500/30 transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs text-white truncate" title={org.name}>
                    {org.name}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e212a] text-[#8e98ac] font-mono uppercase">
                    {org.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  {org.matchedFilesCount} files matched
                </span>
              </div>

              {/* Target Folder in Documents */}
              <div className="mt-2.5 p-2 rounded bg-[#111216] border border-[#21232d] text-[11px] font-mono text-blue-300 flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-[#62697b] shrink-0" />
                <span className="truncate" title={org.targetFolder}>
                  {org.targetFolder}
                </span>
              </div>

              {/* Aliases Tag Cloud */}
              <div className="mt-3 space-y-1">
                <div className="text-[10px] font-semibold text-[#6e778b] uppercase tracking-wider">
                  Known Aliases & Acronyms:
                </div>
                <div className="flex flex-wrap gap-1">
                  {org.aliases.map((alias) => (
                    <span
                      key={alias}
                      className="px-2 py-0.5 rounded bg-[#1d1f28] text-[10px] text-[#abb4c5] font-mono border border-[#292c3a]"
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Add Alias Input */}
            <div className="pt-2 border-t border-[#20222a] flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Add alias..."
                value={newAliasInputs[org.id] || ''}
                onChange={(e) =>
                  setNewAliasInputs({ ...newAliasInputs, [org.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveAlias(org.id);
                }}
                className="flex-1 bg-[#111216] border border-[#252733] rounded px-2 py-1 text-[11px] text-white placeholder-[#5a6273] focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleSaveAlias(org.id)}
                className="px-2 py-1 rounded bg-[#20222c] hover:bg-blue-600 hover:text-white text-[#8e98ac] text-[11px] font-medium transition"
                title="Add alias"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

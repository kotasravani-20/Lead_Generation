import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (ind: string) => void;
  selectedPriority: string;
  setSelectedPriority: (p: string) => void;
  minScore: number;
  setMinScore: (score: number) => void;
  industries: string[];
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedIndustry,
  setSelectedIndustry,
  selectedPriority,
  setSelectedPriority,
  minScore,
  setMinScore,
  industries,
}: FilterBarProps) {
  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 mb-6 shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
            <Search className="w-3.5 h-3.5" /> Search Leads
          </label>
          <input
            type="text"
            placeholder="Search company, industry, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Industry Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Industry
          </label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="All">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Tier Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Priority Tier
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="All">All Priorities</option>
            <option value="High Priority">High Priority (80-100)</option>
            <option value="Good Opportunity">Good Opportunity (60-79)</option>
            <option value="Review">Review (40-59)</option>
            <option value="Low Priority">Low Priority (0-39)</option>
          </select>
        </div>

        {/* Minimum Score Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Min Score
            </label>
            <span className="text-xs font-bold text-indigo-400">{minScore} pts</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}

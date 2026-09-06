import React from 'react';
import { Lead } from '../types/lead';

interface RankedTableProps {
  leads: Lead[];
  selectedLead: Lead | null;
  onSelectLead: (lead: Lead) => void;
}

export function RankedTable({ leads, selectedLead, onSelectLead }: RankedTableProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 text-center text-slate-400 my-4">
        No leads match your current filter criteria. Try adjusting the search query or minimum score slider.
      </div>
    );
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High Priority':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60';
      case 'Good Opportunity':
        return 'bg-sky-950/80 text-sky-400 border-sky-700/60';
      case 'Review':
        return 'bg-amber-950/80 text-amber-400 border-amber-700/60';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-700/80 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16 text-center">Rank</th>
              <th className="py-3.5 px-4">Company Name</th>
              <th className="py-3.5 px-4">Industry</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4 w-44">Opportunity Score</th>
              <th className="py-3.5 px-4">Priority Tier</th>
              <th className="py-3.5 px-4">Recommended Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {leads.map((lead) => {
              const isSelected = selectedLead?.company_name === lead.company_name;

              return (
                <tr
                  key={`${lead.company_name}-${lead.rank}`}
                  onClick={() => onSelectLead(lead)}
                  className={`cursor-pointer transition-colors hover:bg-slate-700/40 ${
                    isSelected ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-center text-slate-300">#{lead.rank}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {lead.company_name}
                    {lead.website && (
                      <span className="block text-xs font-normal text-slate-400 truncate max-w-xs">
                        {lead.website.replace('https://', '').replace('http://', '')}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{lead.industry || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-slate-300">{lead.location || 'N/A'}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white w-8">{lead.score}</span>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                        <div
                          className={`h-full rounded-full ${
                            lead.score >= 80
                              ? 'bg-emerald-400'
                              : lead.score >= 60
                              ? 'bg-sky-400'
                              : lead.score >= 40
                              ? 'bg-amber-400'
                              : 'bg-slate-500'
                          }`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getPriorityBadge(
                        lead.priority
                      )}`}
                    >
                      {lead.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">{lead.recommended_action}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

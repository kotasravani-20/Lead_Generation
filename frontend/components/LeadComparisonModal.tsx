import React, { useState } from 'react';
import { Lead } from '../types/lead';
import { Scale, X } from 'lucide-react';

interface LeadComparisonModalProps {
  leads: Lead[];
  isOpen: boolean;
  onClose: () => void;
}

export function LeadComparisonModal({ leads, isOpen, onClose }: LeadComparisonModalProps) {
  const [leadAIndex, setLeadAIndex] = useState(0);
  const [leadBIndex, setLeadBIndex] = useState(leads.length > 1 ? 1 : 0);

  if (!isOpen || leads.length === 0) return null;

  const l1 = leads[leadAIndex] || leads[0];
  const l2 = leads[leadBIndex] || leads[0];

  const rows = [
    { label: 'Rank', a: `#${l1.rank}`, b: `#${l2.rank}` },
    { label: 'Opportunity Score', a: `${l1.score}/100`, b: `${l2.score}/100` },
    { label: 'Priority Tier', a: l1.priority, b: l2.priority },
    { label: 'Recommended Action', a: l1.recommended_action, b: l2.recommended_action },
    { label: 'Industry', a: l1.industry || 'N/A', b: l2.industry || 'N/A' },
    { label: 'Employee Count', a: l1.employee_count?.toLocaleString() || 'N/A', b: l2.employee_count?.toLocaleString() || 'N/A' },
    { label: 'Decision Maker', a: l1.decision_maker_title || 'N/A', b: l2.decision_maker_title || 'N/A' },
    { label: 'Funding Stage', a: l1.funding_stage || 'N/A', b: l2.funding_stage || 'N/A' },
    { label: 'Technology Stack', a: l1.technology_stack || 'N/A', b: l2.technology_stack || 'N/A' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" /> Side-by-Side Lead Comparison
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Lead A</label>
            <select
              value={leadAIndex}
              onChange={(e) => setLeadAIndex(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {leads.map((l, idx) => (
                <option key={`${l.company_name}-${idx}`} value={idx}>
                  #{l.rank} - {l.company_name} ({l.score} pts)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Lead B</label>
            <select
              value={leadBIndex}
              onChange={(e) => setLeadBIndex(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {leads.map((l, idx) => (
                <option key={`${l.company_name}-${idx}`} value={idx}>
                  #{l.rank} - {l.company_name} ({l.score} pts)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-800">
                <th className="py-3 px-4 w-1/3">Attribute</th>
                <th className="py-3 px-4 w-1/3 text-indigo-400">{l1.company_name}</th>
                <th className="py-3 px-4 w-1/3 text-sky-400">{l2.company_name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-medium text-slate-400">{r.label}</td>
                  <td className="py-2.5 px-4 font-semibold text-white">{r.a}</td>
                  <td className="py-2.5 px-4 font-semibold text-white">{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

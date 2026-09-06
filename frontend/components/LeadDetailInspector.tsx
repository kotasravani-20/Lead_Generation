import React from 'react';
import { Lead, ScoringWeights } from '../types/lead';
import { Globe, Building2, MapPin, Users, DollarSign, User, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface LeadDetailInspectorProps {
  lead: Lead;
  weights: ScoringWeights;
}

export function LeadDetailInspector({ lead, weights }: LeadDetailInspectorProps) {
  if (!lead) return null;

  const components = [
    { label: 'Company Fit', val: lead.components?.company_fit ?? 0, max: weights.company_fit },
    { label: 'Growth Signal', val: lead.components?.growth_signal ?? 0, max: weights.growth_signal },
    { label: 'Funding Signal', val: lead.components?.funding_signal ?? 0, max: weights.funding_signal },
    { label: 'Revenue & Size Fit', val: lead.components?.revenue_size_fit ?? 0, max: weights.revenue_size_fit },
    { label: 'Decision Maker', val: lead.components?.decision_maker ?? 0, max: weights.decision_maker },
    { label: 'Technology Relevance', val: lead.components?.technology_relevance ?? 0, max: weights.technology_relevance },
    { label: 'Data Quality', val: lead.components?.data_quality ?? 0, max: weights.data_quality },
  ];

  const formattedRev = lead.estimated_revenue
    ? lead.estimated_revenue >= 1000000
      ? `$${(lead.estimated_revenue / 1000000).toFixed(1)}M`
      : `$${lead.estimated_revenue.toLocaleString()}`
    : 'N/A';

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {lead.company_name}
            {lead.website && (
              <a
                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-normal flex items-center gap-1"
              >
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{lead.company_description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Metadata & Score Badge */}
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Industry: <strong>{lead.industry || 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>Location: <strong>{lead.location || 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Employees: <strong>{lead.employee_count ? lead.employee_count.toLocaleString() : 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <DollarSign className="w-4 h-4 text-indigo-400" />
              <span>Revenue: <strong>{formattedRev}</strong></span>
            </div>
          </div>

          {(lead.decision_maker_title || lead.decision_maker_name) && (
            <div className="bg-slate-900/70 border border-slate-700/60 rounded-lg p-3.5 mb-6 text-sm flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Target Contact</p>
                <p className="text-white font-medium">
                  {lead.decision_maker_name ? `${lead.decision_maker_name} — ` : ''}
                  {lead.decision_maker_title}
                  {lead.email && <span className="text-indigo-300 ml-2">({lead.email})</span>}
                </p>
              </div>
            </div>
          )}

          {/* Opportunity Score Box */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-5 mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Opportunity Score</p>
              <p className="text-4xl font-extrabold text-sky-400 mt-1">
                {lead.score}<span className="text-lg text-slate-500 font-medium">/100</span>
              </p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700">
                {lead.priority}
              </span>
            </div>
          </div>

          {/* Action Recommendation Card */}
          <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-600/50 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">RECOMMENDED ACTION</p>
              <p className="text-lg font-bold text-white mt-0.5">{lead.recommended_action}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Score Breakdown & Signal Inspection */}
        <div>
          <h3 className="text-base font-bold text-white mb-3">Score Component Breakdown</h3>
          <div className="space-y-3 mb-6">
            {components.map((c) => {
              const pct = c.max > 0 ? Math.min(100, Math.max(0, (c.val / c.max) * 100)) : 0;
              return (
                <div key={c.label}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-300">{c.label}</span>
                    <span className="text-slate-400">
                      {c.val.toFixed(1)} / {c.max} pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="text-base font-bold text-white mb-2">Signals & Reasoning</h3>
          
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Positive Signals</p>
            {lead.positive_signals && lead.positive_signals.length > 0 ? (
              <ul className="space-y-1.5 text-xs font-medium text-emerald-300">
                {lead.positive_signals.map((sig, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">No strong positive signals detected</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Potential Concerns / Missing Data</p>
            {lead.negative_signals && lead.negative_signals.length > 0 ? (
              <ul className="space-y-1.5 text-xs font-medium text-amber-300">
                {lead.negative_signals.map((sig, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">No major data quality concerns</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

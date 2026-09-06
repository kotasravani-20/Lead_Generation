import React from 'react';
import { KPIs } from '../types/lead';
import { Users, TrendingUp, Award, UserCheck } from 'lucide-react';

interface KPICardsProps {
  kpis?: KPIs;
}

export function KPICards({ kpis }: KPICardsProps) {
  const total = kpis?.total_leads || 0;
  const high = kpis?.high_priority || 0;
  const avg = kpis?.avg_score || 0;
  const dms = kpis?.decision_makers || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leads</p>
          <p className="text-3xl font-extrabold text-sky-400 mt-1">{total}</p>
        </div>
        <div className="p-3 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
          <Users className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Priority</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{high}</p>
        </div>
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</p>
          <p className="text-3xl font-extrabold text-amber-400 mt-1">{avg.toFixed(1)}</p>
        </div>
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
          <Award className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Decision Makers</p>
          <p className="text-3xl font-extrabold text-indigo-400 mt-1">{dms}</p>
        </div>
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
          <UserCheck className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

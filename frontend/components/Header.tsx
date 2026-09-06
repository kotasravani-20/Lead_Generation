import React from 'react';
import { Target, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-800/50 rounded-xl p-6 mb-8 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-400">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                LeadLens <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">AI Prioritizer</span>
              </h1>
              <p className="text-indigo-200 text-sm mt-1">
                AI-Assisted Lead Qualification & Prioritization — Turn raw lead lists into an explainable priority queue.
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-lg text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Core Question: <strong>"Which leads should I contact first, and why?"</strong></span>
        </div>
      </div>
    </header>
  );
}

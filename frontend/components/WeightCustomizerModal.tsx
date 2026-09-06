import React, { useState } from 'react';
import { ScoringWeights } from '../types/lead';
import { Settings, X, RotateCcw } from 'lucide-react';

interface WeightCustomizerModalProps {
  weights: ScoringWeights;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newWeights: ScoringWeights) => void;
}

export function WeightCustomizerModal({
  weights,
  isOpen,
  onClose,
  onSave,
}: WeightCustomizerModalProps) {
  const [localWeights, setLocalWeights] = useState<ScoringWeights>(weights);

  if (!isOpen) return null;

  const handleChange = (key: keyof ScoringWeights, val: number) => {
    setLocalWeights((prev) => ({ ...prev, [key]: val }));
  };

  const totalSum = Object.values(localWeights).reduce((a, b) => a + b, 0);

  const handleReset = () => {
    const defaultWeights: ScoringWeights = {
      company_fit: 25,
      growth_signal: 20,
      funding_signal: 15,
      revenue_size_fit: 15,
      decision_maker: 10,
      technology_relevance: 10,
      data_quality: 5,
    };
    setLocalWeights(defaultWeights);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" /> Scoring Weight Customizer
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {[
            { key: 'company_fit', label: 'Company ICP Fit', max: 40 },
            { key: 'growth_signal', label: 'Growth Signal', max: 40 },
            { key: 'funding_signal', label: 'Funding Signal', max: 40 },
            { key: 'revenue_size_fit', label: 'Revenue & Size Fit', max: 40 },
            { key: 'decision_maker', label: 'Executive Decision Maker', max: 30 },
            { key: 'technology_relevance', label: 'Technology Relevance', max: 30 },
            { key: 'data_quality', label: 'Data Quality & Hygiene', max: 20 },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-indigo-400">{localWeights[item.key as keyof ScoringWeights]} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max={item.max}
                value={localWeights[item.key as keyof ScoringWeights]}
                onChange={(e) => handleChange(item.key as keyof ScoringWeights, Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="text-xs font-semibold">
            Total Weight Sum:{' '}
            <span className={totalSum === 100 ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
              {totalSum} pts
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={() => {
                onSave(localWeights);
                onClose();
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
            >
              Apply Weights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

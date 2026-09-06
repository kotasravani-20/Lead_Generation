import React, { useRef } from 'react';
import { Zap, Upload, Download, Settings, Scale } from 'lucide-react';

interface FileUploadControlsProps {
  onLoadDemo: () => void;
  onFileUpload: (file: File) => void;
  onExport: () => void;
  onOpenWeights: () => void;
  onOpenCompare: () => void;
  isLoading: boolean;
  dataSource?: string;
}

export function FileUploadControls({
  onLoadDemo,
  onFileUpload,
  onExport,
  onOpenWeights,
  onOpenCompare,
  isLoading,
  dataSource,
}: FileUploadControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 mb-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Load Demo Data Button */}
        <button
          onClick={onLoadDemo}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md transition-all disabled:opacity-50 text-sm"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Use Demo Data (60 Leads)</span>
        </button>

        {/* Upload CSV Hidden Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2.5 rounded-lg border border-slate-600 transition-all text-sm"
        >
          <Upload className="w-4 h-4 text-sky-400" />
          <span>Upload Custom CSV</span>
        </button>

        {/* Dynamic Weight Tuning Modal Trigger */}
        <button
          onClick={onOpenWeights}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium px-3.5 py-2.5 rounded-lg border border-slate-700 transition-all text-sm"
        >
          <Settings className="w-4 h-4 text-indigo-400" />
          <span>Scoring Weights</span>
        </button>

        {/* Lead Comparison Trigger */}
        <button
          onClick={onOpenCompare}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium px-3.5 py-2.5 rounded-lg border border-slate-700 transition-all text-sm"
        >
          <Scale className="w-4 h-4 text-sky-400" />
          <span>Compare Leads</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {dataSource && (
          <span className="text-xs text-slate-400 font-medium">
            Active: <strong className="text-slate-200">{dataSource}</strong>
          </span>
        )}

        {/* Export Prioritized CSV Button */}
        <button
          onClick={onExport}
          disabled={isLoading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md transition-all text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Prioritized CSV</span>
        </button>
      </div>
    </div>
  );
}

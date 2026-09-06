'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { KPICards } from '../components/KPICards';
import { FilterBar } from '../components/FilterBar';
import { RankedTable } from '../components/RankedTable';
import { LeadDetailInspector } from '../components/LeadDetailInspector';
import { FileUploadControls } from '../components/FileUploadControls';
import { WeightCustomizerModal } from '../components/WeightCustomizerModal';
import { LeadComparisonModal } from '../components/LeadComparisonModal';
import { Lead, APIResponse, ScoringWeights } from '../types/lead';
import { getDemoLeads, uploadCSV, recalculateScores, downloadExportCSV } from '../lib/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

const DEFAULT_WEIGHTS: ScoringWeights = {
  company_fit: 25,
  growth_signal: 20,
  funding_signal: 15,
  revenue_size_fit: 15,
  decision_maker: 10,
  technology_relevance: 10,
  data_quality: 5,
};

export default function Home() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [minScore, setMinScore] = useState<number>(0);

  // Modals State
  const [isWeightsOpen, setIsWeightsOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);

  // Load demo data on initial load
  useEffect(() => {
    handleLoadDemo();
  }, []);

  const handleLoadDemo = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getDemoLeads();
      setData(res);
      if (res.leads && res.leads.length > 0) {
        setSelectedLead(res.leads[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await uploadCSV(file);
      if (res.status === 'error') {
        setErrorMsg(res.message || 'CSV schema validation failed');
      } else {
        setData(res);
        if (res.leads && res.leads.length > 0) {
          setSelectedLead(res.leads[0]);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWeights = async (newWeights: ScoringWeights) => {
    setWeights(newWeights);
    if (!data?.leads || data.leads.length === 0) return;

    setIsLoading(true);
    try {
      const res = await recalculateScores(data.leads, newWeights);
      setData(res);
      if (res.leads && res.leads.length > 0) {
        setSelectedLead(res.leads[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to recalculate scores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!filteredLeads || filteredLeads.length === 0) return;
    try {
      const blob = await downloadExportCSV(filteredLeads);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leadlens_prioritized_leads.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMsg('Failed to download CSV export file');
    }
  };

  // Extract list of industries for dropdown
  const industries = useMemo(() => {
    if (!data?.leads) return [];
    const set = new Set<string>();
    data.leads.forEach((l) => {
      if (l.industry) set.add(l.industry);
    });
    return Array.from(set).sort();
  }, [data]);

  // Filter leads based on active user criteria
  const filteredLeads = useMemo(() => {
    if (!data?.leads) return [];
    return data.leads.filter((l) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = l.company_name?.toLowerCase().includes(q);
        const matchesInd = l.industry?.toLowerCase().includes(q);
        const matchesLoc = l.location?.toLowerCase().includes(q);
        if (!matchesName && !matchesInd && !matchesLoc) return false;
      }

      if (selectedIndustry !== 'All' && l.industry !== selectedIndustry) {
        return false;
      }

      if (selectedPriority !== 'All' && l.priority !== selectedPriority) {
        return false;
      }

      if (minScore > 0 && l.score < minScore) {
        return false;
      }

      return true;
    });
  }, [data, searchQuery, selectedIndustry, selectedPriority, minScore]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Header />

      {/* Control Toolbar */}
      <FileUploadControls
        onLoadDemo={handleLoadDemo}
        onFileUpload={handleFileUpload}
        onExport={handleExport}
        onOpenWeights={() => setIsWeightsOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        isLoading={isLoading}
        dataSource={data?.data_source}
      />

      {/* Error Message Banner */}
      {errorMsg && (
        <div className="bg-red-950/80 border border-red-800 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Duplicate / Warning Notifications */}
      {data?.validation?.duplicate_count && data.validation.duplicate_count > 0 ? (
        <div className="bg-amber-950/70 border border-amber-800 text-amber-200 px-4 py-2.5 rounded-xl mb-6 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>
            Notice: <strong>{data.validation.duplicate_count}</strong> duplicate lead record(s) were detected and flagged.
          </span>
        </div>
      ) : null}

      {/* KPI Cards */}
      <KPICards kpis={data?.kpis} />

      {/* Filter Toolbar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        minScore={minScore}
        setMinScore={setMinScore}
        industries={industries}
      />

      {/* Ranked Queue Table */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Ranked Opportunities Queue</h2>
        <span className="text-xs text-slate-400">
          Showing <strong>{filteredLeads.length}</strong> of <strong>{data?.leads?.length || 0}</strong> total leads
        </span>
      </div>

      <RankedTable
        leads={filteredLeads}
        selectedLead={selectedLead}
        onSelectLead={(lead) => setSelectedLead(lead)}
      />

      {/* Lead Detail Inspector */}
      {selectedLead && <LeadDetailInspector lead={selectedLead} weights={weights} />}

      {/* Modals */}
      <WeightCustomizerModal
        weights={weights}
        isOpen={isWeightsOpen}
        onClose={() => setIsWeightsOpen(false)}
        onSave={handleSaveWeights}
      />

      <LeadComparisonModal
        leads={data?.leads || []}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </main>
  );
}

export interface ScoreComponents {
  company_fit: number;
  growth_signal: number;
  funding_signal: number;
  revenue_size_fit: number;
  decision_maker: number;
  technology_relevance: number;
  data_quality: number;
}

export interface Lead {
  rank: number;
  company_name: string;
  industry: string;
  location: string;
  score: number;
  priority: 'High Priority' | 'Good Opportunity' | 'Review' | 'Low Priority';
  recommended_action: string;
  website?: string;
  employee_count?: number;
  estimated_revenue?: number;
  funding_stage?: string;
  funding_amount?: string;
  technology_stack?: string;
  growth_signal?: string;
  decision_maker_name?: string;
  decision_maker_title?: string;
  email?: string;
  linkedin_url?: string;
  company_description?: string;
  positive_signals: string[];
  negative_signals: string[];
  components: ScoreComponents;
}

export interface ValidationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missing_required: string[];
  missing_optional: string[];
  total_rows?: number;
  duplicate_count?: number;
}

export interface KPIs {
  total_leads: number;
  high_priority: number;
  avg_score: number;
  decision_makers: number;
}

export interface APIResponse {
  status: 'success' | 'error';
  message?: string;
  data_source?: string;
  validation?: ValidationReport;
  kpis?: KPIs;
  leads: Lead[];
}

export interface ScoringWeights {
  company_fit: number;
  growth_signal: number;
  funding_signal: number;
  revenue_size_fit: number;
  decision_maker: number;
  technology_relevance: number;
  data_quality: number;
}

import { APIResponse, ScoringWeights, Lead } from '../types/lead';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getDemoLeads(): Promise<APIResponse> {
  const response = await fetch(`${API_BASE_URL}/api/demo-leads`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ detail: 'Failed to load demo data' }));
    throw new Error(errData.detail || 'Failed to load demo data');
  }

  return response.json();
}

export async function uploadCSV(file: File): Promise<APIResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ detail: 'Failed to upload CSV file' }));
    throw new Error(errData.detail || 'Failed to upload CSV file');
  }

  return response.json();
}

export async function recalculateScores(leads: Lead[], weights: ScoringWeights): Promise<APIResponse> {
  const response = await fetch(`${API_BASE_URL}/api/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ leads, weights }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ detail: 'Failed to recalculate scores' }));
    throw new Error(errData.detail || 'Failed to recalculate scores');
  }

  return response.json();
}

export async function downloadExportCSV(leads: Lead[]): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ leads }),
  });

  if (!response.ok) {
    throw new Error('Failed to export CSV dataset');
  }

  return response.blob();
}

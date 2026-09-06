# PLAN.md — LeadLens Architecture & Implementation Plan

## 1. Migration Objective

Rebuild LeadLens frontend using **Next.js + Tailwind CSS** and backend using **FastAPI**, preserving existing Python scoring rules, signal extraction, numeric coercions, duplicate detection, and data loading pipeline.

```text
Raw Leads (CSV / Demo Data)
      ↓
FastAPI Backend (/api/upload, /api/demo-leads)
      ↓
Schema Validation & Ingestion
      ↓
Text Cleaning & Numeric Coercion ($2.5M, 1,000)
      ↓
Duplicate Detection
      ↓
Signal Extraction & Keyword NLP
      ↓
0–100 Scoring Engine & Explainability
      ↓
Lead Queue Ranking
      ↓
Next.js Frontend (React App Router + Tailwind CSS)
      ↓
Interactive Inspection / CSV Export
```

---

## 2. Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI 0.100+, Uvicorn, Python-Multipart, Pydantic v2.
- **Data Processing**: Pandas, NumPy.
- **Testing**: pytest, httpx.

---

## 3. Data Contracts & API Specs

### `GET /health`
- Response: `{"status": "ok", "app": "LeadLens FastAPI Backend"}`

### `GET /api/demo-leads`
- Returns pre-loaded 60-lead synthetic dataset scored and ranked.

### `POST /api/upload`
- Accepts multipart `file: UploadFile`.
- Validates schema, cleans text, coerces numbers, flags duplicates, scores, ranks, and returns structured JSON payload.

### `POST /api/score`
- Accepts lead dataset and custom weight overrides.
- Re-calculates scores dynamically.

### `POST /api/export`
- Generates downloadable CSV string formatted for outreach tools.

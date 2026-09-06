# TASK.md — LeadLens Migration Checklist

## Status Legend

- [ ] Not started
- [~] In progress
- [x] Complete

---

# Migration Tasks

## 1. Remove Streamlit

- [x] Delete `app.py`.
- [x] Remove Streamlit UI dependencies from backend.
- [x] Remove Streamlit session-state references.

## 2. Backend — FastAPI

- [x] Create `backend/` directory.
- [x] Create `backend/main.py` with FastAPI entry point.
- [x] Move python business logic to `backend/src/`.
- [x] Expose `GET /health` endpoint.
- [x] Expose `GET /api/demo-leads` endpoint.
- [x] Expose `POST /api/upload` endpoint.
- [x] Expose `POST /api/score` endpoint.
- [x] Expose `POST /api/export` endpoint.
- [x] Add CORS middleware for frontend (`http://localhost:3000`).
- [x] Create Pydantic response/request models.
- [x] Create `backend/tests/test_api.py` unit tests.

## 3. Frontend — Next.js + Tailwind CSS

- [x] Create `frontend/` directory.
- [x] Configure Next.js App Router, TypeScript, and Tailwind CSS.
- [x] Create `frontend/types/lead.ts` interfaces.
- [x] Create `frontend/lib/api.ts` API fetch client.
- [x] Build `Header.tsx` component.
- [x] Build `KPICards.tsx` component.
- [x] Build `FilterBar.tsx` component.
- [x] Build `RankedTable.tsx` component.
- [x] Build `LeadDetailInspector.tsx` component ("Why this lead?").
- [x] Build `LeadComparisonModal.tsx` side-by-side comparison modal.
- [x] Build `WeightCustomizerModal.tsx` weight adjustment modal.
- [x] Build `FileUploadControls.tsx` for demo data and CSV upload.
- [x] Build `frontend/app/page.tsx` main dashboard.

## 4. Documentation & Cleanup

- [x] Update `README.md` with Next.js + FastAPI architecture and setup guide.
- [x] Update `PLAN.md` API specification.
- [x] Update `TASK.md` migration checklist.
- [x] Verify backend tests pass cleanly (`pytest backend/tests`).

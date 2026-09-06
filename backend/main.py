"""
LeadLens FastAPI Backend Application
Exposes RESTful endpoints for CSV ingestion, schema validation, lead qualification scoring, ranking, and export.
"""

import os
import sys

# Ensure workspace root is in sys.path when running from backend directory
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from typing import Dict, Any, List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd

from backend.src.data_loader import load_csv, validate_schema
from backend.src.preprocessing import preprocess_leads
from backend.src.ranking import rank_leads
from backend.src.exporter import export_ranked_leads
from backend.src.config import DEFAULT_WEIGHTS

app = FastAPI(
    title="LeadLens API",
    description="AI-Assisted Lead Qualification & Prioritization API Engine",
    version="1.0.0",
)

# Enable CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScoringWeights(BaseModel):
    company_fit: float = 25.0
    growth_signal: float = 20.0
    funding_signal: float = 15.0
    revenue_size_fit: float = 15.0
    decision_maker: float = 10.0
    technology_relevance: float = 10.0
    data_quality: float = 5.0


class RecalculateRequest(BaseModel):
    leads: List[Dict[str, Any]]
    weights: Optional[ScoringWeights] = None


def build_pipeline_response(df: pd.DataFrame, val_res: Dict[str, Any], data_source: str) -> Dict[str, Any]:
    """Helper to convert Pandas DataFrame output into JSON API response structure."""
    records = df.to_dict(orient="records")

    # Format lists for API response
    formatted_leads = []
    for r in records:
        pos_str = str(r.get("positive_signals_str", ""))
        neg_str = str(r.get("negative_signals_str", ""))
        pos_list = [s.strip() for s in pos_str.split(" | ") if s.strip()] if pos_str != "nan" else []
        neg_list = [s.strip() for s in neg_str.split(" | ") if s.strip()] if neg_str != "nan" else []

        lead_dict = {
            "rank": int(r.get("rank", 0)),
            "company_name": str(r.get("company_name", "")),
            "industry": str(r.get("industry", "")),
            "location": str(r.get("location", "")),
            "score": int(r.get("score", 0)),
            "priority": str(r.get("priority", "")),
            "recommended_action": str(r.get("recommended_action", "")),
            "website": str(r.get("website", "")),
            "employee_count": float(r.get("employee_count_clean", 0.0)),
            "estimated_revenue": float(r.get("estimated_revenue_clean", 0.0)),
            "funding_stage": str(r.get("funding_stage", "")),
            "funding_amount": str(r.get("funding_amount", "")),
            "technology_stack": str(r.get("technology_stack", "")),
            "growth_signal": str(r.get("growth_signal", "")),
            "decision_maker_name": str(r.get("decision_maker_name", "")),
            "decision_maker_title": str(r.get("decision_maker_title", "")),
            "email": str(r.get("email", "")),
            "linkedin_url": str(r.get("linkedin_url", "")),
            "company_description": str(r.get("company_description", "")),
            "positive_signals": pos_list,
            "negative_signals": neg_list,
            "components": {
                "company_fit": float(r.get("company_fit_score", 0.0)),
                "growth_signal": float(r.get("growth_score", 0.0)),
                "funding_signal": float(r.get("funding_score", 0.0)),
                "revenue_size_fit": float(r.get("revenue_size_score", 0.0)),
                "decision_maker": float(r.get("decision_maker_score", 0.0)),
                "technology_relevance": float(r.get("technology_score", 0.0)),
                "data_quality": float(r.get("data_quality_score", 0.0)),
            },
        }
        formatted_leads.append(lead_dict)

    total_leads = len(formatted_leads)
    high_priority = len([l for l in formatted_leads if l["priority"] == "High Priority"])
    avg_score = round(sum(l["score"] for l in formatted_leads) / total_leads, 1) if total_leads > 0 else 0.0
    dm_count = len([l for l in formatted_leads if l["components"]["decision_maker"] > 0])

    return {
        "status": "success",
        "data_source": data_source,
        "validation": val_res,
        "kpis": {
            "total_leads": total_leads,
            "high_priority": high_priority,
            "avg_score": avg_score,
            "decision_makers": dm_count,
        },
        "leads": formatted_leads,
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "app": "LeadLens FastAPI Backend"}


@app.get("/api/demo-leads")
def get_demo_leads():
    """Endpoint to fetch and score the synthetic demo lead dataset."""
    demo_path = os.path.join(os.path.dirname(__file__), "..", "data", "demo_leads.csv")
    if not os.path.exists(demo_path):
        demo_path = os.path.join(os.path.dirname(__file__), "data", "demo_leads.csv")

    try:
        raw_df = load_csv(demo_path)
        val_res, prep_df = validate_schema(raw_df)
        proc_df, dup_count = preprocess_leads(prep_df)
        val_res["duplicate_count"] = dup_count
        scored_df = rank_leads(proc_df)

        return build_pipeline_response(scored_df, val_res, data_source="Synthetic Demo Dataset (60 Leads)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process demo dataset: {str(e)}")


@app.post("/api/upload")
async def upload_csv_leads(file: UploadFile = File(...)):
    """Endpoint to upload a custom CSV file and receive scored/ranked leads."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")

    try:
        contents = await file.read()
        raw_df = load_csv(contents)
        val_res, prep_df = validate_schema(raw_df)

        if not val_res["valid"]:
            return {
                "status": "error",
                "message": "CSV Schema Validation Failed",
                "validation": val_res,
                "leads": [],
            }

        proc_df, dup_count = preprocess_leads(prep_df)
        val_res["duplicate_count"] = dup_count
        scored_df = rank_leads(proc_df)

        return build_pipeline_response(scored_df, val_res, data_source=f"Uploaded CSV ({file.filename})")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")


@app.post("/api/score")
def recalculate_scores(req: RecalculateRequest):
    """Endpoint to re-score leads with custom weight overrides."""
    if not req.leads:
        raise HTTPException(status_code=400, detail="No leads provided for scoring.")

    custom_w = req.weights.dict() if req.weights else DEFAULT_WEIGHTS
    df = pd.DataFrame(req.leads)
    
    # Ensure cleaned columns exist
    df["employee_count_clean"] = df.get("employee_count", 0.0)
    df["estimated_revenue_clean"] = df.get("estimated_revenue", 0.0)
    df["funding_amount_clean"] = 0.0

    scored_df = rank_leads(df, custom_weights=custom_w)
    val_res = {"valid": True, "errors": [], "warnings": []}

    return build_pipeline_response(scored_df, val_res, data_source="Recalculated Scores")


@app.post("/api/export")
def export_leads_csv(req: RecalculateRequest):
    """Endpoint to generate downloadable CSV string from lead data."""
    if not req.leads:
        raise HTTPException(status_code=400, detail="No leads to export.")

    df = pd.DataFrame(req.leads)
    df["positive_signals_str"] = df["positive_signals"].apply(lambda x: " | ".join(x) if isinstance(x, list) else "")
    df["negative_signals_str"] = df["negative_signals"].apply(lambda x: " | ".join(x) if isinstance(x, list) else "")

    csv_content = export_ranked_leads(df)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leadlens_prioritized_leads.csv"},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


"""
Unit tests for FastAPI endpoints in LeadLens Backend.
"""

from fastapi.testclient import TestClient
import pytest
import io
from backend.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_get_demo_leads():
    response = client.get("/api/demo-leads")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["kpis"]["total_leads"] > 0
    assert len(data["leads"]) > 0
    assert "score" in data["leads"][0]
    assert "priority" in data["leads"][0]


def test_upload_csv_leads():
    csv_content = """company_name,industry,location,employee_count,estimated_revenue,decision_maker_title,company_description
ApexCloud,SaaS,"San Francisco, CA",250,$25M,CEO,Cloud infrastructure platform rapidly growing.
"""
    file = {"file": ("test.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    response = client.post("/api/upload", files=file)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["leads"]) == 1
    assert data["leads"][0]["company_name"] == "ApexCloud"
    assert data["leads"][0]["score"] > 0


def test_upload_invalid_csv_type():
    file = {"file": ("test.txt", io.BytesIO(b"hello world"), "text/plain")}
    response = client.post("/api/upload", files=file)
    assert response.status_code == 400

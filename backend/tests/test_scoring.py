"""
Unit tests for LeadLens scoring engine, priority mappings, and signal extraction in backend.
"""

import pandas as pd
import pytest
from backend.src.scoring import score_lead, get_priority


def test_priority_thresholds():
    assert get_priority(100) == "High Priority"
    assert get_priority(80) == "High Priority"
    assert get_priority(79) == "Good Opportunity"
    assert get_priority(60) == "Good Opportunity"
    assert get_priority(59) == "Review"
    assert get_priority(40) == "Review"
    assert get_priority(39) == "Low Priority"
    assert get_priority(0) == "Low Priority"


def test_score_lead_bounds_and_structure():
    row = pd.Series(
        {
            "company_name": "Apex Cloud Systems",
            "industry": "SaaS",
            "location": "San Francisco, CA",
            "employee_count_clean": 250,
            "estimated_revenue_clean": 25_000_000,
            "decision_maker_title": "Chief Executive Officer",
            "company_description": "Enterprise cloud platform rapidly hiring engineers and scaling following Series B funding.",
            "growth_signal": "Hiring 30+ engineers",
            "funding_stage": "Series B",
            "funding_amount_clean": 15_000_000,
            "technology_stack": "AWS, Python, React, Kubernetes",
            "email": "ceo@apexcloud.io",
            "website": "https://apexcloud.io",
        }
    )

    res = score_lead(row)
    assert 0 <= res["score"] <= 100
    assert res["priority"] in ["High Priority", "Good Opportunity", "Review", "Low Priority"]
    assert "company_fit" in res["components"]
    assert "growth_signal" in res["components"]
    assert len(res["positive_signals"]) > 0
    assert res["recommended_action"] in ["Contact first", "Review and contact", "Research further", "Deprioritize"]

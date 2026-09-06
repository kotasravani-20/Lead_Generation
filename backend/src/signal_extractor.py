"""
Signal extraction & lightweight NLP module for LeadLens Backend.
"""

from typing import Dict, Any
import pandas as pd
from backend.src.config import (
    DECISION_MAKER_TITLES,
    GROWTH_KEYWORDS,
    FUNDING_KEYWORDS,
    TARGET_TECHNOLOGIES,
    TARGET_ICP,
)


def extract_company_fit(row: pd.Series) -> Dict[str, Any]:
    max_score = 25.0
    score = 0.0
    positive_notes = []
    negative_notes = []

    industry = str(row.get("industry", "")).strip()
    location = str(row.get("location", "")).strip()

    preferred_industries = [ind.lower() for ind in TARGET_ICP["preferred_industries"]]
    if industry:
        if any(pref in industry.lower() for pref in preferred_industries):
            score += 15.0
            positive_notes.append(f"Industry '{industry}' matches target ICP profile")
        else:
            score += 7.0
            positive_notes.append(f"Industry '{industry}' is an acceptable market segment")
    else:
        negative_notes.append("Industry information is missing")

    if location:
        score += 5.0
        positive_notes.append(f"Clear location identified: {location}")
    else:
        negative_notes.append("Location information missing")

    desc = str(row.get("company_description", "")).strip()
    if desc:
        score += 5.0
    else:
        negative_notes.append("Company description is blank")

    return {
        "score": min(score, max_score),
        "max_score": max_score,
        "signal": "company_fit",
        "reason": f"Company fit evaluated at {score:.0f}/{max_score:.0f} pts",
        "positive_notes": positive_notes,
        "negative_notes": negative_notes,
    }


def extract_growth_signal(row: pd.Series) -> Dict[str, Any]:
    max_score = 20.0
    score = 0.0
    positive_notes = []
    negative_notes = []

    growth_text = str(row.get("growth_signal", "")).strip().lower()
    desc_text = str(row.get("company_description", "")).strip().lower()
    combined_text = f"{growth_text} {desc_text}"

    detected_keywords = [kw for kw in GROWTH_KEYWORDS if kw in combined_text]

    if growth_text:
        score += 10.0
        positive_notes.append(f"Explicit growth indicator: '{row.get('growth_signal')}'")

    if detected_keywords:
        score += 10.0
        kw_str = ", ".join(detected_keywords[:3])
        positive_notes.append(f"Growth keywords detected: {kw_str}")
    elif not growth_text:
        negative_notes.append("No active growth or hiring signals detected")

    return {
        "score": min(score, max_score),
        "max_score": max_score,
        "signal": "growth_signal",
        "reason": "Growth signal detected" if score > 0 else "No growth signal detected",
        "positive_notes": positive_notes,
        "negative_notes": negative_notes,
    }


def extract_funding_signal(row: pd.Series) -> Dict[str, Any]:
    max_score = 15.0
    score = 0.0
    positive_notes = []
    negative_notes = []

    stage = str(row.get("funding_stage", "")).strip()
    amount_clean = float(row.get("funding_amount_clean", 0.0))
    desc_text = str(row.get("company_description", "")).strip().lower()

    if stage and stage.lower() not in ["bootstrapped", "none", "n/a", "0"]:
        score += 8.0
        positive_notes.append(f"Funding stage: {stage}")

    if amount_clean > 0:
        score += 7.0
        formatted_amt = f"${amount_clean/1_000_000:.1f}M" if amount_clean >= 1_000_000 else f"${amount_clean:,.0f}"
        positive_notes.append(f"Disclosed funding amount: {formatted_amt}")

    funding_kws = [kw for kw in FUNDING_KEYWORDS if kw in desc_text]
    if funding_kws and score == 0:
        score += 6.0
        positive_notes.append(f"Funding mention in description: {', '.join(funding_kws[:2])}")

    if score == 0:
        negative_notes.append("No institutional funding or capital raise data available")

    return {
        "score": min(score, max_score),
        "max_score": max_score,
        "signal": "funding_signal",
        "reason": "Funding data available" if score > 0 else "No funding data",
        "positive_notes": positive_notes,
        "negative_notes": negative_notes,
    }


def extract_revenue_size_fit(row: pd.Series) -> Dict[str, Any]:
    max_score = 15.0
    score = 0.0
    positive_notes = []
    negative_notes = []

    emp_count = float(row.get("employee_count_clean", 0.0))
    revenue = float(row.get("estimated_revenue_clean", 0.0))

    if emp_count > 0:
        min_emp = TARGET_ICP["target_employee_min"]
        max_emp = TARGET_ICP["target_employee_max"]
        if min_emp <= emp_count <= max_emp:
            score += 8.0
            positive_notes.append(f"Optimal team size: {int(emp_count)} employees")
        elif emp_count > max_emp:
            score += 5.0
            positive_notes.append(f"Large enterprise company: {int(emp_count)} employees")
        else:
            score += 3.0
            positive_notes.append(f"Early stage team size: {int(emp_count)} employees")
    else:
        negative_notes.append("Employee count unavailable")

    if revenue > 0:
        score += 7.0
        formatted_rev = f"${revenue/1_000_000:.1f}M" if revenue >= 1_000_000 else f"${revenue:,.0f}"
        positive_notes.append(f"Estimated revenue: {formatted_rev}")
    else:
        negative_notes.append("Estimated revenue unavailable")

    return {
        "score": min(score, max_score),
        "max_score": max_score,
        "signal": "revenue_size_fit",
        "reason": f"Company size fit score: {score:.0f}/{max_score:.0f}",
        "positive_notes": positive_notes,
        "negative_notes": negative_notes,
    }


def extract_decision_maker_signal(row: pd.Series) -> Dict[str, Any]:
    max_score = 10.0
    score = 0.0
    positive_notes = []
    negative_notes = []

    title = str(row.get("decision_maker_title", "")).strip()
    name = str(row.get("decision_maker_name", "")).strip()
    email = str(row.get("email", "")).strip()

    title_lower = title.lower()
    matched_title = any(dm in title_lower for dm in DECISION_MAKER_TITLES)

    if title and matched_title:
        score += 7.0
        positive_notes.append(f"Executive decision-maker title identified: '{title}'")
    elif title:
        score += 4.0
        positive_notes.append(f"Contact title present: '{title}'")
    else:
        negative_notes.append("No decision-maker title provided")

    if name or email:
        score += 3.0
        if name:
            positive_notes.append(f"Contact name: {name}")
        if email:
            positive_notes.append(f"Contact email provided: {email}")

    return {
        "score": min(score, max_score),
        "max_score": max_score,
        "signal": "decision_maker",
        "reason": "Decision-maker present" if score > 0 else "Missing decision-maker",
        "positive_notes": positive_notes,
        "negative_notes": negative_notes,
    }


def extract_technology_signal(row: pd.Series) -> Dict[str, Any]:
    max_score = 10.0
    score = 0.0
    positive_notes = []
    negative_notes = []

    tech_stack = str(row.get("technology_stack", "")).strip().lower()
    desc_text = str(row.get("company_description", "")).strip().lower()
    combined_tech = f"{tech_stack} {desc_text}"

    detected_tech = [tech for tech in TARGET_TECHNOLOGIES if tech in combined_tech]

    if detected_tech:
        points = min(10.0, 4.0 + (len(detected_tech) * 2.0))
        score += points
        tech_list_str = ", ".join([t.upper() if len(t) <= 4 else t.title() for t in detected_tech[:5]])
        positive_notes.append(f"Relevant tech stack detected: {tech_list_str}")
    else:
        negative_notes.append("Technology stack information unavailable or non-matching")

    return {
        "score": min(score, max_score),
        "max_score": max_score,
        "signal": "technology_relevance",
        "reason": "Target tech detected" if score > 0 else "No target tech",
        "positive_notes": positive_notes,
        "negative_notes": negative_notes,
    }


def extract_data_quality(row: pd.Series) -> Dict[str, Any]:
    max_score = 5.0
    score = 0.0
    positive_notes = []
    negative_notes = []

    fields_to_check = [
        ("company_name", 1.0, "Company name"),
        ("website", 1.0, "Website URL"),
        ("email", 1.0, "Contact email"),
        ("decision_maker_title", 1.0, "Decision maker title"),
        ("company_description", 1.0, "Company description"),
    ]

    for field, pts, label in fields_to_check:
        val = str(row.get(field, "")).strip()
        if val and val.lower() not in ["nan", "none", "null"]:
            score += pts
        else:
            negative_notes.append(f"Missing {label.lower()}")

    if score >= 4.0:
        positive_notes.append("High data quality & field completeness")

    return {
        "score": min(score, max_score),
        "max_score": max_score,
        "signal": "data_quality",
        "reason": f"Data quality score: {score:.0f}/{max_score:.0f}",
        "positive_notes": positive_notes,
        "negative_notes": negative_notes,
    }

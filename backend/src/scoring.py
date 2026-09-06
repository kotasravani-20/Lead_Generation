"""
Core explainable scoring engine for LeadLens Backend.
"""

from typing import Dict, Any, Optional
import pandas as pd
from backend.src.config import DEFAULT_WEIGHTS, PRIORITY_THRESHOLDS, ACTION_POLICY
from backend.src.signal_extractor import (
    extract_company_fit,
    extract_growth_signal,
    extract_funding_signal,
    extract_revenue_size_fit,
    extract_decision_maker_signal,
    extract_technology_signal,
    extract_data_quality,
)


def get_priority(score: int) -> str:
    clamped_score = max(0, min(100, int(score)))
    for threshold, priority in PRIORITY_THRESHOLDS:
        if clamped_score >= threshold:
            return priority
    return "Low Priority"


def get_recommended_action(priority: str) -> str:
    return ACTION_POLICY.get(priority, "Research further")


def score_lead(row: pd.Series, custom_weights: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    weights = custom_weights if custom_weights is not None else DEFAULT_WEIGHTS

    signals = {
        "company_fit": extract_company_fit(row),
        "growth_signal": extract_growth_signal(row),
        "funding_signal": extract_funding_signal(row),
        "revenue_size_fit": extract_revenue_size_fit(row),
        "decision_maker": extract_decision_maker_signal(row),
        "technology_relevance": extract_technology_signal(row),
        "data_quality": extract_data_quality(row),
    }

    components = {}
    positive_signals = []
    negative_signals = []
    total_raw_score = 0.0

    for key, signal_res in signals.items():
        max_possible = signal_res["max_score"]
        actual_raw = signal_res["score"]
        weight = weights.get(key, DEFAULT_WEIGHTS.get(key, 0.0))

        if max_possible > 0:
            weighted_score = (actual_raw / max_possible) * weight
        else:
            weighted_score = 0.0

        rounded_comp = round(weighted_score, 1)
        components[key] = rounded_comp
        total_raw_score += weighted_score

        positive_signals.extend(signal_res.get("positive_notes", []))
        negative_signals.extend(signal_res.get("negative_notes", []))

    final_score = int(round(max(0.0, min(100.0, total_raw_score))))
    priority = get_priority(final_score)
    recommended_action = get_recommended_action(priority)

    unique_positive = list(dict.fromkeys(positive_signals))
    unique_negative = list(dict.fromkeys(negative_signals))

    return {
        "score": final_score,
        "priority": priority,
        "components": components,
        "positive_signals": unique_positive,
        "negative_signals": unique_negative,
        "recommended_action": recommended_action,
    }

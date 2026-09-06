"""
Lead ranking and prioritization queue module for LeadLens Backend.
"""

from typing import Dict, Any, Optional
import pandas as pd
from backend.src.scoring import score_lead


def rank_leads(df: pd.DataFrame, custom_weights: Optional[Dict[str, float]] = None) -> pd.DataFrame:
    df_copy = df.copy()

    scores = []
    priorities = []
    actions = []
    pos_signals_list = []
    neg_signals_list = []
    comp_fit_scores = []
    growth_scores = []
    funding_scores = []
    revenue_size_scores = []
    dm_scores = []
    tech_scores = []
    dq_scores = []

    for _, row in df_copy.iterrows():
        res = score_lead(row, custom_weights=custom_weights)
        scores.append(res["score"])
        priorities.append(res["priority"])
        actions.append(res["recommended_action"])
        pos_signals_list.append(" | ".join(res["positive_signals"]))
        neg_signals_list.append(" | ".join(res["negative_signals"]))

        comps = res["components"]
        comp_fit_scores.append(comps.get("company_fit", 0))
        growth_scores.append(comps.get("growth_signal", 0))
        funding_scores.append(comps.get("funding_signal", 0))
        revenue_size_scores.append(comps.get("revenue_size_fit", 0))
        dm_scores.append(comps.get("decision_maker", 0))
        tech_scores.append(comps.get("technology_relevance", 0))
        dq_scores.append(comps.get("data_quality", 0))

    df_copy["score"] = scores
    df_copy["priority"] = priorities
    df_copy["recommended_action"] = actions
    df_copy["positive_signals_str"] = pos_signals_list
    df_copy["negative_signals_str"] = neg_signals_list
    df_copy["company_fit_score"] = comp_fit_scores
    df_copy["growth_score"] = growth_scores
    df_copy["funding_score"] = funding_scores
    df_copy["revenue_size_score"] = revenue_size_scores
    df_copy["decision_maker_score"] = dm_scores
    df_copy["technology_score"] = tech_scores
    df_copy["data_quality_score"] = dq_scores

    df_copy.sort_values(
        by=["score", "data_quality_score", "company_name"],
        ascending=[False, False, True],
        inplace=True,
    )
    df_copy.reset_index(drop=True, inplace=True)
    df_copy.insert(0, "rank", range(1, len(df_copy) + 1))

    return df_copy

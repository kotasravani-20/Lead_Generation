"""
CSV exporter module for LeadLens Backend.
"""

import pandas as pd


def export_ranked_leads(df: pd.DataFrame) -> str:
    df_copy = df.copy()

    desired_columns = [
        "rank",
        "company_name",
        "industry",
        "location",
        "score",
        "priority",
        "recommended_action",
        "decision_maker_name",
        "decision_maker_title",
        "email",
        "linkedin_url",
        "website",
        "employee_count",
        "estimated_revenue",
        "funding_stage",
        "funding_amount",
        "technology_stack",
        "growth_signal",
        "positive_signals_str",
        "negative_signals_str",
    ]

    export_cols = [c for c in desired_columns if c in df_copy.columns]
    export_df = df_copy[export_cols].copy()

    export_df.rename(
        columns={
            "positive_signals_str": "positive_signals",
            "negative_signals_str": "potential_concerns",
        },
        inplace=True,
    )

    return export_df.to_csv(index=False)

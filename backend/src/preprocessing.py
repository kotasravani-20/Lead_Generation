"""
Data preprocessing, cleaning, numeric coercions, and duplicate detection for LeadLens Backend.
"""

import re
from typing import Tuple, Any
import pandas as pd
import numpy as np


def parse_numeric_string(val: Any) -> float:
    """
    Safely converts strings like '$2.5M', '15 million', '1,500', '50 employees' into numbers.
    """
    if pd.isna(val) or val is None:
        return 0.0

    if isinstance(val, (int, float)):
        return float(val) if not np.isnan(val) else 0.0

    s = str(val).strip().lower()
    if not s or s == "nan" or s == "null" or s == "none":
        return 0.0

    s_clean = s.replace(",", "")
    pattern = r"(\d+(?:\.\d+)?)\s*(billion|million|thousand|b|m|k)?"
    match = re.search(pattern, s_clean)

    if match:
        try:
            base_val = float(match.group(1))
            suffix = match.group(2)
            multiplier = 1.0
            if suffix:
                if suffix in ["b", "billion"]:
                    multiplier = 1_000_000_000.0
                elif suffix in ["m", "million"]:
                    multiplier = 1_000_000.0
                elif suffix in ["k", "thousand"]:
                    multiplier = 1_000.0
            return base_val * multiplier
        except ValueError:
            return 0.0

    return 0.0


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df_copy = df.copy()
    df_copy.columns = [str(col).strip().lower().replace(" ", "_") for col in df_copy.columns]
    return df_copy


def clean_text_fields(df: pd.DataFrame) -> pd.DataFrame:
    df_copy = df.copy()
    text_cols = df_copy.select_dtypes(include=["object"]).columns

    for col in text_cols:
        df_copy[col] = df_copy[col].apply(
            lambda x: x.strip() if isinstance(x, str) and x.strip() not in ["", "nan", "NaN", "None", "null"] else ""
        )

    return df_copy


def coerce_numeric_fields(df: pd.DataFrame) -> pd.DataFrame:
    df_copy = df.copy()
    numeric_targets = ["employee_count", "estimated_revenue", "funding_amount"]
    for col in numeric_targets:
        if col in df_copy.columns:
            clean_col_name = f"{col}_clean"
            df_copy[clean_col_name] = df_copy[col].apply(parse_numeric_string)

    return df_copy


def detect_duplicates(df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
    df_copy = df.copy()
    clean_company = df_copy["company_name"].astype(str).str.strip().str.lower()
    is_dup = clean_company.duplicated(keep="first") & (clean_company != "")
    df_copy["is_duplicate"] = is_dup
    duplicate_count = int(is_dup.sum())
    return df_copy, duplicate_count


def preprocess_leads(df: pd.DataFrame) -> Tuple[pd.DataFrame, int]:
    df_norm = normalize_columns(df)
    df_clean = clean_text_fields(df_norm)
    df_num = coerce_numeric_fields(df_clean)
    df_final, dup_count = detect_duplicates(df_num)
    return df_final, dup_count

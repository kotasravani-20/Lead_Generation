"""
Unit tests for data validation, preprocessing, numeric coercion, and duplicate detection.
"""

import pandas as pd
import pytest
from backend.src.data_loader import validate_schema
from backend.src.preprocessing import (
    parse_numeric_string,
    normalize_columns,
    clean_text_fields,
    coerce_numeric_fields,
    detect_duplicates,
)


def test_normalize_columns():
    df = pd.DataFrame(columns=["Company Name", "Industry ", "Employee Count"])
    normalized = normalize_columns(df)
    assert list(normalized.columns) == ["company_name", "industry", "employee_count"]


def test_parse_numeric_string():
    assert parse_numeric_string("$2.5M") == 2_500_000.0
    assert parse_numeric_string("15 million") == 15_000_000.0
    assert parse_numeric_string("1,000") == 1_000.0
    assert parse_numeric_string("50 employees") == 50.0
    assert parse_numeric_string("$0") == 0.0
    assert parse_numeric_string(None) == 0.0
    assert parse_numeric_string("invalid string") == 0.0


def test_coerce_numeric_fields():
    df = pd.DataFrame(
        {
            "employee_count": ["250", "$2.5M", "1,500"],
            "estimated_revenue": ["$25M", "10 million", None],
        }
    )
    result = coerce_numeric_fields(df)
    assert result["employee_count_clean"].tolist() == [250.0, 2_500_000.0, 1_500.0]
    assert result["estimated_revenue_clean"].tolist() == [25_000_000.0, 10_000_000.0, 0.0]


def test_clean_text_fields():
    df = pd.DataFrame(
        {
            "company_name": ["  Apex Cloud  ", "  ", None, "nan"],
        }
    )
    cleaned = clean_text_fields(df)
    assert cleaned["company_name"].tolist() == ["Apex Cloud", "", "", ""]


def test_validate_schema_missing_required():
    df = pd.DataFrame(columns=["company_name", "industry"])
    val_res, _ = validate_schema(df)
    assert val_res["valid"] is False
    assert len(val_res["missing_required"]) > 0


def test_validate_schema_valid_with_optional_defaults():
    df = pd.DataFrame(
        columns=[
            "company_name",
            "industry",
            "location",
            "employee_count",
            "estimated_revenue",
            "decision_maker_title",
            "company_description",
        ]
    )
    val_res, prepared_df = validate_schema(df)
    assert val_res["valid"] is True
    assert "website" in prepared_df.columns
    assert "email" in prepared_df.columns


def test_detect_duplicates():
    df = pd.DataFrame(
        {
            "company_name": ["Apex", "Apex", "Beta Cloud", "Gamma"],
        }
    )
    res_df, dup_count = detect_duplicates(df)
    assert dup_count == 1
    assert res_df["is_duplicate"].tolist() == [False, True, False, False]

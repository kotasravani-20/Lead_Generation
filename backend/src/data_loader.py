"""
Data loader and schema validator for LeadLens Backend.
"""

from typing import Union, Dict, Any, Tuple
import pandas as pd
import io
from backend.src.config import REQUIRED_COLUMNS, OPTIONAL_COLUMNS


def load_csv(file_input: Union[str, io.BytesIO, io.StringIO, bytes]) -> pd.DataFrame:
    """
    Safely load CSV data from file path, bytes, or stream.
    """
    if file_input is None:
        raise ValueError("No file or input data provided.")

    try:
        if isinstance(file_input, bytes):
            file_input = io.BytesIO(file_input)
        df = pd.read_csv(file_input)
    except pd.errors.EmptyDataError:
        raise ValueError("The provided CSV file is completely empty.")
    except Exception as e:
        raise ValueError(f"Failed to parse CSV file: {str(e)}")

    if df.empty:
        raise ValueError("The uploaded CSV contains no data rows.")

    return df


def validate_schema(df: pd.DataFrame) -> Tuple[Dict[str, Any], pd.DataFrame]:
    """
    Validates DataFrame against required and optional schemas.
    """
    df_copy = df.copy()

    normalized_cols = {col: str(col).strip().lower().replace(" ", "_") for col in df_copy.columns}
    df_copy.rename(columns=normalized_cols, inplace=True)

    present_cols = set(df_copy.columns)
    missing_required = [col for col in REQUIRED_COLUMNS if col not in present_cols]
    missing_optional = [col for col in OPTIONAL_COLUMNS if col not in present_cols]

    errors = []
    warnings = []

    if missing_required:
        errors.append(f"Missing required column(s): {', '.join(missing_required)}")

    if missing_optional:
        warnings.append(f"Missing optional column(s): {', '.join(missing_optional)}. Defaults will be used.")
        for opt_col in missing_optional:
            df_copy[opt_col] = ""

    is_valid = len(missing_required) == 0

    validation_result = {
        "valid": is_valid,
        "errors": errors,
        "warnings": warnings,
        "missing_required": missing_required,
        "missing_optional": missing_optional,
        "total_rows": len(df_copy),
    }

    return validation_result, df_copy

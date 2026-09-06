"""
Vercel Serverless Function entrypoint for FastAPI backend.
"""
import sys
import os

# Add workspace root directory to sys.path
root_dir = os.path.dirname(os.path.dirname(__file__))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.main import app

"""
embedding.py
------------
Singleton loader for the SentenceTransformer model.
Import get_model() anywhere — the model is only loaded once per process.
"""
from __future__ import annotations
from sentence_transformers import SentenceTransformer

_model: SentenceTransformer | None = None
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model

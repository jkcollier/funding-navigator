"""
matcher.py
----------
Computes cosine similarity between the application vector and every
pre-computed foundation vector that passed Layer 1.

Thresholds:
    High   >= 0.75
    Medium >= 0.50
    Low     < 0.50

Results are ranked by score (descending) and bulk-inserted into
the foundation_matches table.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .application_session import ApplicationSessionBuilder
    from .models import ApplicationSession

THRESHOLD_HIGH: float = 0.75
THRESHOLD_MEDIUM: float = 0.50


# ---------------------------------------------------------------------------
# Value object returned to the caller / serializer
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class MatchResult:
    org_id: int
    org_name: str
    similarity_score: float
    match_level: str  # "high" | "medium" | "low"


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _cosine_similarity(a: list[float], b: list[float]) -> float:
    if len(a) != len(b):
        raise ValueError(
            f"Vector dimension mismatch: {len(a)} vs {len(b)}"
        )
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot / (norm_a * norm_b)


def _assign_level(score: float) -> str:
    if score >= THRESHOLD_HIGH:
        return "high"
    if score >= THRESHOLD_MEDIUM:
        return "medium"
    return "low"


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def run(
    builder: "ApplicationSessionBuilder",
    application: "ApplicationSession",
) -> list[MatchResult]:
    """Score all Layer-1-passing foundations and persist the results.

    Args:
        builder:     Must have application_vector and layer1_passed_org_ids set.
        application: The already-saved ApplicationSession DB row.

    Returns:
        List of MatchResult sorted by similarity_score descending.
    """
    from .models import FoundationMatch, FoundationVector

    if not builder.application_vector:
        raise ValueError("application_vector is not set — run layer2 first.")

    if not builder.layer1_passed_org_ids:
        return []

    app_vec = builder.application_vector
    passed_ids = set(builder.layer1_passed_org_ids)

    foundation_vectors = (
        FoundationVector.objects
        .filter(org_id__in=passed_ids)
        .select_related("org")
    )

    results: list[MatchResult] = []
    for fv in foundation_vectors:
        score = _cosine_similarity(app_vec, fv.vector)
        results.append(MatchResult(
            org_id=fv.org_id,
            org_name=fv.org.name,
            similarity_score=round(score, 6),
            match_level=_assign_level(score),
        ))

    results.sort(key=lambda r: r.similarity_score, reverse=True)

    FoundationMatch.objects.bulk_create(
        [
            FoundationMatch(
                application=application,
                org_id=r.org_id,
                similarity_score=r.similarity_score,
                match_level=r.match_level,
            )
            for r in results
        ],
        ignore_conflicts=True,  # safe on re-submit with same session_id
    )

    return results

"""
layer2.py
---------
Vectorization layer.

embed() is the single integration point.
Pre-compute foundation vectors with: python manage.py precompute_vectors
"""
from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .application_session import ApplicationSessionBuilder


def embed(text: str) -> list[float]:
    from .embedding import get_model
    model = get_model()
    return model.encode([text])[0].tolist()


def run(builder: "ApplicationSessionBuilder") -> list[float]:
    """Embed the applicant's text and store the result on the builder."""
    text = builder.to_text_for_vectorization()
    if not text.strip():
        raise ValueError("No text available for vectorization.")
    vector = embed(text)
    builder.application_vector = vector
    return vector


def precompute_foundation_vectors(org_ids: list[int] | None = None) -> int:
    """Embed and persist vectors for all (or selected) organisations.
    Run once offline: python manage.py precompute_vectors
    """
    from .models import FoundationVector, Organization

    queryset = Organization.objects.all()
    if org_ids is not None:
        queryset = queryset.filter(pk__in=org_ids)

    count = 0
    for org in queryset.iterator():
        parts = [p for p in [org.description, org.target_group_raw, org.applicants_raw] if p]
        text = " ".join(parts).strip()
        if not text:
            continue
        vector = embed(text)
        FoundationVector.objects.update_or_create(
            org=org,
            defaults={"vector": vector},
        )
        count += 1

    return count

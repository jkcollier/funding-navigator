"""
layer2.py
---------
Vectorization layer.

embed() is the single integration point — swap in any embedding model here.
Everything else in this module calls embed() and should not need to change.

Pre-computing foundation vectors:
    Run the management command (once, and after adding new organisations):
        python manage.py precompute_vectors

    Or call precompute_foundation_vectors() directly in a shell / task.
"""

from __future__ import annotations
from typing import TYPE_CHECKING
from sentence_transformers import SentenceTransformer
import numpy as np
import json

if TYPE_CHECKING:
    from .application_session import ApplicationSessionBuilder


# ---------------------------------------------------------------------------
# Embedding stub — replace this body with your model call
# ---------------------------------------------------------------------------

# sentence transformers - combined info



model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# --- PREPROCESSING (run once, save) ---
foundation_vectors = np.load('/static/foundation_vectors.npy')

def search(query_text):
    query_vector = model.encode([query_text])[0]

    from sklearn.metrics.pairwise import cosine_similarity
    scores = cosine_similarity(query_vector.reshape(1,-1), foundation_vectors)[0]

    ranked = np.argsort(scores)[::-1]
    return [(foundations[i]['name'], scores[i]) for i in ranked[:10]]


# ---------------------------------------------------------------------------
# Application vectorization — called during submit pipeline
# ---------------------------------------------------------------------------

def run(builder: "ApplicationSessionBuilder") -> list[float]:
    """Embed the applicant's text and store the result on the builder."""
    text = builder.to_text_for_vectorization()
    vector = embed(text)
    builder.application_vector = vector
    return vector


# ---------------------------------------------------------------------------
# Foundation pre-computation — run offline, not in the request cycle
# ---------------------------------------------------------------------------

def precompute_foundation_vectors(org_ids: list[int] | None = None) -> int:
    """Embed and persist vectors for all (or selected) organisations.

    Args:
        org_ids: Limit to these primary keys. None means all organisations.

    Returns:
        Number of FoundationVector rows created or updated.
    """
    from .models import FoundationVector, Organization

    queryset = Organization.objects.all()
    if org_ids is not None:
        queryset = queryset.filter(pk__in=org_ids)

    count = 0
    for org in queryset.iterator():
        text_parts = [
            p for p in [org.description, org.target_group_raw, org.applicants_raw]
            if p
        ]
        text = " ".join(text_parts).strip()
        if not text:
            continue  # skip orgs with no textual content to embed

        vector = embed(text)
        FoundationVector.objects.update_or_create(
            org=org,
            defaults={"vector": vector},
        )
        count += 1

    return count

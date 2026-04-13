"""
application_session.py
----------------------
Accumulates multi-page form state in Django's server-side session store.
Written to the database only on final submission (ApplicationSessionBuilder.save()).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from django.http import HttpRequest
    from .models import ApplicationSession

SESSION_KEY = "grant_application_builder"


@dataclass
class ApplicationSessionBuilder:
    applicant_kind: str | None = None
    field_1: str | None = None          # page 1 extra field
    field_2: str | None = None          # page 2 — project description (feeds vectorization)
    field_3: str | None = None          # page 3 — additional info
    layer1_passed_org_ids: list[int] | None = None
    application_vector: list[float] | None = None

    # ------------------------------------------------------------------
    # Page update methods — one per form step
    # ------------------------------------------------------------------

    def update_page1(self, applicant_kind: str, field_1: str = "") -> None:
        self.applicant_kind = applicant_kind
        self.field_1 = field_1

    def update_page2(self, field_2: str) -> None:
        self.field_2 = field_2

    def update_page3(self, field_3: str = "") -> None:
        self.field_3 = field_3

    # ------------------------------------------------------------------
    # Vectorization input
    # ------------------------------------------------------------------

    def to_text_for_vectorization(self) -> str:
        """Combine page 2 + page 3 text into a single string for embedding."""
        parts = [p for p in [self.field_2, self.field_3] if p]
        return " ".join(parts)

    # ------------------------------------------------------------------
    # DB persistence — called once, at final submission
    # ------------------------------------------------------------------

    def save(self) -> "ApplicationSession":
        from .models import ApplicationSession

        return ApplicationSession.objects.create(
            status=ApplicationSession.Status.SUBMITTED,
            applicant_kind=self.applicant_kind,
            field_1=self.field_1,
            field_2=self.field_2,
            field_3=self.field_3,
            layer1_passed_org_ids=self.layer1_passed_org_ids,
            application_vector=self.application_vector,
        )

    # ------------------------------------------------------------------
    # Django session serialisation
    # ------------------------------------------------------------------

    def to_session(self, request: "HttpRequest") -> None:
        request.session[SESSION_KEY] = {
            "applicant_kind": self.applicant_kind,
            "field_1": self.field_1,
            "field_2": self.field_2,
            "field_3": self.field_3,
            "layer1_passed_org_ids": self.layer1_passed_org_ids,
            "application_vector": self.application_vector,
        }

    @classmethod
    def from_session(cls, request: "HttpRequest") -> "ApplicationSessionBuilder":
        data = request.session.get(SESSION_KEY, {})
        return cls(
            applicant_kind=data.get("applicant_kind"),
            field_1=data.get("field_1"),
            field_2=data.get("field_2"),
            field_3=data.get("field_3"),
            layer1_passed_org_ids=data.get("layer1_passed_org_ids"),
            application_vector=data.get("application_vector"),
        )

    def clear_session(self, request: "HttpRequest") -> None:
        request.session.pop(SESSION_KEY, None)
